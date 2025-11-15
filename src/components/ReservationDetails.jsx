import React from "react";
import PropTypes from "prop-types";

export default function ReservationDetails({
  isOpen,
  data = {},
  onClose,
  onSubmit
}) {
  if (!isOpen) return null;

  const {
    roomName,
    roomType,
    roomCapacity,
    roomPrice,
    name,
    phone,
    company,
    reservationDate,
    duration,
    participants,
    snackCategory,
    snackPackages,
    note,
    detailRoomPrice,
    detailSnackPrice,
    total
  } = data;

  return (
    // TANPA backdrop — langsung modal tampil sesuai permintaanmu!
    <div className="fixed top-0 right-0 w-[456px] h-full z-50 bg-white shadow-2xl flex flex-col px-8 pt-3 pb-6 overflow-y-auto transition-all">
      <div className="flex items-center h-[56px] mb-4 sticky top-0 bg-white z-10">
        <button onClick={onClose} className="mr-3 p-0" aria-label="Back" type="button">
          <svg width={28} height={28} fill="none" viewBox="0 0 28 28">
            <path d="M18 22L10 14L18 6" stroke="#FF7316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="font-semibold text-lg text-gray-800 mt-1">Reservation Details</span>
      </div>
      <div className="flex flex-col gap-5">
        {/* Room Details */}
        <div>
          <div className="text-[15px] font-medium mb-2 mt-1 text-gray-800">Room Details</div>
          <div className="text-sm text-gray-600 flex flex-col gap-0.5">
            <div className="flex justify-between"><span>Room Name</span><span className="font-semibold">{roomName}</span></div>
            <div className="flex justify-between"><span>Room Type</span><span>{roomType}</span></div>
            <div className="flex justify-between"><span>Capacity</span><span>{roomCapacity}</span></div>
            <div className="flex justify-between"><span>Price/hours</span><span>{roomPrice}</span></div>
          </div>
        </div>
        {/* Personal Data */}
        <div>
          <div className="text-[15px] font-medium mb-2 mt-1 text-gray-800">Personal Data</div>
          <div className="text-sm text-gray-600 flex flex-col gap-0.5">
            <div className="flex justify-between"><span>Name</span><span className="font-semibold">{name}</span></div>
            <div className="flex justify-between"><span>No.Hp</span><span>{phone}</span></div>
            <div className="flex justify-between"><span>Company/Organization</span><span>{company}</span></div>
            <div className="flex justify-between"><span>Reservation Date</span><span>{reservationDate}</span></div>
            <div className="flex justify-between"><span>Duration</span><span>{duration}</span></div>
            <div className="flex justify-between"><span>Total Participants</span><span>{participants}</span></div>
          </div>
        </div>
        {/* Snack Details */}
        <div>
          <div className="text-[15px] font-medium mb-2 mt-1 text-gray-800">Snack Details</div>
          <div className="text-sm text-gray-600 flex flex-col gap-0.5">
            <div className="flex justify-between"><span>Snack Category</span><span>{snackCategory}</span></div>
            <div className="flex justify-between"><span>Packages</span><span>{snackPackages}</span></div>
          </div>
        </div>
        {/* Total */}
        <div>
          <div className="text-[15px] font-medium mb-2 mt-1 text-gray-800">Total</div>
          <div className="text-sm text-gray-800 flex flex-col gap-0.5">
            <div className="flex justify-between">
              <span>{roomName}</span>
              <span>{detailRoomPrice !== undefined ? detailRoomPrice.toLocaleString("id-ID") : 0}</span>
            </div>
            <div className="flex justify-between">
              <span>{snackPackages || snackCategory}</span>
              <span>{detailSnackPrice !== undefined ? detailSnackPrice.toLocaleString("id-ID") : 0}</span>
            </div>
            <hr className="my-1" />
            <div className="flex justify-between text-xl font-bold">
              <span></span>
              <span>Rp {total !== undefined ? total.toLocaleString("id-ID") : 0}</span>
            </div>
          </div>
        </div>
        {/* Note */}
        <div>
          <div className="text-[15px] font-medium mb-1 mt-2 text-gray-800">Note</div>
          <div className="text-sm text-gray-600">{note}</div>
        </div>
        {/* Submit */}
        <button
          type="button"
          onClick={onSubmit}
          className="w-full h-12 bg-[#FF7316] text-white text-lg font-semibold rounded-lg mt-3 mb-2 shadow-sm hover:bg-orange-600 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

ReservationDetails.propTypes = {
  isOpen: PropTypes.bool,
  data: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
