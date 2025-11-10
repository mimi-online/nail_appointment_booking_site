import React, { useState, useEffect, useContext } from "react";
import "./OccupiedDatesDisplay.css";
import { UserContext } from "./UserContext";

const OccupiedDatesDisplay = () => {
  const [groupedDates, setGroupedDates] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    console.log(user);
    if (!user) {
      return;
    }

    const baseURL = "http://127.0.0.1:8000";
    async function fetchDates() {
      try {
        const response = await fetch(`${baseURL}/occupied-dates/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Fetch failed");
        }
        console.log(user.token);
        const data = await response.json(); // Parse the JSON response
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error during fetching dates:", error);
        return []; // Return an empty array if fetch fails
      }
    }

    async function processAndSetDates() {
      const fetchedDates = await fetchDates(); // Wait for fetchDates to resolve

      // Process dates into grouped ranges
      const processDates = (dates) => {
        // Sort dates chronologically
        const sortedDates = dates.sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );

        const ranges = {};
        let currentMonth = "";
        let currentRange = null;

        sortedDates.forEach((entry) => {
          const dateStr = entry.date;
          // Parse the date explicitly to ensure it's valid
          const date = new Date(`${dateStr}T00:00:00`); // Add `T00:00:00` to avoid parsing issues

          if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateStr);
            return; // Skip invalid dates
          }

          const month = date.toLocaleString("en-IE", {
            month: "long",
            year: "numeric",
          });

          if (month !== currentMonth) {
            // If month changes, finalize the previous range
            if (currentRange) {
              if (!ranges[currentMonth]) ranges[currentMonth] = [];
              ranges[currentMonth].push(currentRange);
            }
            currentMonth = month;
            currentRange = { 
              startDate: dateStr, 
              endDate: dateStr,
              nails: entry.nail_details ? [entry.nail_details] : []
            };
          } else {
            // Check if the date is consecutive
            const prevDate = new Date(`${currentRange.endDate}T00:00:00`);
            prevDate.setDate(prevDate.getDate() + 1); // Add 1 day to check continuity

            if (
              date.toISOString().split("T")[0] ===
              prevDate.toISOString().split("T")[0]
            ) {
              // Extend the current range
              currentRange.endDate = dateStr;
              // Add nail if not already in the array (avoid duplicates)
              if (entry.nail_details && !currentRange.nails.find(n => n.id === entry.nail_details.id)) {
                currentRange.nails.push(entry.nail_details);
              }
            } else {
              // Finalize the current range and start a new one
              if (!ranges[currentMonth]) ranges[currentMonth] = [];
              ranges[currentMonth].push(currentRange);
              currentRange = { 
                startDate: dateStr, 
                endDate: dateStr,
                nails: entry.nail_details ? [entry.nail_details] : []
              };
            }
          }
        });

        // Finalize the last range
        if (currentRange) {
          if (!ranges[currentMonth]) ranges[currentMonth] = [];
          ranges[currentMonth].push(currentRange);
        }

        return ranges;
      };

      setGroupedDates(processDates(fetchedDates));
    }

    processAndSetDates(); // Fetch and process dates
  }, [user]); // Re-run when `user` changes

  return (
    <div className="occupied-dates-container">
      {Object.keys(groupedDates).map((month) => (
        <div key={month} className="month-section">
          <h2 className="month-title">{month}</h2>
          <div className="date-cards">
            {groupedDates[month].map((range, index) => {
              const cardId = `${month}-${index}`;
              return (
                <div 
                  key={index} 
                  className="date-card"
                  onMouseEnter={() => setHoveredCard(cardId)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <p className="date-range">
                    {range.startDate === range.endDate ? (
                      // Single date
                      new Date(range.startDate).toLocaleDateString("en-IE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                    ) : (
                      // Date range
                      <>
                        {new Date(range.startDate).toLocaleDateString("en-IE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })} -{" "}
                        {new Date(range.endDate).toLocaleDateString("en-IE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </>
                    )}
                  </p>
                  {hoveredCard === cardId && range.nails && range.nails.length > 0 && (
                    <div className="nail-tooltip">
                      <div className="tooltip-content">
                        {range.nails.map((nail, nailIndex) => (
                          <div key={nailIndex} className="nail-info">
                            <h4>{nail.name}</h4>
                            <p><strong>Service:</strong> {nail.service_type}</p>
                            <p><strong>Design:</strong> {nail.design}</p>
                            <p><strong>Price:</strong> €{nail.price}</p>
                            {range.nails.length > 1 && nailIndex < range.nails.length - 1 && (
                              <hr className="tooltip-divider" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="cancellation-note">
        <p>To cancel appointments, please call this number over 24 hours before your appointment time.</p>
      </div>
    </div>
  );
};

export default OccupiedDatesDisplay;