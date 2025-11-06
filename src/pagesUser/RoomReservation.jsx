import React, { useMemo, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import RoomCardUser from "../components/RoomCardUser";
import ReservationForm from "../components/ReservationForm";
import ReservationSchedule from "../components/ReservationSchedule";
import ReservationDetails from "../components/ReservationDetails";

// ------ Helper functions & dummy data ------
function getSnackPrice(snackCategory) {
  const prices = {
    coffee1: 20000,
    coffee2: 50000,
    lunch1: 20000,
    lunch2: 50000,
  };
  return prices[snackCategory] || 0;
}
function getDuration(start, end) {
  if (!start || !end) return 1;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(1, eh + em / 60 - sh - sm / 60);
}
const DUMMY_ROOMS_BASE = [
  { id: 1, name: "Aster Room", type: "Small", capacity: 6, price: 200000, status: "Available" },
  { id: 2, name: "Bluebell Room", type: "Medium", capacity: 10, price: 350000, status: "Booked" },
  { id: 3, name: "Camellia Room", type: "Small", capacity: 8, price: 250000, status: "Available" },
  { id: 4, name: "Daisy Room", type: "Medium", capacity: 12, price: 300000, status: "Available" },
  { id: 5, name: "Edelweiss Room", type: "Large", capacity: 20, price: 450000, status: "Booked" },
  { id: 6, name: "Freesia Room", type: "Small", capacity: 5, price: 180000, status: "Available" },
  { id: 7, name: "Gardenia Room", type: "Medium", capacity: 15, price: 320000, status: "Booked" },
  { id: 8, name: "Hibiscus Room", type: "Large", capacity: 25, price: 500000, status: "Available" },
  { id: 9, name: "Ivy Room", type: "Small", capacity: 6, price: 200000, status: "Booked" },
  { id: 10, name: "Jasmine Room", type: "Medium", capacity: 12, price: 350000, status: "Available" },
  { id: 11, name: "Lily Room", type: "Large", capacity: 18, price: 400000, status: "Available" },
  { id: 12, name: "Magnolia Room", type: "Small", capacity: 7, price: 220000, status: "Booked" },
  { id: 13, name: "Narcissus Room", type: "Medium", capacity: 10, price: 330000, status: "Available" },
  { id: 14, name: "Orchid Room", type: "Large", capacity: 22, price: 480000, status: "Available" },
  { id: 15, name: "Peony Room", type: "Small", capacity: 6, price: 210000, status: "Booked" },
  { id: 16, name: "Rose Room", type: "Medium", capacity: 12, price: 360000, status: "Available" },
  { id: 17, name: "Sunflower Room", type: "Large", capacity: 20, price: 500000, status: "Available" },
  { id: 18, name: "Tulip Room", type: "Small", capacity: 6, price: 220000, status: "Booked" },
  { id: 19, name: "Violet Room", type: "Medium", capacity: 10, price: 340000, status: "Available" },
  { id: 20, name: "Willow Room", type: "Large", capacity: 25, price: 480000, status: "Booked" },
  { id: 21, name: "Xenia Room", type: "Small", capacity: 5, price: 200000, status: "Available" },
  { id: 22, name: "Yarrow Room", type: "Medium", capacity: 12, price: 340000, status: "Booked" },
  { id: 23, name: "Zinnia Room", type: "Large", capacity: 20, price: 470000, status: "Available" },
  { id: 24, name: "Azalea Room", type: "Small", capacity: 6, price: 230000, status: "Available" },
];
const ITEMS_PER_PAGE = 12;

function getRoomDetailByName(roomName) {
  return DUMMY_ROOMS_BASE.find((room) => room.name === roomName) || {};
}

// ------ Full RoomReservation Component ------
export default function RoomReservation() {
  const [rooms] = useState(DUMMY_ROOMS_BASE);
  const [filters, setFilters] = useState({ search: "", type: "", capacity: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [step, setStep] = useState(""); // "", "SCHEDULE", "FORM", "DETAILS"
  const [reservationData, setReservationData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const filteredRooms = useMemo(() => {
    const search = filters.search.toLowerCase();
    const type = filters.type;
    const minCapacity = filters.capacity ? parseInt(filters.capacity, 10) : null;
    return rooms.filter((room) => {
      const matchSearch = room.name.toLowerCase().includes(search);
      const matchType = type ? room.type === type : true;
      const matchCapacity = minCapacity !== null ? room.capacity >= minCapacity : true;
      return matchSearch && matchType && matchCapacity;
    });
  }, [rooms, filters]);
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE) || 1;
  const roomsToDisplay = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // -- SELECT ROOM BY CARD --
  const handleRoomCardClick = (room) => {
    setSelectedRoom(room);
  };

  // -- ADD NEW RESERVATION: Buka modal hanya bila room terpilih
  const handleAddReservation = () => {
    if (!selectedRoom) {
      alert("Pilih room terlebih dulu!");
      return;
    }
    setReservationData({
      room: selectedRoom.name,
      roomName: selectedRoom.name,
      roomType: selectedRoom.type,
      roomCapacity: selectedRoom.capacity ? `${selectedRoom.capacity} people` : "-",
      roomPrice: selectedRoom.price ? `Rp ${selectedRoom.price.toLocaleString()}` : "-",
    });
    setStep("SCHEDULE");
  };

  const showSuccessToast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // -- Perhitungan detail
  let reservationDetailsData = { ...reservationData };
  if (step === "DETAILS") {
    const masterRoom = getRoomDetailByName(reservationData.room || reservationData.roomName || "");
    const roomPrice = masterRoom.price || 0;
    let duration = 1;
    if (reservationData.startTime && reservationData.endTime) {
      const [sh, sm] = reservationData.startTime.split(":").map(Number);
      const [eh, em] = reservationData.endTime.split(":").map(Number);
      duration = Math.max(1, eh + em / 60 - sh - sm / 60);
    }
    const participants = parseInt(reservationData.participants || "1", 10);
    const snackUnitPrice = getSnackPrice(reservationData.snackCategory);
    const detailRoomPrice = (reservationData.startTime && reservationData.endTime) ? duration * roomPrice : 0;
    const detailSnackPrice = reservationData.addSnack ? snackUnitPrice * participants : 0;
    const total = detailRoomPrice + detailSnackPrice;
    reservationDetailsData = {
      ...reservationDetailsData,
      roomName: masterRoom.name || "-",
      roomType: masterRoom.type || "-",
      roomCapacity: masterRoom.capacity ? `${masterRoom.capacity} people` : "-",
      roomPrice: masterRoom.price ? `Rp ${masterRoom.price.toLocaleString()}` : "-",
      detailRoomPrice,
      detailSnackPrice,
      total,
    };
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* ---- FILTER & ADD BUTTON ---- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-[1320px] h-[80px] mx-auto p-4 flex flex-wrap items-center justify-between gap-4 relative">
        <div className="flex flex-wrap gap-4 items-center flex-1">
          <div className="relative flex-1 min-w-[304px] max-w-[362px]">
            <input
              type="text"
              placeholder="Search room..."
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="w-full h-[48px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <FiSearch
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((f) => ({ ...f, type: e.target.value }))
            }
            className="border border-gray-300 rounded-lg w-[280px] h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">Room Type</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
          <select
            value={filters.capacity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, capacity: e.target.value }))
            }
            className="border border-gray-300 rounded-lg w-[280px] h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">Capacity</option>
            <option value="10">≤ 10 people</option>
            <option value="20">≤ 20 people</option>
            <option value="50">≤ 50 people</option>
          </select>
        </div>
        <button
          onClick={handleAddReservation}
          className={`bg-orange-600 hover:bg-orange-700 text-white font-medium w-[198px] h-[48px] px-6 rounded-lg transition flex items-center gap-2 shadow-sm hover:shadow-md ${!selectedRoom ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedRoom}
        >
          <FiPlus size={20} />
          <span className="whitespace-nowrap">Add New Reservation</span>
        </button>
      </div>
      {/* ---- Room Card GRID ---- */}
      <div className="bg-white rounded-xl max-w-[1320px] mx-auto shadow-sm border border-gray-200 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roomsToDisplay.map((room) => (
            <RoomCardUser
              key={room.id}
              room={room}
              onClick={() => handleRoomCardClick(room)}
              isSelected={selectedRoom?.id === room.id}
            />
          ))}
        </div>
        {/* ---- Pagination ---- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronLeft />
            </button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
      {/* ---- MODAL STEP SCHEDULE ---- */}
      {step === "SCHEDULE" && (
        <ReservationSchedule
          isOpen
          roomName={reservationData.roomName}
          onClose={() => setStep("")}
          onNext={(scheduleData) => {
            setReservationData((prev) => ({ ...prev, ...scheduleData }));
            setStep("FORM");
          }}
        />
      )}
      {/* ---- FORM STEP ---- */}
      {step === "FORM" && (
        <ReservationForm
          isOpen
          data={reservationData}
          onClose={() => setStep("")}
          onSubmit={(formData) => {
            const masterRoom = getRoomDetailByName(
              reservationData.room || formData.roomName || reservationData.roomName || ""
            );
            setReservationData((prev) => ({
              ...prev,
              ...formData,
              room: masterRoom.name,
              roomName: masterRoom.name,
              roomType: masterRoom.type,
              roomCapacity: masterRoom.capacity ? `${masterRoom.capacity} people` : "-",
              roomPrice: masterRoom.price ? `Rp ${masterRoom.price.toLocaleString()}` : "-",
            }));
            setStep("DETAILS");
          }}
        />
      )}
      {/* ---- DETAILS STEP ---- */}
      {step === "DETAILS" && (
        <ReservationDetails
          isOpen
          data={reservationDetailsData}
          onClose={() => setStep("")}
          onSubmit={() => {
            setStep("");
            showSuccessToast();
          }}
        />
      )}
      {/* ---- Toast Success ---- */}
      {showSuccess && (
        <div className="fixed right-10 top-24 z-50">
          <div className="bg-white border border-green-400 text-green-600 px-6 py-3 rounded-md shadow-lg text-base font-semibold flex items-center gap-2">
            <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="11" fill="#2ED477" />
              <path
                d="M6 11.8462L9.23077 15L16 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New Reservation Successfully Added
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-2 text-gray-400 hover:text-green-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
