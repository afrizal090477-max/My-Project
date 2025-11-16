import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiX, FiUpload } from "react-icons/fi";
import {
  addRoom,
  updateRoom,
} from "../API/roomAPI"; // Hapus import fetchRoomTypes dan fetchCapacities karena static dropdown


const INITIAL_STATE = {
  id: null,
  name: "",
  type: "",
  price: 10000,
  capacity: 1,
  image: "",
};


export default function ModalEditRoom({
  isOpen,
  onClose,
  roomData,
  afterSubmit,
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [rawPrice, setRawPrice] = useState("");
  // Gunakan static dropdown langsung di komponen ini
  const roomTypes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];
  const capacities = [
    { value: 4, label: "4 People" },
    { value: 8, label: "8 People" },
    { value: 12, label: "12 People" },
    { value: 20, label: "20 People" },
    { value: 30, label: "30 People" },
  ];
  const [loading, setLoading] = useState(false);

  const isEditMode = !!roomData;

  useEffect(() => {
    if (isOpen) {
      setFormData(roomData || INITIAL_STATE);
      setRawPrice(roomData?.price ? `${roomData.price}` : "");
    } else {
      setFormData(INITIAL_STATE);
      setRawPrice("");
    }
  }, [isOpen, roomData]);


  const formatCurrency = (num) => (!num ? "" : Number(num).toLocaleString("id-ID"));
  const stripCurrency = (value) => (!value ? "" : value.toString().replace(/\./g, "").replace(/\D/g, ""));
  const handlePriceChange = (e) => {
    let value = stripCurrency(e.target.value);
    setRawPrice(value);
    setFormData((prev) => ({
      ...prev,
      price: Number(value)
    }));
  };
  const handlePriceBlur = () => setRawPrice(formData.price ? `${formData.price}` : "");
  const handlePriceFocus = () => setRawPrice(formData.price ? `${formData.price}` : "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      // Untuk upload ke BE, silakan tambahkan logic FormData dan upload via API
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.capacity) {
      alert("Mohon isi semua field yang wajib.");
      return;
    }
    setLoading(true);
    try {
      if (isEditMode && formData.id) {
        await updateRoom(formData.id, formData);
        alert("Room updated successfully!");
      } else {
        await addRoom(formData);
        alert("Room added successfully!");
      }
      if (afterSubmit) afterSubmit(formData);
      onClose();
    } catch (error) {
      alert("Failed to save room!");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full max-w-md w-full bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{isEditMode ? "Edit Room" : "Add New Room"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Tutup Modal">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {formData.image ? (
              <div className="relative">
                <img src={formData.image} alt="Room Preview" className="w-full h-48 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => document.getElementById("image-upload").click()}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div className="py-8">
                <FiUpload size={32} className="mx-auto text-gray-400" aria-hidden="true" />
                <p className="mt-2 text-sm text-gray-500">Drag and drop files here</p>
                <button
                  type="button"
                  onClick={() => document.getElementById("image-upload").click()}
                  className="mt-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Upload File
                </button>
              </div>
            )}
            <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
          <div>
            <label htmlFor="room-name" className="block text-sm font-medium text-gray-700">Room Name</label>
            <input
              type="text"
              id="room-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Room Name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="room-type" className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              id="room-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white"
              required
            >
              {roomTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price-hours" className="block text-sm font-medium text-gray-700">Price/Hours</label>
            <input
              type="text"
              id="price-hours"
              name="price"
              value={rawPrice ? formatCurrency(rawPrice) : ""}
              onChange={handlePriceChange}
              onFocus={handlePriceFocus}
              onBlur={handlePriceBlur}
              min={0}
              placeholder="Price"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
              inputMode="numeric"
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
            <select
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white"
              required
            >
              {capacities.map((cap) => (
                <option key={cap.value} value={cap.value}>{cap.label}</option>
              ))}
            </select>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalEditRoom.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  roomData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    type: PropTypes.string,
    price: PropTypes.number,
    capacity: PropTypes.number,
    image: PropTypes.string,
  }),
  afterSubmit: PropTypes.func,
};
