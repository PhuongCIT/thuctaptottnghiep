import moment from "moment-timezone";
import cron from "node-cron";
import Appointment from "../models/appointmentModel.js";
import Notification from "../models/notificationModel.js";
import { sendEmail } from "../config/emailService.js";

export const setupAppointmentReminders = () => {
  // Chạy mỗi ngày vào 9:00 sáng
  cron.schedule("0 9 * * *", async () => {
    try {
      console.log("Running appointment reminders check...");
      await sendAppointmentReminders();
    } catch (error) {
      console.error("Error in reminder cron job:", error);
    }
  });
};

export const sendAppointmentReminders = async (req, res) => {
  try {
    // Lấy thời gian hiện tại và ngày mai theo múi giờ Việt Nam
    const vietnamTz = "Asia/Ho_Chi_Minh";
    const now = moment().tz(vietnamTz);
    const tomorrow = moment().tz(vietnamTz).add(1, "days").startOf("day");
    const dayAfter = moment(tomorrow).add(1, "days");

    // Tìm các lịch hẹn cho ngày mai chưa bị hủy
    const appointments = await Appointment.find({
      date: {
        $gte: tomorrow.toDate(),
        $lt: dayAfter.toDate(),
      },
      status: {
        $in: ["pending", "confirmed"],
      },
    }).populate([
      { path: "customerId", select: "name email phone" },
      { path: "staffId", select: "name" },
      { path: "services", select: "name price" },
    ]);

    let sentCount = 0;

    for (const appointment of appointments) {
      // Kiểm tra xem đã gửi thông báo chưa
      const existingNotification = await Notification.findOne({
        relatedId: appointment._id,
        type: "appointment",
        title: "Nhắc nhở lịch hẹn",
      });

      if (!existingNotification) {
        // Format danh sách dịch vụ
        const servicesList = appointment.services
          .map((service) => service.name)
          .join(", ");

        // Format thời gian
        const appointmentTime = `${appointment.date.toLocaleDateString(
          "vi-VN"
        )} ${appointment.startTime}`;

        // Tạo nội dung email
        const emailSubject = "Nhắc nhở lịch hẹn tại SalonHair";
        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Xin chào ${appointment.customerId.name},</h2>
            <p>Chúng tôi xin nhắc bạn về lịch hẹn vào ngày mai:</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Thời gian:</strong> ${appointmentTime}</p>
              <p><strong>Dịch vụ:</strong> ${servicesList}</p>
              ${
                appointment.staffId
                  ? `<p><strong>Nhân viên phục vụ:</strong> ${appointment.staffId.name}</p>`
                  : ""
              }
              <p><strong>Tổng chi phí:</strong> ${appointment.totalPrice.toLocaleString(
                "vi-VN"
              )}đ</p>
            </div>
            <p>Để đảm bảo được phục vụ tốt nhất, vui lòng đến đúng giờ đã hẹn.</p>
            <p>Nếu bạn cần thay đổi lịch hẹn, vui lòng liên hệ với chúng tôi sớm nhất có thể.</p>
            <div style="margin-top: 20px;">
              <p>Trân trọng,</p>
              <p><strong>Đội ngũ SalonHair</strong></p>
            </div>
          </div>
        `;

        console.log(
          "Attempting to send email to:",
          appointment.customerId.email
        );

        // Gửi email
        const emailSent = await sendEmail(
          appointment.customerId.email,
          emailSubject,
          emailBody
        );

        console.log("Email sent status:", emailSent);

        if (emailSent) {
          try {
            // Tạo notification với thông tin đầy đủ
            const newNotification = await Notification.create({
              userId: appointment.customerId._id,
              title: "Nhắc nhở lịch hẹn",
              message: `Bạn có lịch hẹn vào ${appointmentTime}`,
              type: "appointment",
              relatedId: appointment._id,
              status: "unread", // Thêm trường status nếu model yêu cầu
              createdAt: new Date(), // Thêm timestamp nếu cần
            });

            console.log("Created notification:", newNotification);
            sentCount++;
          } catch (notificationError) {
            console.error("Error creating notification:", {
              error: notificationError.message,
              appointment: appointment._id,
              customer: appointment.customerId._id,
            });
          }
        }
      }
    }

    const response = {
      success: true,
      message: `Đã gửi ${sentCount} thông báo nhắc nhở`,
      total: appointments.length,
    };

    console.log("Final response:", response);

    if (res) {
      res.json(response);
    }

    return sentCount;
  } catch (error) {
    console.error("Error sending reminders:", error);
    if (res) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi gửi thông báo",
        error: error.message,
      });
    }
    throw error;
  }
};

// API endpoint để gửi thông báo thủ công
export const sendRemindersManually = async (req, res) => {
  try {
    await sendAppointmentReminders(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi gửi thông báo",
      error: error.message,
    });
  }
};
