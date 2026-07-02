import React from "react";
import "./DetailSigments.css";

const DetailSigments = ({
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
  carrier,
  aircraft,
  reis,
  code1,
  code2,
}) => {
  return (
    <div className="detail_segments">
      <div className="line">
        <div className="circle1"></div>
        <div className="circle2"></div>
      </div>
      <div className="reis_div">
        <div className="left">
          <p>{from_date}</p>
          <h2>{from_time}</h2>
          <h3>
            {from_city}, {from_country} ({code1})
          </h3>
        </div>
      </div>
      <div className="reis_div">
        <div className="grid">
          <div className="raid">
            <p className="label">в воздухе</p>
            <p>
              {hour && hour !== 0 ? `${hour} ч` : ""}{" "}
              {minute && minute !== 0 && `${minute} м`}{" "}
            </p>
          </div>
          {reis && (
            <div className="raid">
              <p className="label">Рейс</p>
              <p>{reis}</p>
            </div>
          )}
          {carrier && (
            <div className="raid">
              <p className="label">Перевозчик</p>
              <p>{carrier}</p>
            </div>
          )}
          {aircraft && (
            <div className="raid">
              <p className="label">Самолет</p>
              <p>{aircraft}</p>
            </div>
          )}
        </div>
      </div>
      <div className="reis_div">
        <div className="left">
          <p>{to_date}</p>
          <h2>{to_time}</h2>
          <h3>
            {to_city}, {to_country} ({code2})
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DetailSigments;
