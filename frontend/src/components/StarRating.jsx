import React from "react";

const StarRating = ({ rating }) => {
  const stars = [];
  const maxStars = 5;

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span
        key={i}
        className={`text-xl ${
          i <= rating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </span>
    );
  }

  return <div className="flex">{stars}</div>;
};

export default StarRating;
