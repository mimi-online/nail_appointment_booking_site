import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import NailCard from "./NailDetails/NailCard";
import "./BookingComponent.css";
import API_URL from "../config";

const BookingComponent = ({ currentUser }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredNails, setFilteredNails] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(currentUser);

  const [nailData, setNailData] = useState([]);

  useEffect(() => {
    async function fetchNailData() {
      try {
        const response = await fetch(
          `${API_URL}/nails/`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch nail data.");
        }

        const data = await response.json(); // Parse the JSON response

        console.log("Fetching successful:", data);
        setNailData(data);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
    fetchNailData();
  }, []);

  const handleDateClick = (day, monthOffset = 0) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    // If clicking the same date, deselect it; otherwise select the new date
    if (selectedDate && selectedDate.getTime() === clickedDate.getTime()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }

    setError(""); // Clear any error message on date selection
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + increment)
    );
    setCurrentDate(new Date(newDate));
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const startOfMonth = new Date(year, month, 1).getDay();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Add previous month days
    for (let i = startOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPreviousMonth - i, monthOffset: -1 });
    }

    // Add current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, monthOffset: 0 });
    }

    // Add next month days
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, monthOffset: 1 });
    }

    return days;
  };

  const isDateSelected = (day, monthOffset) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    return (
      selectedDate && selectedDate.getTime() === date.getTime()
    );
  };

  const days = generateCalendarDays();

  const handleFilterNails = () => {
    if (!selectedDate) {
      setError("Please select a date.");
      setIsFiltered(false);
      return;
    }

    const isDateOccupied = (occupiedDate) => {
      const occupied = new Date(occupiedDate);
      occupied.setHours(0, 0, 0, 0);
      return occupied.getTime() === selectedDate.getTime();
    };

    const availableNails = nailData.filter((nail) =>
      nail.occupiedDates.every((occ) => !isDateOccupied(occ.date))
    );

    setFilteredNails(availableNails);
    setIsFiltered(true);
    setError("");
  };

  return (
    <div className="booking-container">
      <div className="calendar-header">
        <button className="date-switcher" onClick={() => handleMonthChange(-1)}>
          <FaArrowLeft></FaArrowLeft>{" "}
        </button>
        <h2>
          {currentDate.toLocaleString("en-IE", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="date-switcher" onClick={() => handleMonthChange(1)}>
          <FaArrowRight></FaArrowRight>
        </button>
      </div>

      <div className="calendar-days">
        {days.map(({ day, monthOffset }, index) => (
          <div
            key={index}
            className={`calendar-day ${
              isDateSelected(day, monthOffset) ? "selected" : ""
            } ${monthOffset !== 0 ? "overflow" : ""}`}
            onClick={() => handleDateClick(day, monthOffset)}
          >
            {day}
          </div>
        ))}
      </div>

      <button className="book-nails-button" onClick={handleFilterNails}>
        Book Nails
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="filtered-nails">
        {filteredNails.length > 0 ? (
          filteredNails.map((nail) => (
            <NailCard
              onBookingSuccess={() => {
                setSelectedDate(null);
                setFilteredNails([]);
                setSuccess("Booking Succesful!");
                setTimeout(() => {
                  setSuccess("");
                  setError("");
                }, 5000);
              }}
              key={nail.id}
              nail={nail}
              selectedDateRange={selectedDate ? { startDate: selectedDate, endDate: selectedDate } : null}
            />
          ))
        ) : isFiltered && selectedDate ? (
          <p>No available appointments for the selected date.</p>
        ) : success != "" ? (
          <p>{success}</p>
        ) : error != "" ? (
          <p>{error}</p>
        ) : (
          <p>Please select a date for booking.</p>
        )}
      </div>
    </div>
  );
};

export default BookingComponent;