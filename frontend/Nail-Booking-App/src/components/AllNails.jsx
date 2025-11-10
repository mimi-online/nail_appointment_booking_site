import React from "react";
import "./AllNails.css";
import NailCard from "./NailDetails/NailCard";
import { useState, useEffect } from "react";
const AllNails = () => {
  const [nailData, setNailData] = useState([]);

  useEffect(() => {
    async function fetchNailData() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/nails/",
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
  return (
    <div className="all-nails-container">
      <h2>Available Services</h2>
      <div className="nails-list">
        {nailData.map((nail) => (
          <NailCard key={nail.id} nail={nail} />
        ))}
      </div>
    </div>
  );
};

export default AllNails;