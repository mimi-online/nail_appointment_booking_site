import React, { useContext } from "react";
import NailImageSlider from "./NailImageSlider";
import NailInfo from "./Nailinfo";

import "./NailDetails.css";
import { UserContext } from "../UserContext";
import { redirect, useNavigate } from "react-router-dom";

const NailCard = ({ nail, selectedDateRange, onBookingSuccess }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleBooking = async (nailId, userId, selectedDateRange) => {
    if (!user) {
      return navigate("/auth");
    }
    console.log(user.token);
    const baseURL = "http://127.0.0.1:8000";
    const nailUrl = `${baseURL}/nails/${nailId}/`;
    const userUrl = `${baseURL}/users/${userId}/`;

    if (selectedDateRange.startDate && !selectedDateRange.endDate) {
      selectedDateRange.endDate = selectedDateRange.startDate;
    }
    for (
      let currentDate = new Date(selectedDateRange.startDate);
      currentDate <= new Date(selectedDateRange.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      try {
        const response = await fetch(`${baseURL}/occupied-dates/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({
            nail: nailUrl, // Full URL, e.g., /nails/1/
            user: userUrl, // Full URL, e.g., /users/2/
            date: currentDate
              .toLocaleDateString("hu")
              .replace(/\./g, "-")
              .replace(/\s+/g, "")
              .slice(0, -1), // Format date as YYYY-MM-DD
          }),
        });
        console.log(user);
        console.log(response);
        console.log(
          nailUrl,
          userUrl,
          currentDate
            .toLocaleDateString("hu")
            .replace(/\./g, "-")
            .replace(/\s+/g, "")
            .slice(0, -1)
        ); // Format date as YYYY-MM-DD)
        if (!response.ok) {
          throw new Error("Booking failed");
        }
        const data = await response.json(); // Parse the JSON response
        onBookingSuccess();
        console.log("Booking successful:", data);
      } catch (error) {
        console.error("Error during booking:", error);
      }
    }
  };
  return (
    <div className="nail-card">
      <NailImageSlider images={nail.images} />
      <NailInfo nail={nail} />
      {selectedDateRange ? (
        <button
          className="book-nail-button"
          onClick={() =>
            handleBooking(nail.id, user.user.id, selectedDateRange)
          }
          disabled={!selectedDateRange.startDate}
        >
          Book Appointment
        </button>
      ) : null}
    </div>
  );
};

export default NailCard;