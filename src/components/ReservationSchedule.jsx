import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { FiCalendar } from "react-icons/fi";

// Full 24 jam
const SLOT_START = 0;
const SLOT_END = 23;

function generateTimes() {
  const arr = [];
  for (let h = SLOT_START; h <= SLOT_END; h++) {
    arr.push(h.toString().padStart(2, "0") + ":00");
  }
  return arr;
}
function parseHour(str) {
  return parseInt(str.split(":")[0], 10);
}

export default function ReservationSchedule({
  isOpen,
  onClose,
  onNext,
  roomName = "",
  bookedTimes = {},
}) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [clickStart, setClickStart] = useState(null);
  const [clickEnd, setClickEnd] = useState(null);
  const inputRef = useRef();

  const times = generateTimes();
  const rowHeight = 29;

  const getBookedRanges = () =>
    bookedTimes[selectedDate] || [];

  function isBooked(idx) {
    return getBookedRanges().some(
      ([start, end]) =>
        idx >= parseHour(start) &&
        idx < parseHour(end)
    );
  }

  function getRangeStatus(idx) {
    if (
      clickStart !== null &&
      clickEnd !== null &&
      idx >= clickStart &&
      idx < clickEnd
    ) {
      return "range";
    }
    return "";
  }

  function handleSlotClick(idx) {
    if (!selectedDate) return;
    if (isBooked(idx)) return;
    if (clickStart === null || (clickStart !== null && clickEnd !== null)) {
      setClickStart(idx);
      setClickEnd(null);
    } else if (clickStart !== null) {
      if (idx > clickStart) {
        let valid = true;
        for (let i = clickStart; i < idx; i++) {
          if (isBooked(i)) valid = false;
        }
        if (valid) {
          setClickEnd(idx);
        }
      } else {
        setClickStart(idx);
        setClickEnd(null);
      }
    }
  }

  function isFormValid() {
    return (
      selectedDate &&
      clickStart !== null &&
      clickEnd !== null &&
      clickEnd > clickStart
    );
  }

  if (!isOpen) return null;

  // STEP 1: Pilih range → Next
  if (step === 1) {
    return (
      <div className="fixed top-0 right-0 w-full sm:w-[410px] h-full bg-white z-40 shadow-xl flex flex-col">
        <div className="flex w-full h-16 items-center justify-between px-6 pt-6 pb-3">
          <h2 className="text-lg font-semibold">Reservation Schedule</h2>
          <button onClick={onClose} className="text-3xl leading-none hover:text-orange-500">
            &times;
          </button>
        </div>
        <div className="px-6 pb-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="date"
              className="w-full h-11 border rounded px-3 pr-10 py-2"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setClickStart(null);
                setClickEnd(null);
              }}
              style={{ appearance: "none" }}
            />
            <FiCalendar
              onClick={() =>
                inputRef.current &&
                inputRef.current.showPicker &&
                inputRef.current.showPicker()
              }
              size={18}
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-6 pb-2 font-semibold text-[15px]">
          <span>Total Booked</span>
          <span className="text-orange-500">{getBookedRanges().length}</span>
        </div>
        <div className="bg-gray-50 rounded-lg flex-1 px-3 mx-3 py-3 mb-3 overflow-y-auto border">
          <div className="text-center font-medium text-gray-700 pb-1">{roomName}</div>
          <div className="flex flex-col gap-1">
            {times.map((time, idx) => {
              let status = "";
              if (isBooked(idx)) status = "booked";
              else if (getRangeStatus(idx) === "range") status = "yours";
              return (
                <div
                  key={time}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleSlotClick(idx)}
                >
                  <span className="w-11 text-xs text-gray-400">{time.replace(":", ".")}</span>
                  {status === "booked" ? (
                    <div className="bg-orange-50 text-orange-400 font-bold text-xs py-1 px-2 rounded w-full flex items-center h-7 border border-orange-200">
                      Booked
                    </div>
                  ) : status === "yours" ? (
                    <div className="bg-orange-500 text-white font-bold text-xs py-1 px-2 rounded w-full flex items-center h-7 shadow">
                      Your Booking
                    </div>
                  ) : (
                    <div className="flex-1 h-7 border-b border-dashed border-gray-200 hover:bg-orange-50 transition"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 pb-6">
          <button
            type="button"
            className={`w-full h-11 ${isFormValid()
              ? "bg-[#FF7316] text-white hover:bg-orange-700"
              : "bg-orange-100 text-gray-400 cursor-default"
              } text-[16px] font-semibold rounded-lg mt-2 shadow-md transition`}
            disabled={!isFormValid()}
            onClick={() => {
              if (isFormValid()) setStep(2);
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  }


  // STEP 2: Preview/all grid + Book Now
  if (step === 2) {
    return (
      <div className="fixed top-0 right-0 w-full sm:w-[410px] h-full bg-white z-40 shadow-xl flex flex-col">
        <div className="flex w-full h-16 items-center justify-between px-6 pt-6 pb-3">
          <h2 className="text-lg font-semibold">Reservation Schedule</h2>
          <button onClick={onClose} className="text-3xl leading-none hover:text-orange-500">
            &times;
          </button>
        </div>
        <div className="flex items-center justify-between px-6 pb-2 font-semibold text-[15px]">
          <span>Total Booked</span>
          <span className="text-orange-500">{getBookedRanges().length}</span>
        </div>
        <div className="bg-gray-50 rounded-lg flex-1 px-3 mx-3 py-3 mb-3 overflow-y-auto border">
          <div className="text-center font-medium text-gray-700 pb-1">{roomName}</div>
          <div className="relative" style={{ height: times.length * rowHeight }}>
            {/* Garis setiap jam */}
            {times.map((time, idx) => (
              <div
                key={time}
                className="flex items-center gap-2 absolute left-0 right-0"
                style={{ top: idx * rowHeight, height: rowHeight }}
              >
                <span className="w-11 text-xs text-gray-400">
                  {time.replace(":", ".")}
                </span>
                <div className="flex-1 h-[29px] border-b border-dashed border-gray-200"></div>
              </div>
            ))}
            {/* Blok booking existing */}
            {getBookedRanges().map(([start, end], i) => {
              const startIdx = parseHour(start);
              const endIdx = parseHour(end);
              return (
                <div
                  key={i}
                  className="absolute left-11 right-2 bg-[#FFC29B] border border-[#FFC29B] rounded z-10 flex items-center text-xs font-bold text-[#d6771b]"
                  style={{
                    top: startIdx * rowHeight,
                    height: (endIdx - startIdx) * rowHeight - 3,
                    opacity: 0.3,
                  }}
                >
                  <span className="ml-2">
                    {start} - {end}
                  </span>
                </div>
              );
            })}
            {/* Blok booking pilihan user */}
            {clickStart !== null && clickEnd !== null && (
              <div
                className="absolute left-11 right-2 bg-orange-500 rounded z-20 flex items-center text-xs font-bold text-white shadow"
                style={{
                  top: clickStart * rowHeight,
                  height: (clickEnd - clickStart) * rowHeight - 3,
                  opacity: 0.7,
                }}
              >
                <span className="ml-2">
                  {times[clickStart]} - {times[clickEnd]} WIB
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 pb-6">
          <button
            type="button"
            className="w-full h-11 bg-[#FF7316] text-white text-[16px] font-semibold rounded-lg mt-2 shadow-md transition"
            onClick={() => {
              onNext &&
                onNext({
                  reservationDate: selectedDate,
                  startTime: times[clickStart],
                  endTime: times[clickEnd],
                });
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }
}

ReservationSchedule.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onNext: PropTypes.func,
  roomName: PropTypes.string,
  bookedTimes: PropTypes.object, // Format: { "YYYY-MM-DD": [ [start, end], ... ]}
};

export { generateTimes };
