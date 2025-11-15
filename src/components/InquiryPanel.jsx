import React, { useState } from "react";

export default function InquiryPanel({ onResult }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleInquiry = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/v1/reservations/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationCode: code }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Inquiry failed");
      }
      const data = await response.json();
      setResult(data.data || data);
      onResult && onResult(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Reservation Inquiry</h2>
      <input
        type="text"
        placeholder="Enter reservation code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        onClick={handleInquiry}
        disabled={!code || loading}
        className={`w-full py-2 mb-4 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition ${(!code || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Checking..." : "Check Reservation"}
      </button>

      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}

      {result && (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-700 text-sm">
          {/* Customize below based on your data fields */}
          <p><strong>Reservation Code:</strong> {result.code || "-"}</p>
          <p><strong>Name:</strong> {result.name || result.booker_name || "-"}</p>
          <p><strong>Room:</strong> {result.room || "-"}</p>
          <p><strong>Date:</strong> {result.dateStart || result.start_date || "-"}</p>
          <p><strong>Status:</strong> {result.status || "-"}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
}
