import React from "react";
import "./Plan.css";

const Preloader = () => {
  return (
    <div className="preloader-container">
      <div className="airplane">
        <div className="plan">✈️</div>
      </div>
      <div className="loading-text">
        Загружаем
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </div>
  );
};

export default Preloader;
