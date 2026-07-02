import React, { useCallback, useEffect, useState } from "react";
import "./DatePicker.css";

const formatDate = (date) => {
  if (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
};

const DateComponent = ({
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  setDateNightTo,
  setDateNightFrom,
  dateData,
}) => {
  const [isDayClickable, setIsDayClickable] = useState(true);

  const handleDateClick = useCallback(
    (day, month) => {
      const clickedDate = new Date();
      clickedDate.setHours(0, 0, 0, 0);

      clickedDate.setDate(day);
      clickedDate.setMonth(month);

      if (!rangeStart) {
        setRangeStart(clickedDate);
        setRangeEnd(null);
        setIsDayClickable(true);
      } else if (!rangeEnd) {
        if (clickedDate < rangeStart) {
          setRangeStart(clickedDate);
          setRangeEnd(rangeStart);
        } else {
          setRangeEnd(clickedDate);
          setIsDayClickable(false);
        }
      } else {
        setRangeStart(clickedDate);
        setRangeEnd(null);
        setIsDayClickable(true);
      }
    },
    [rangeStart, rangeEnd]
  );

  useEffect(() => {
    if (rangeStart) {
      const formattedFromDate = formatDate(rangeStart);
      const formattedToDate = formatDate(rangeEnd);

      setDateNightFrom(formattedFromDate);
      setDateNightTo(formattedToDate);
      setIsDayClickable(true);
    }
  }, [rangeStart, rangeEnd]);

  const getCalendarMatrix = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayIndex = (firstDay.getDay() + 6) % 7;
    const matrix = [];

    let day = 1;
    for (let i = 0; i < 6; i++) {
      matrix[i] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayIndex) {
          matrix[i][j] = 0;
        } else if (day <= daysInMonth) {
          matrix[i][j] = day;
          day++;
        } else {
          matrix[i][j] = 0;
        }
      }
    }

    return matrix;
  };

  const isSelectableDate = (clickedDate) => {
    const currentDate = new Date();

    if (clickedDate < currentDate) {
      return false;
    }

    const clickedYear = clickedDate.getFullYear();
    const clickedMonth = clickedDate.getMonth() + 1;
    const clickedDay = clickedDate.getDate();

    const isSelectable = dateData?.data?.calendar?.month[
      clickedMonth
    ]?.days.some((day) => {
      const [dayNum, monthNum, yearNum] = day.date.split(".").map(Number);
      return (
        dayNum === clickedDay &&
        monthNum === clickedMonth &&
        yearNum === clickedYear
      );
    });

    return isSelectable;
  };

  const isPastDay = (day, month, year) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(year, month, day);
    return selectedDate.getTime() < today.getTime();
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      const formattedPrice = (price / 1000).toFixed(0);
      return `${formattedPrice}k`;
    }
    return price.toString();
  };

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const renderCalendar = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startMonth = currentDate.getMonth();
    const months = Array.from(
      { length: 12 },
      (_, index) => (startMonth + index) % 12
    );

    return months.map((month, index) => {
      const calendarMatrix = getCalendarMatrix(year, month);

      return (
        <div key={index} className="month-container">
          <h2 className="title">
            {new Intl.DateTimeFormat("ru-RU", {
              month: "long",
            }).format(new Date(year, month, 1))}
          </h2>
          <table>
            <thead>
              <tr>
                {daysOfWeek.map((dayName, dayIndex) => (
                  <th key={dayIndex} className="day-name">
                    {dayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendarMatrix.map((week, rowIndex) => (
                <tr key={rowIndex}>
                  {week.map((day, colIndex) => {
                    const currentDateFromMatrix = new Date(year, month, day);
                    const isCurrentMonth =
                      currentDateFromMatrix.getMonth() === month &&
                      currentDateFromMatrix.getFullYear() === year;
                    const isSelected =
                      rangeStart &&
                      rangeEnd &&
                      currentDateFromMatrix >= rangeStart &&
                      currentDateFromMatrix <= rangeEnd;
                    const isInRange =
                      rangeStart &&
                      (!rangeEnd ||
                        (currentDateFromMatrix >= rangeStart &&
                          currentDateFromMatrix <= rangeEnd));
                    const isFirstOrLastDay =
                      rangeStart &&
                      (currentDateFromMatrix.getTime() ===
                        rangeStart.getTime() ||
                        (rangeEnd &&
                          currentDateFromMatrix.getTime() ===
                            rangeEnd.getTime()));
                    const pricesForDate = dateData?.data?.calendar?.month[
                      month + 1
                    ]?.days.find((dayData) => {
                      const [dayNum, monthNum, yearNum] = dayData.date
                        .split(".")
                        .map(Number);
                      return (
                        dayNum === day &&
                        monthNum === month + 1 &&
                        yearNum === year
                      );
                    });
                    const isNonEmptyDay = day !== 0 && isCurrentMonth;
                    const isBeforeToday = isPastDay(day, month, year);
                    const isSelectable = isSelectableDate(
                      currentDateFromMatrix
                    );

                    const cellClasses = [
                      isFirstOrLastDay ? "selected-range-start" : "",
                      isInRange && !isSelected ? "range" : "",
                      !isCurrentMonth || !isNonEmptyDay || !isDayClickable
                        ? "inactive"
                        : "",
                      !isSelectable ? "not-in-data" : "",
                      isBeforeToday ? "disabled" : "",
                      isSelected ? "selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <td
                        key={colIndex}
                        onClick={() =>
                          isNonEmptyDay && isDayClickable && !isBeforeToday
                            ? handleDateClick(day, month)
                            : null
                        }
                        className={`${cellClasses} ${
                          isBeforeToday ? "inactivet" : ""
                        }`}
                      >
                        {isNonEmptyDay ? (
                          <div>
                            {day}
                            {pricesForDate && (
                              <p className="price_date">
                                {" "}
                                <u>c</u> {formatPrice(pricesForDate.price)}
                              </p>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });
  };

  return <div className="Calendar">{renderCalendar()}</div>;
};

export default DateComponent;
