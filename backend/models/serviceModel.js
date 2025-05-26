import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    image: { type: String },
    isActive: { type: Boolean, default: true },
    totalRatings: { type: Number, default: 0 },
    sumRatings: { type: Number, default: 0 },
    averageRating: {
      type: Number,
      default: 0,
      set: function () {
        return this.totalRatings > 0 ? this.sumRatings / this.totalRatings : 0;
      },
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
