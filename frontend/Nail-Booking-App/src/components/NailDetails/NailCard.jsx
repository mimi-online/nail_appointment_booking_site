import React, { useContext } from "react";
import NailImageSlider from "./NailImageSlider";
import NailInfo from "./Nailinfo";

import "./NailDetails.css";
import { UserContext } from "../UserContext";
import { redirect, useNavigate } from "react-router-dom";
import API_URL from "../../config";

const NailCard = ({ nail, selectedDateRange, onBookingSuccess, selectedTime, isSelectedService,
  onSelectService,}) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleBooking = async (nailId, userId, selectedDateRange, selectedTime) => {
    if (!user) {
      return navigate("/auth");
    }
    console.log(user.token);
    const nailUrl = `${API_URL}/nails/${nailId}/`;
    const userUrl = `${API_URL}/users/${userId}/`;

    if (!selectedTime) {
      console.error("Time is required for booking");
      return;
    }
    if (selectedDateRange.startDate && !selectedDateRange.endDate) {
      selectedDateRange.endDate = selectedDateRange.startDate;
    }
    for (
      let currentDate = new Date(selectedDateRange.startDate);
      currentDate <= new Date(selectedDateRange.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      try {
        const response = await fetch(`${API_URL}/occupied-dates/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({
            nail: nailUrl, // Full URL, e.g., /nails/1/
            user: userUrl, // Full URL, e.g., /users/2/
            date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
            time: selectedTime,
          }),
        });
        console.log(user);
        console.log(response);
        console.log(
          nailUrl,
          userUrl,
          currentDate.toISOString().split("T")[0]
        ); // Format date as YYYY-MM-DD
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
      {selectedDateRange && !isSelectedService ? (
        <button className="book-nail-button" onClick={onSelectService}>
          Choose Service
        </button>
      ) : null}

      {selectedDateRange && isSelectedService ? (
        <button
          className="book-nail-button"
          onClick={() =>
            handleBooking(nail.id, user.user.id, selectedDateRange, selectedTime)
          }
          disabled={!selectedDateRange.startDate || !selectedTime}
        >
          Book Appointment
        </button>
      ) : null}
    </div>
  );
};

export default NailCard;