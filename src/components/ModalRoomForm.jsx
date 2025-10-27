import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiX, FiUpload } from "react-icons/fi";

const INITIAL_STATE = {
  id: null,
  name: "",
  type: "Medium",
  price: 0,
  capacity: 10,
  image: "",
};

export default function ModalRoomForm({ isOpen, onClose, onSubmit, roomData }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const isEditMode = !!roomData;

  useEffect(() => {
    if (isOpen) {
      setFormData(roomData || INITIAL_STATE);
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [isOpen, roomData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "capacity" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.capacity) {
      alert("Mohon isi semua field yang wajib.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50">
      <div className="bg-white h-full w-full max-w-md p-6 overflow-y-auto shadow-2xl relative">
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isEditMode ? "Edit Room" : "Add New Room"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Tutup Modal"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Room Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div className="py-8">
                <FiUpload
                  size={32}
                  className="mx-auto text-gray-400"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop files here
                </p>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  className="mt-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Upload File
                </button>
              </div>
            )}
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label
              htmlFor="room-name"
              className="block text-sm font-medium text-gray-700"
            >
              Room Name
            </label>
            <input
              type="text"
              id="room-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Daisy Room"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="room-type"
              className="block text-sm font-medium text-gray-700"
            >
              Room Type
            </label>
            <select
              id="room-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="price-hours"
              className="block text-sm font-medium text-gray-700"
            >
              Price/Hours
            </label>
            <input
              type="number"
              id="price-hours"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="500000"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700"
            >
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="25"
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-[416px] h-[48px] bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalRoomForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  roomData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    type: PropTypes.string,
    price: PropTypes.number,
    capacity: PropTypes.number,
    image: PropTypes.string,
  }),
};
