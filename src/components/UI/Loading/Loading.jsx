import React from "react";
import "./Loading.css";

const Loading = ({ color }) => {
  return (
    <span
      style={{ borderTop: `3px solid ${color}` }}
      className="loaderz blue"
    ></span>
  );
};

export default Loading;
