import React from "react";

const TimeGap = ({ fromDatetime, fromCountry, toDatetime, toCountry }) => {
  const parseDateTime = (datetime) => {
    const [date, time] = datetime.split(" ");
    const [day, month, year] = date.split(".");
    return new Date(`${year}-${month}-${day}T${time}`);
  };

  const calculateTimeGap = (fromDatetime, toDatetime) => {
    if (!fromDatetime || !toDatetime) {
      return "Неверные данные";
    }

    const from = parseDateTime(fromDatetime);
    const to = parseDateTime(toDatetime);

    if (isNaN(from) || isNaN(to)) {
      return "Неверные данные";
    }

    const diffMs = to - from;
    const diffMins = Math.floor(diffMs / 60000);
    const days = Math.floor(diffMins / 1440); // 1440 minutes in a day
    const hours = Math.floor((diffMins % 1440) / 60);
    const minutes = diffMins % 60;

    if (days > 0) {
      return `${days} д ${hours} ч ${minutes} м`;
    } else {
      return `${hours} ч ${minutes} м`;
    }
  };

  const timeGap = calculateTimeGap(fromDatetime, toDatetime);

  return (
    <div
      style={{
        padding: 12,
        paddingLeft: 50,
        borderBottom: "1px solid var(--gray)",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: "#aaaaaa",
        }}
      >
        Ожидание
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: "var(--black)",
        }}
      >
        {timeGap}
      </p>
    </div>
  );
};

export default TimeGap;
