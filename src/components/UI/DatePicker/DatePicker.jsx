// import React, { useCallback, useEffect, useState } from "react";
// import "./DatePicker.css";

// const formatDate = (date) => {
//   if (date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   }
//   return "";
// };

// const Calendar = ({
//   rangeStart,
//   setRangeStart,
//   rangeEnd,
//   setRangeEnd,
//   setDateNightTo,
//   setDateNightFrom,
//   dateData,
//   Alert,
// }) => {
//   const currentDate = new Date();
//   const [isDayClickable, setIsDayClickable] = useState(true);

//   const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

//   const handleDateClick = useCallback(
//     (day, month) => {
//       const clickedDate = new Date(currentDate?.getFullYear(), month, day);

//       if (!rangeStart) {
//         setRangeStart(clickedDate);
//         setRangeEnd(null);
//         setIsDayClickable(true);
//       } else if (!rangeEnd) {
//         const dayDifference = Math.ceil(
//           (clickedDate - rangeStart) / (1000 * 60 * 60 * 24)
//         );

//         if (dayDifference <= 30) {
//           if (clickedDate < rangeStart) {
//             setRangeStart(clickedDate);
//             setRangeEnd(rangeStart);
//           } else {
//             setRangeEnd(clickedDate);
//             setIsDayClickable(false);
//           }
//         } else {
//           Alert("Максимальный срок бронирования - 30 дней", "info");
//         }
//       } else {
//         setRangeStart(clickedDate);
//         setRangeEnd(null);
//         setIsDayClickable(true);
//       }
//     },
//     [currentDate, rangeStart, rangeEnd]
//   );

//   useEffect(() => {
//     if (rangeStart) {
//       const formattedFromDate = formatDate(rangeStart);
//       const formattedToDate = formatDate(rangeEnd || rangeStart);

//       setDateNightFrom(formattedFromDate);
//       setDateNightTo(formattedToDate);
//       setIsDayClickable(true);
//     }
//   }, [rangeStart, rangeEnd]);

//   const getCalendarMatrix = (year, month) => {
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const firstDayIndex = (firstDay.getDay() + 6) % 7;
//     const matrix = [];

//     let day = 1;
//     for (let i = 0; i < 6; i++) {
//       matrix[i] = [];
//       for (let j = 0; j < 7; j++) {
//         if (i === 0 && j < firstDayIndex) {
//           matrix[i][j] = 0;
//         } else if (day <= daysInMonth) {
//           matrix[i][j] = day;
//           day++;
//         } else {
//           matrix[i][j] = 0;
//         }
//       }
//     }

//     return matrix;
//   };

//   const formatPrice = (price) => {
//     if (price >= 1000) {
//       const formattedPrice = (price / 1000).toFixed(0);
//       return `${formattedPrice}k`;
//     }
//     return price.toString();
//   };

//   const renderCalendar = () => {
//     const year = currentDate.getFullYear();
//     const startMonth = currentDate.getMonth();
//     const months = Array.from(
//       { length: 12 },
//       (_, index) => (startMonth + index) % 12
//     );

//     return months.map((month, index) => {
//       const calendarMatrix = getCalendarMatrix(year, month);

//       return (
//         <div key={index} className="month-container">
//           <h2 className="title">
//             {new Intl.DateTimeFormat("ru-RU", {
//               month: "long",
//             }).format(new Date(year, month, 1))}
//           </h2>
//           <table>
//             <thead>
//               <tr>
//                 {daysOfWeek.map((dayName, dayIndex) => (
//                   <th key={dayIndex} className="day-name">
//                     {dayName}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {calendarMatrix.map((week, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {week.map((day, colIndex) => {
//                     const currentDateFromMatrix = new Date(year, month, day);
//                     const isCurrentMonth =
//                       currentDateFromMatrix.getMonth() === month;
//                     const isSelected =
//                       rangeStart &&
//                       rangeEnd &&
//                       currentDateFromMatrix >= rangeStart &&
//                       currentDateFromMatrix <= rangeEnd;
//                     const isInRange =
//                       rangeStart &&
//                       (!rangeEnd ||
//                         (currentDateFromMatrix >= rangeStart &&
//                           currentDateFromMatrix <= rangeEnd));
//                     const isFirstOrLastDay =
//                       rangeStart &&
//                       (currentDateFromMatrix.getTime() ===
//                         rangeStart.getTime() ||
//                         (rangeEnd &&
//                           currentDateFromMatrix.getTime() ===
//                             rangeEnd.getTime()));
//                     const pricesForDate = dateData?.data?.calendar?.month[
//                       month + 1
//                     ]?.days.find((dayData) => {
//                       const [dayNum, monthNum, yearNum] = dayData.date
//                         .split(".")
//                         .map(Number);
//                       return (
//                         dayNum === day &&
//                         monthNum === month + 1 &&
//                         yearNum === year
//                       );
//                     });
//                     const isNonEmptyDay = day !== 0 && isCurrentMonth;
//                     const isBeforeToday = currentDateFromMatrix < currentDate;

//                     const cellClasses = [
//                       isFirstOrLastDay ? "selected-range-start" : "",
//                       isInRange && !isSelected ? "range" : "",
//                       !isCurrentMonth || !isNonEmptyDay || !isDayClickable
//                         ? "inactive"
//                         : "",
//                       isBeforeToday ? "disabled" : "",
//                       isSelected ? "selected" : "",
//                     ]
//                       .filter(Boolean)
//                       .join(" ");

