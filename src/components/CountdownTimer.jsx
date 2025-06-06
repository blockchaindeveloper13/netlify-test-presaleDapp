import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const presaleEndDate = new Date("2025-06-01T00:00:00"); // Presale end date (June 1st)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeDifference = presaleEndDate - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      textAlign: "center",
      backgroundColor: "#1e212d",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)"
    }}>
      <h2 style={{ marginBottom: "10px" }}>🚀 Time Left for Presale:</h2>
      <div style={{ fontSize: "1.5rem" }}>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    </div>
  );
};

export default CountdownTimer;
