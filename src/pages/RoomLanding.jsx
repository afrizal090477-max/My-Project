import React from "react";
import RoomCard from "../components/RoomCard"; // pastikan path betul

const DUMMY_ROOMS_BASE = [
  { id: 1, name: "Aster Room", type: "Small", capacity: 12, price: 200000 },
  { id: 2, name: "Bluebell Room", type: "Medium", capacity: 10, price: 350000 },
  { id: 3, name: "Camellia Room", type: "Large", capacity: 8, price: 250000 },
  { id: 4, name: "Daisy Room", type: "Small", capacity: 6, price: 180000 },
  { id: 5, name: "Edelweiss Room", type: "Medium", capacity: 10, price: 300000 },
  { id: 6, name: "Freesia Room", type: "Large", capacity: 5, price: 200000 },
  { id: 7, name: "Gardenia Room", type: "Small", capacity: 6, price: 180000 },
  { id: 8, name: "Hibiscus Room", type: "Medium", capacity: 8, price: 250000 },
  { id: 9, name: "Ivy Room", type: "Large", capacity: 12, price: 300000 },
  { id: 10, name: "Jasmine Room", type: "Small", capacity: 5, price: 180000 },
  { id: 11, name: "Lily Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 12, name: "Magnolia Room", type: "Large", capacity: 8, price: 300000 },
  { id: 13, name: "Narcissus Room", type: "Small", capacity: 6, price: 180000 },
  { id: 14, name: "Orchid Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 15, name: "Peony Room", type: "Large", capacity: 5, price: 180000 },
  { id: 16, name: "Rose Room", type: "Small", capacity: 6, price: 180000 },
  { id: 17, name: "Sunflower Room", type: "Medium", capacity: 8, price: 250000 },
  { id: 18, name: "Tulip Room", type: "Large", capacity: 12, price: 300000 },
  { id: 19, name: "Violet Room", type: "Small", capacity: 5, price: 180000 },
  { id: 20, name: "Willow Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 21, name: "Xenia Room", type: "Large", capacity: 8, price: 300000 },
  { id: 22, name: "Yarrow Room", type: "Small", capacity: 6, price: 180000 },
  { id: 23, name: "Zinnia Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 24, name: "Azalea Room", type: "Large", capacity: 5, price: 180000 },


];

export default function RoomLanding() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1320px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rooms</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DUMMY_ROOMS_BASE.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}
