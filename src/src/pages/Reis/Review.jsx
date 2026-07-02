import React, { useState } from "react";
import "./Reis.css";
import { FaStar } from "react-icons/fa";

const Review = ({ el }) => {
  const [text, setText] = useState(false);
  const [text1, setText1] = useState(false);

  return (
    <div className="review_block">
      <div className="review_block_box">
        <div>
          <h1>{el.name ? el.name : "User"}</h1>
          <div className="date_review">
            <p>{el.reviewdate}</p>
            <p>{el.reviewtime}</p>
          </div>
        </div>
        <div>
          {Array.from({ length: el.rate }, (_, starIndex) => (
            <span key={starIndex}>
              <FaStar className="icon" size={15} />
            </span>
          ))}
        </div>
      </div>
      {el.content ? (
        <p
          style={
            text
              ? {}
              : el.content.length > 160
              ? { height: 45, overflow: "hidden" }
              : {}
          }
        >
          {el.content}
        </p>
      ) : (
        ""
      )}
      {el.content.length > 160 ? (
        <p className="read" onClick={() => setText(!text)}>
          {text ? "скрыть" : "читать дальше"}
        </p>
      ) : (
        ""
      )}
      {el.positive ? (
        <div className="emoji">
          <h2>Впечатления наших клиентов</h2>
          <p
            style={
              text1
                ? {}
                : el.positive.length > 160
                ? { height: 45, overflow: "hidden" }
                : {}
            }
          >
            {el.positive}
          </p>
        </div>
      ) : (
        ""
      )}
      {el.positive.length > 160 ? (
        <p className="read" onClick={() => setText1(!text1)}>
          {text1 ? "скрыть" : "читать дальше"}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default Review;
