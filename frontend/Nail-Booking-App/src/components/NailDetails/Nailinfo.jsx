import React from "react";

const NailInfo = ({ nail }) => {
  return (
    <div className="nail-info">
      <h2>{nail.nailName}</h2>
      <p>
        <strong>Type:</strong> {nail.service_type}
      </p>
      <p>
        <strong>Price:</strong> €{nail.price}
      </p>
      <p>
        <strong>Design type:</strong> {nail.design}
      </p>
      <p className="description">{nail.description}</p>
    </div>
  );
};

export default NailInfo;