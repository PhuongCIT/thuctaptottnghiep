import React from "react";
import DatePicker from "./admin/shift/DatePicker";

const Modal = () => {
  return (
    <div>
      <div className="">
        <button popoverTarget="modal" className="bg-amber-300">
          Modal box
        </button>
        <div
          className=" absolute border border-amber-300"
          id="modal"
          popover="modal"
        >
          <h1>Modal box</h1>
          <p>this is a modal box</p>
          <DatePicker />
          <button popoverTarget="modal" className="bg-red-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
