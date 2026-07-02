import React from "react";
import "./Segments.css";
import details_icon7 from "../../../img/detais_icon7.svg";
import line from "../../../img/Line.svg";

const Segments = ({
  from_time,
  from_date,
  from_city,
  from_country,
  to_time,
  to_date,
  to_city,
  to_country,
  hour,
  minute,
  code1,
  code2,
}) => {
  return (
    <div className="segments">
      <div className="reis_div">
        <div>
          <h2>{from_time}</h2>
          <p>{from_date}</p>
        </div>
        <div className="air">
          <img src={line} alt="" />
          <img className="image_center" src={details_icon7} alt="" />
          <img src={line} alt="" />
        </div>
        <div className="left">
          <h2>{to_time}</h2>
          <p>{to_date}</p>
        </div>
      </div>
      <div className="reis_div">
        <div>
          <h3>
            {from_city} {code1 && `(${code1})`}
          </h3>
          <p>{from_country}</p>
        </div>
        <p className="center">
          {hour && hour !== 0 ? `${hour} ч` : ""}{" "}
          {minute && minute !== 0 && `${minute} м`}{" "}
          {hour && hour !== 0
            ? minute && minute !== 0
              ? `в пути`
              : ""
            : minute && minute !== 0
            ? `в пути`
            : ""}
        </p>
        <div className="left">
          <h3>
            {to_city} {code2 && `(${code2})`}
          </h3>
          <p>{to_country}</p>
        </div>
      </div>
    </div>
  );
};

export default Segments;
