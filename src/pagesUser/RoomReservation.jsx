import React, { useMemo, useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import RoomCardUser from "../components/RoomCardUser";
import ReservationForm from "../components/ReservationForm";
import ReservationSchedule from "../components/ReservationSchedule";
import ReservationDetails from "../components/ReservationDetails";
import RoomDetailDemoUser from "../components/RoomDetailDemoUser";
import { fetchRooms } from "../API/roomAPI";
import { createReservation } from "../API/reservationAPI";
import { fetchSnacks } from "../API/snackAPI"; // Service snack harus tersedia dan return array snack {id, name, price}

const ITEMS_PER_PAGE = 12;

export default function RoomReservation() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ search: "", type: "", capacity: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [step, setStep] = useState("");
  const [reservationData, setReservationData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState("");

  // snack dari endpoint
  const [snacks, setSnacks] = useState([]);
  const [loadingSnacks, setLoadingSnacks] = useState(false);
  const [errorSnacks, setErrorSnacks] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomsFromAPI = await fetchRooms();
        const mappedRooms = (roomsFromAPI?.data || roomsFromAPI || []).map((room) => ({
          id: room.id,
          name: room.room_name || room.name || "-",
          type: room.room_type || room.type || "-",
          capacity: room.capacity ?? 0,
          price: room.price ?? 0,
          status: room.status || "Unknown",
          image: room.image,
        }));
        setRooms(mappedRooms);
      } catch (err) {
        setRooms([]);
        setError("Room data cannot be loaded");
      }
    };
    fetchRoomData();
  }, []);

  // fetch snack dari endpoint, tanpa dummy
  useEffect(() => {
    setLoadingSnacks(true);
    fetchSnacks()
      .then((data) => setSnacks(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => setErrorSnacks("Failed to load snacks"))
      .finally(() => setLoadingSnacks(false));
  }, []);

  const filteredRooms = useMemo(() => {
    const search = filters.search.toLowerCase();
    const type = filters.type;
    const minCapacity = filters.capacity ? parseInt(filters.capacity, 10) : null;
    return rooms.filter((room) => {
      const matchSearch = (room.name || "").toLowerCase().includes(search);
      const matchType = type ? (room.type && room.type.toLowerCase() === type.toLowerCase()) : true;
      const matchCapacity = minCapacity !== null ? Number(room.capacity) >= minCapacity : true;
      return matchSearch && matchType && matchCapacity;
    });
  }, [rooms, filters]);

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE) || 1;
  const safeRoomsToDisplay = filteredRooms.filter(
    (room) => typeof room.name === "string" && room.name.length > 0
  );
  const roomsToDisplay = safeRoomsToDisplay.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleRoomCardClick = (room) => setSelectedRoom(room);

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

  //--- Kalkulasi detail, harga snack via snack endpoint API ---//
  let reservationDetailsData = { ...reservationData };
  if (step === "DETAILS") {
    const roomDetail = rooms.find(
      (room) => room.name === (reservationData.room || reservationData.roomName)
    ) || {};
    const roomPrice = roomDetail.price || 0;
    let duration = 1;
    if (reservationData.startTime && reservationData.endTime) {
      const [sh, sm] = reservationData.startTime.split(":").map(Number);
      const [eh, em] = reservationData.endTime.split(":").map(Number);
      duration = Math.max(1, eh + em / 60 - sh - sm / 60);
    }
    const participants = parseInt(reservationData.participants || "1", 10);
    
    // Harga snack langsung dari snacks yang di-fetch endpoint
    const snackInfo = snacks.find(opt => 
      opt.id === reservationData.snackCategory ||
      opt.value === reservationData.snackCategory ||
      opt.name === reservationData.snackCategory
    );
    const snackUnitPrice = snackInfo ? Number(snackInfo.price) : 0;
    
    const detailRoomPrice = reservationData.startTime && reservationData.endTime ? duration * roomPrice : 0;
    const detailSnackPrice = reservationData.addSnack ? snackUnitPrice * participants : 0;
    const total = detailRoomPrice + detailSnackPrice;
    reservationDetailsData = {
      ...reservationDetailsData,
      roomName: roomDetail.name || "-",
      roomType: roomDetail.type || "-",
      roomCapacity: roomDetail.capacity ? `${roomDetail.capacity} people` : "-",
      roomPrice: roomDetail.price ? `Rp ${roomDetail.price.toLocaleString()}` : "-",
      detailRoomPrice,
      detailSnackPrice,
      total,
    };
  }

  return (
    <div className="p-2 sm:p-6 bg-gray-50 min-h-screen relative">
      <div style={{ display: "none" }}>
        <RoomDetailDemoUser />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-[1320px] mx-auto px-2 sm:px-6 py-4 flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 md:items-center flex-1">
          <div className="relative flex-1 min-w-[180px] sm:min-w-[240px] max-w-[362px]">
            <input
              type="text"
              placeholder="Search room..."
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full h-[44px] sm:h-[48px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            className="border border-gray-300 rounded-lg w-full sm:w-[180px] md:w-[180px] h-[44px] sm:h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
          >
            <option value="">Room Type</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <select
            value={filters.capacity}
            onChange={(e) => setFilters((f) => ({ ...f, capacity: e.target.value }))}
            className="border border-gray-300 rounded-lg w-full sm:w-[180px] md:w-[180px] h-[44px] sm:h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
          >
            <option value="">Capacity</option>
            <option value="10">≤ 10 people</option>
            <option value="20">≤ 20 people</option>
            <option value="50">≤ 50 people</option>
          </select>
        </div>
        <button
          onClick={handleAddReservation}
          className={`bg-orange-600 hover:bg-orange-700 text-white font-medium min-w-[150px] w-full sm:w-[180px] h-[44px] sm:h-[48px] px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${
            !selectedRoom ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedRoom}
        >
          <FiPlus size={20} />
          <span className="whitespace-nowrap">Add New Reservation</span>
        </button>
      </div>
      <div className="bg-white rounded-xl w-full max-w-[1320px] mx-auto shadow-sm border border-gray-200 px-2 sm:px-6 py-4 sm:py-5">
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
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
      {step === "SCHEDULE" && (
        <ReservationSchedule
          isOpen
          roomName={reservationData.roomName}
          onClose={() => setStep("")}
          onNext={(scheduleData) => {
            setReservationData((prev) => ({
              ...prev,
              ...scheduleData,
              room: reservationData.room,
              roomName: reservationData.roomName,
            }));
            setStep("FORM");
          }}
        />
      )}
      {step === "FORM" && (
        <ReservationForm
          isOpen
          data={reservationData}
          snacks={snacks}
          loadingSnacks={loadingSnacks}
          errorSnacks={errorSnacks}
          onClose={() => setStep("")}
          onSubmit={async (formData) => {
            const masterRoom =
              rooms.find(
                (room) =>
                  room.name ===
                  (reservationData.room ||
                    formData.roomName ||
                    reservationData.roomName ||
                    "")
              ) || {};
            const finalData = {
              ...reservationData,
              ...formData,
              room: masterRoom.name,
              roomName: masterRoom.name,
              roomType: masterRoom.type,
              roomCapacity: masterRoom.capacity ? `${masterRoom.capacity} people` : "-",
              roomPrice: masterRoom.price ? `Rp ${masterRoom.price.toLocaleString()}` : "-",
            };
            try {
              await createReservation(finalData);
              setReservationData(finalData);
              setStep("DETAILS");
              showSuccessToast();
            } catch {
              alert("Failed to add reservation!");
            }
          }}
        />
      )}
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
      {showSuccess && (
        <div className="fixed right-4 sm:right-10 top-20 sm:top-24 z-50">
          <div className="bg-white border border-green-400 text-green-600 px-4 sm:px-6 py-3 rounded-md shadow-lg text-base font-semibold flex items-center gap-2">
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
