import React, { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";

const DUMMY_ROOMS = [
  { id: 1, name: "Aster Room", type: "Small", capacity: 10, price: 500000, image: "/images/rooms/aster.jpg", status: "Available" },
  { id: 2, name: "Bluebell Room", type: "Medium", capacity: 15, price: 600000, image: "/images/rooms/bluebell.jpg", status: "Available" },
  { id: 3, name: "Camellia Room", type: "Large", capacity: 20, price: 900000, image: "/images/rooms/camellia.jpg", status: "Available" },
  // ...tambahkan data dummy lain
];

export default function RoomReservation() {
  const [rooms] = useState(DUMMY_ROOMS);
  const [filters, setFilters] = useState({ search: "", type: "", capacity: "" });

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch = room.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type ? room.type === filters.type : true;
      const matchCapacity = filters.capacity ? room.capacity >= Number.parseInt(filters.capacity, 10) : true;
      return matchSearch && matchType && matchCapacity;
    });
  }, [rooms, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8">
      
      
      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 items-center mb-8 bg-white p-4 shadow rounded-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter the keyword here..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-[270px] h-[42px] pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="border border-gray-300 rounded-lg w-[170px] h-[42px] px-3 bg-white text-gray-700"
        >
          <option value="">Room Type</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
        <select
          value={filters.capacity}
          onChange={(e) => handleFilterChange("capacity", e.target.value)}
          className="border border-gray-300 rounded-lg w-[170px] h-[42px] px-3 bg-white text-gray-700"
        >
          <option value="">Capacity</option>
          <option value="10">≤ 10 people</option>
          <option value="20">≤ 20 people</option>
          <option value="50">≤ 50 people</option>
        </select>
        <button className="border bg-orange-500 hover:bg-orange-600 text-white font-medium w-[100px] h-[42px] rounded-lg transition">
          Search
        </button>
        {/* Next: Button add reservation, modal schedule, dsb, bisa ditambah nanti */}
      </div>

      {/* Grid Room */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow border p-3 flex flex-col">
            <img src={room.image} alt={room.name} className="w-full h-36 rounded-lg object-cover mb-3" />
            <div className="flex gap-2 items-center mb-2">
              <span className="text-lg font-semibold">{room.name}</span>
              <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">{room.type}</span>
            </div>
            <span className="text-sm text-gray-500 mb-1">{room.capacity} people</span>
            <span className="text-sm text-gray-500 mb-1">Rp {room.price.toLocaleString()}/hours</span>
            <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