//                     return (
//                       <td
//                         key={colIndex}
//                         onClick={() =>
//                           isNonEmptyDay && isDayClickable
//                             ? handleDateClick(day, month)
//                             : null
//                         }
//                         className={`${cellClasses}`}
//                       >
//                         {isNonEmptyDay ? (
//                           <div>
//                             {day}
//                             {pricesForDate && (
//                               <p className="price_date">
//                                 {formatPrice(pricesForDate.price)} $
//                               </p>
//                             )}
//                           </div>
//                         ) : (
//                           ""
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     });
//   };

//   return <div className="Calendar">{renderCalendar()}</div>;
// };

// export default Calendar;

import React, { useCallback, useEffect, useState } from 'react'
import './DatePicker.css'

const formatDate = (date) => {
  if (date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return ''
}

const Calendar = ({
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  setDateNightTo,
  setDateNightFrom,
  dateData,
  Alert,
}) => {
  const currentDate = new Date()
  const [isDayClickable, setIsDayClickable] = useState(true)

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const handleDateClick = useCallback((day, month) => {
    const clickedDate = new Date(currentDate?.getFullYear(), month, day)

    if (!rangeStart) {
      setRangeStart(clickedDate)
      setRangeEnd(null)
      setIsDayClickable(true)
    } else if (!rangeEnd) {
      const dayDifference = Math.ceil((clickedDate - rangeStart) / (1000 * 60 * 60 * 24))

      if (dayDifference <= 30) {
        if (clickedDate < rangeStart) {
          setRangeStart(clickedDate)
          setRangeEnd(rangeStart)
        } else {
          setRangeEnd(clickedDate)
          setIsDayClickable(false)
        }
      } else {
        Alert('Максимальный срок бронирования - 30 дней', 'info')
      }
    } else {
      setRangeStart(clickedDate)
      setRangeEnd(null)
      setIsDayClickable(true)
    }
  })

  useEffect(() => {
    if (rangeStart) {
      const formattedFromDate = formatDate(rangeStart)
      const formattedToDate = formatDate(rangeEnd || rangeStart)

      setDateNightFrom(formattedFromDate)
      setDateNightTo(formattedToDate)
      setIsDayClickable(true)
    }
  }, [rangeStart, rangeEnd])

  const getCalendarMatrix = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const firstDayIndex = (firstDay.getDay() + 6) % 7
    const matrix = []

    let day = 1
    for (let i = 0; i < 6; i++) {
      matrix[i] = []
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayIndex) {
          matrix[i][j] = 0
        } else if (day <= daysInMonth) {
          matrix[i][j] = day
          day++
        } else {
          matrix[i][j] = 0
        }
      }
    }

    return matrix
  }

  const formatPrice = (price) => {
    if (price >= 1000) {
      const formattedPrice = (price / 1000).toFixed(1)
      return `${formattedPrice}k`
    }
    return price.toString()
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const startMonth = currentDate.getMonth()
    const months = Array.from({ length: 12 }, (_, index) => (startMonth + index) % 12)

    return months.map((month, index) => {
      const calendarMatrix = getCalendarMatrix(year, month)

      return (
        <div key={index} className="month-container">
          <h2 className="title">
            {new Intl.DateTimeFormat('ru-RU', {
              month: 'long',
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
                    const currentDateFromMatrix = new Date(year, month, day)
                    const isCurrentMonth = currentDateFromMatrix.getMonth() === month
                    const isSelected =
                      rangeStart &&
                      rangeEnd &&
                      currentDateFromMatrix >= rangeStart &&
                      currentDateFromMatrix <= rangeEnd
                    const isInRange =
                      rangeStart &&
                      (!rangeEnd ||
                        (currentDateFromMatrix >= rangeStart && currentDateFromMatrix <= rangeEnd))
                    const isFirstOrLastDay =
                      rangeStart &&
                      (currentDateFromMatrix.getTime() === rangeStart.getTime() ||
                        (rangeEnd && currentDateFromMatrix.getTime() === rangeEnd.getTime()))
                    const pricesForDate = dateData?.data?.calendar?.month[month + 1]?.days.find(
                      (dayData) => {
                        const [dayNum, monthNum, yearNum] = dayData.date.split('.').map(Number)
                        return dayNum === day && monthNum === month + 1 && yearNum === year
                      },
                    )

                    const isNonEmptyDay = day !== 0 && isCurrentMonth
                    const isBeforeToday = currentDateFromMatrix < currentDate
                    const isToday =
                      currentDateFromMatrix.getFullYear() === currentDate.getFullYear() &&
                      currentDateFromMatrix.getMonth() === currentDate.getMonth() &&
                      currentDateFromMatrix.getDate() === currentDate.getDate()

                    const cellClasses = [
                      isFirstOrLastDay ? 'selected-range-start' : '',
                      isInRange && !isSelected ? 'range' : '',
                      isToday ? 'disabled today' : '',
                      !isCurrentMonth || !isNonEmptyDay || !isDayClickable ? 'inactive' : '',
                      isBeforeToday ? 'disabled' : '',
                      isSelected ? 'selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')

                    return (
                      <td
                        key={colIndex}
                        onClick={() =>
                          isNonEmptyDay && isDayClickable ? handleDateClick(day, month) : null
                        }
                        className={`${cellClasses}`}
                      >
                        {isNonEmptyDay ? (
                          <div>
                            {day}
                            {pricesForDate && (
                              <p className="price_date">{pricesForDate.price} сом</p>
                            )}
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    })
  }

  return <div className="Calendar">{renderCalendar()}</div>
}

export default Calendar
