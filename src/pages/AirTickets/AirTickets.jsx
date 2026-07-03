import React, { useEffect, useState, useCallback } from "react";
import "./AirTickets.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/UI/Loader/Loader";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { aviaDataAction } from "../../store/actions/aviaDataAction";
import empty from "../../img/empty-box.svg";
import { MdOutlineDateRange } from "react-icons/md";
import { aviaDateAction } from "../../store/actions/aviaDateAction";
import DateComponent from "../../components/UI/DatePicker/Date";
import Modal from "../../components/UI/Modal/Modal";
import { formatDateWithoutYear } from "../../components/utils/FormatDateWithoutYear";
import { BsSearch } from "react-icons/bs";
import AirElement from "./airElement";
import { AiOutlineRight } from "react-icons/ai";
import { Slider } from "antd";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

const formatDateTab = (dateString) => {
  if (!dateString) return "";
  // Handle DD.MM.YYYY format
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  }
  const months = {
    янв: "01", фев: "02", мар: "03", апр: "04", май: "05", июн: "06",
    июл: "07", авг: "08", сен: "09", окт: "10", ноя: "11", дек: "12",
  };
  const parts = dateString.replace(",", "").split(" ");
  if (parts.length < 2) return dateString;
  const [day, month] = parts;
  const monthNumber = months[month?.toLowerCase()];
  if (!monthNumber) return dateString;
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${monthNumber}-${day.padStart(2, "0")}`;
};

const AirTickets = ({ Alert, handleResortClick, openedResorts }) => {
  const { get } = useParams();
  const { tickets, loading } = useSelector((state) => state.avia);
  const { avia_date } = useSelector((state) => state.avia_date);
  const { countData } = useSelector((state) => state.count);
  const [dateFilter, setDateFilter] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [dateNightTo, setDateNightTo] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [dateNightFrom, setDateNightFrom] = useState(avia_date);
  const [count, setCount] = useState(0);
  const [filterModal, setFilterModal] = useState(false);
  const [airLines, setAirLines] = useState(false);
  const [aiports, setAiports] = useState(false);
  const [transplants, setTransplants] = useState(false);
  const [filterTimes, setFilterTimes] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedAirports, setSelectedAirports] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [dropShow, setDropShow] = useState(false);
  const [dropShowAir, setDropShowAir] = useState(false);
  const [dropShowTrans, setDropShowTrans] = useState(false);
  const [dropShowTime, setDropShowTime] = useState(false);
  const [departureTimeRange, setDepartureTimeRange] = useState([0, 24]);
  const [arrivalTimeRange, setArrivalTimeRange] = useState([0, 24]);
  const [selectedTransplants, setSelectedTransplants] = useState([]);

  const [filter, setFilter] = useState({
    is_direct_only: null,
    is_refund: null,
    is_baggage: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let newCount = [];
    countData.forEach((el, index) => {
      newCount = newCount.concat(
        Array.from(
          { length: el.quantity },
          (_, i) =>
            countData
              .slice(0, index)
              .reduce((acc, curr) => acc + curr.quantity, 0) +
            i +
            1
        )
      );
    });
    setCount(newCount);
  }, [countData]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  const fetchTickets = useCallback(() => {
    if (get) {
      const formattedDate = dateNightFrom;
      const dateSegment = get.includes("segments[0][date]")
        ? ""
        : `&segments[0][date]=${formatDate(formattedDate)}`;
      const getten = `${get}${dateSegment}${
        filter.is_direct_only ? "&is_direct_only=1" : ""
      }${filter.is_refund ? "&is_refund=true" : ""}${
        filter.is_baggage ? "&is_baggage=true" : ""
      }`;

      dispatch(aviaDataAction(getten));
      dispatch(aviaDateAction(dateNightFrom));
      setDateFilter(false);
      setRangeStart(null);
    }
  }, [get, dateNightFrom, filter, dispatch]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (
      loading === false &&
      tickets &&
      Array.isArray(tickets.flights) &&
      tickets.flights.length === 0 &&
      !(tickets.nearest?.length > 0)
    ) {
      Alert("По вашему запросу ничего не найдено", "warning");
      navigate("/");
    }
  }, [tickets, loading, Alert, navigate]);

  if (!tickets || loading) {
    return (
      <div className="loading_div">
        <Loader />
      </div>
    );
  }

  const filterByTime = (flight) => {
    if (!flight.segments || flight.segments.length === 0) return true;

    return flight.segments.every((segment) => {
      const depTime = segment.dep?.time;
      const arrTime = segment.arr?.time;

      if (!depTime || !arrTime) return true;

      const [depHours, depMinutes] = depTime.split(":").map(Number);
      const [arrHours, arrMinutes] = arrTime.split(":").map(Number);

      const departureTotalMinutes = depHours * 60 + depMinutes;
      const arrivalTotalMinutes = arrHours * 60 + arrMinutes;

      const departureRangeStart = departureTimeRange[0] * 60;
      const departureRangeEnd = departureTimeRange[1] * 60;
      const arrivalRangeStart = arrivalTimeRange[0] * 60;
      const arrivalRangeEnd = arrivalTimeRange[1] * 60;

      const departureInRange =
        departureTotalMinutes >= departureRangeStart &&
        departureTotalMinutes <= departureRangeEnd;

      const arrivalInRange =
        arrivalTotalMinutes >= arrivalRangeStart &&
        arrivalTotalMinutes <= arrivalRangeEnd;

      console.log("Departure time:", depTime);
      console.log("Departure total minutes:", departureTotalMinutes);
      console.log("Departure range:", departureRangeStart, departureRangeEnd);
      console.log("Departure in range:", departureInRange);

      console.log("Arrival time:", arrTime);
      console.log("Arrival total minutes:", arrivalTotalMinutes);
      console.log("Arrival range:", arrivalRangeStart, arrivalRangeEnd);
      console.log("Arrival in range:", arrivalInRange);

      return departureInRange && arrivalInRange;
    });
  };

  const getFilteredTickets = () => {
    if (!tickets?.flights) {
      console.log("No flights available");
      return [];
    }

    const filterByTransplants = (flight) => {
      if (selectedTransplants.length === 0) return true;

      const transplantCount = flight.segments.length - 1;

      if (selectedTransplants.includes(Infinity)) {
        return true;
      }

      return selectedTransplants.includes(transplantCount);
    };

    const filtered = tickets.flights.filter((flight) => {
      const airlineMatch =
        selectedAirlines.length === 0 ||
        selectedAirlines.includes(flight.provider.supplier.title);

      const airportMatch =
        selectedAirports.length === 0 ||
        flight.segments.some((segment) =>
          selectedAirports.includes(segment.arr.airport.title)
        );

      const timeMatch = filterByTime(flight);
      const transplantMatch = filterByTransplants(flight);

      return airlineMatch && airportMatch && timeMatch && transplantMatch;
    });

    console.log("Filtered tickets:", filtered);
    return filtered;
  };

  // const getFilteredTickets = () => {
  //   if (!tickets?.flights) return [];
  //   return tickets?.flights?.filter((flight) => {
  //     const airlineMatch =
  //       selectedAirlines.length === 0 ||
  //       selectedAirlines.includes(flight.provider.supplier.title);

  //     const airportMatch =
  //       selectedAirports.length === 0 ||
  //       flight.segments.some((segment) =>
  //         selectedAirports.includes(segment.arr.airport.title)
  //       );

  //     const timeMatch = filterByTime(flight);

  //     return airlineMatch && airportMatch && timeMatch;
  //   });
  // };

  const filterHandler = () => {
    setFilterModal(!filterModal);
  };
  const openAiports = () => {
    setAiports(!aiports);
  };
  const openAirLines = () => {
    setAirLines(!airLines);
  };
  const openCheckingTimes = () => {
    setFilterTimes(!filterTimes);
  };
  const openTransplant = () => {
    setTransplants(!transplants);
  };

  const toggleAirportSelection = (airport) => {
    setSelectedAirports((prev) =>
      prev.includes(airport)
        ? prev.filter((item) => item !== airport)
        : [...prev, airport]
    );
  };

  const toggleAirlineSelection = (airline) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((item) => item !== airline)
        : [...prev, airline]
    );
  };

  const resetSlider = () => {
    setDepartureTimeRange([0, 24]);
    setArrivalTimeRange([0, 24]);
  };

  function scrollToSearchBlock() {
    const scrollDiv = document.getElementById("search-block").offsetTop + +100;
    window.scrollTo({ top: scrollDiv, behavior: "smooth" });
  }

  return (
    <div>
      {loading ? (
        <div className="loading_div">
          <Loader />
        </div>
      ) : (
        <div className="air_tickets">
          <Header>
            <h1>
              {tickets?.search?.segments?.[0]?.from?.name} -{" "}
              {tickets?.search?.segments?.[0]?.to?.name}
            </h1>
          </Header>
          <div className="filtering_fixet ">
            <div className="container">
              <div className="filtering">
                <div
                  onClick={filterHandler}
                  className={`filter_box  ${filter.is_direct_only && "active"}`}
                  style={{
                    background: "var(--blue)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Фильтр
                </div>

                <div
                  onClick={() =>
                    setFilter({
                      ...filter,
                      is_direct_only: !filter.is_direct_only,
                    })
                  }
                  className={`filter_box ${filter.is_direct_only && "active"}`}
                >
                  Прямые
                </div>
                <div
                  onClick={() =>
                    setFilter({ ...filter, is_baggage: !filter.is_baggage })
                  }
                  className={`filter_box ${filter.is_baggage && "active"}`}
                >
                  С багажом
                </div>
                <div
                  onClick={() =>
                    setFilter({ ...filter, is_refund: !filter.is_refund })
                  }
                  className={`filter_box ${filter.is_refund && "active"}`}
                >
                  С возвратом
                </div>
              </div>
            </div>
          </div>
          <div className="container ">
            <div className="heading adaptivaContainer">
              <h3 className="reising">
                {tickets?.flights?.length || 0}{" "}
                {tickets?.flights?.length === 1 ? "рейс" : "рейсов"},{" "}
                <span>cначала дешевые</span>{" "}
              </h3>
              <p className="times">
                Время местное. Цена за {count.length} пассажира
              </p>
            </div>
          </div>
          {tickets?.nearest?.length > 0 && (
            <div className="overflowing">
              <div onClick={() => setDateFilter(true)} className="dateing">
                <MdOutlineDateRange size={24} color="var(--blue)" />
              </div>
              {tickets.nearest.map((el, index) => (
                <div
                  key={index}
                  onClick={() => setDateNightFrom(formatDateTab(el.date))}
                  className={`dateing ${el.active_day && "active"}`}
                >
                  <p className="blue">{el.date}</p>
                  {el?.price ? (
                    <p>{el.price}</p>
                  ) : (
                    <BsSearch className="icon" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="container">
            <div className="list_air">
              {tickets?.flights?.length > 0 ? (
                filterModal ? (
                  <>
                    <div close={setFilterModal} className="containerStyle">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                          style={{
                            margin: "15px 15px 0 15px",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onClick={openAirLines}
                        >
                          <input
                            type="text"
                            placeholder="Авиакомпании"
                            className="transparentStyle"
                            // disabled
                          />
                          <span
                            className="dropStyle"
                            onClick={() => setDropShow(!dropShow)}
                          >
                            {dropShow ? (
                              <IoIosArrowDropdown
                                color="var(--blue)"
                                size={25}
                              />
                            ) : (
                              <IoIosArrowDropup color="var(--blue)" size={25} />
                            )}
                          </span>
                        </div>
                        {airLines && (
                          <div className="airline">
                            {" "}
                            {[
                              ...new Map(
                                tickets?.flights
                                  ?.map((el) => ({
                                    title: el?.provider?.supplier?.title,
                                    logo: el?.provider?.supplier?.logo,
                                    code: el?.provider?.supplier?.code,
                                  }))
                                  .filter((item) => item.title)
                                  .map((item) => [
                                    `${item.title}-${item.code}`,
                                    item,
                                  ])
                              ).values(),
                            ].map((item, index) => (
                              <label
                                key={index}
                                style={{
                                  width: "100%",
                                  padding: "4px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                
                                <div className="reis_div r aitportStyle">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "20px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        minWidth: "24px",
                                        minHeight: "24px",
                                        width: "24px",
                                        height: "24px",
                                      }}
                                    >
                                      <img
                                        className={
                                          item.logo === null
                                            ? "fly gray"
                                            : "fly"
                                        }
                                        src={item?.logo && item.logo}
                                        alt=""
                                        style={{
                                          borderRadius: "100%",
                                        }}
                                      />
                                    </div>
                                    <p className="airline_list">
                                      {item.title}
                                      <span className="airline_code">
                                        ({item.code})
                                      </span>
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      minWidth: "14px",
                                      minHeight: "14px",
                                      width: "14px",
                                      height: "14px",
                                    }}
                                  >
                                   
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        accentColor: "blue",
                                        cursor: "pointer",
                                        border: "1px solid blue",
                                      }}
                                      checked={selectedAirlines.includes(
                                        item.title
                                      )}
                                      onChange={() =>
                                        toggleAirlineSelection(item.title)
                                      }
                                      />
                                  </div>
                                 
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            margin: "15px 15px 0 15px",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onClick={openAiports}
                        >
                          <input
                            type="text"
                            placeholder="Аэропорты"
                            className="transparentStyle"
                            // disabled
                          />
                          <span
                            className="dropStyle"
                            onClick={() => setDropShowAir(!dropShowAir)}
                          >
                            {dropShowAir ? (
                              <IoIosArrowDropdown
                                color="var(--blue)"
                                size={25}
                              />
                            ) : (
                              <IoIosArrowDropup color="var(--blue)" size={25} />
                            )}
                          </span>
                        </div>
                        {aiports && (
                          <div className="airline">
                            {[
                              ...new Map(
                                tickets?.flights
                                  ?.flatMap((flight) =>
                                    flight?.segments?.map((segment) => ({
                                      title: segment?.arr?.airport?.title,
                                      code: segment?.arr?.airport?.code,
                                    }))
                                  )
                                  .filter(
                                    (airport) => airport.title && airport.code
                                  )
                                  .map((airport) => [airport.code, airport])
                              ).values(),
                            ].map((airport, index) => (
                              <label
                                key={index}
                                className="reis_div r aitportStyle"
                                style={{
                                  padding: "5px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <p className="airline_list">
                                  {airport.title}
                                  <span className="airline_code">
                                    ({airport.code})
                                  </span>
                                </p>
                                <div
                                  style={{
                                    minWidth: "14px",
                                    minHeight: "14px",
                                    width: "14px",
                                    height: "14px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      accentColor: "blue",
                                      cursor: "pointer",
                                      border: "1px solid blue",
                                    }}
                                    checked={selectedAirports.includes(
                                      airport.title
                                    )}
                                    onChange={() =>
                                      toggleAirportSelection(airport.title)
                                    }
                                  />
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            margin: "15px 15px 0 15px",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onClick={openTransplant}
                        >
                          <input
                            type="text"
                            placeholder="Пересадки"
                            className="transparentStyle"
                            // disabled
                          />
                          <span
                            className="dropStyle"
                            onClick={() => setDropShowTrans(!dropShowTrans)}
                          >
                            {dropShowTrans ? (
                              <IoIosArrowDropdown
                                color="var(--blue)"
                                size={25}
                              />
                            ) : (
                              <IoIosArrowDropup color="var(--blue)" size={25} />
                            )}
                          </span>
                        </div>

                        {transplants && (
                          <div className="airline">
                            <div
                              style={{
                                paddingLeft: "30px",
                                // paddingLeft: "30px",
                              }}
                            >
                              {/* <button
                                onClick={() => setSelectedTransplants([])}
                                style={{
                                  padding: "10px",
                                  borderRadius: "6px",
                                  color: "white",
                                  border: "1px solid var(--blue)",
                                  cursor: "pointer",
                                  background: "var(--blue)",
                                  fontSize: "16px",
                                  outline: "none",
                                }}
                              >
                                Сбросить
                              </button> */}
                            </div>
                            {[
                              { label: "Без пересадок", value: 0 },
                              { label: "1 пересадка", value: 1 },
                              { label: "2 пересадки", value: 2 },
                              {
                                label: "любое количество пересадок",
                                value: Infinity,
                              },
                            ].map((option, index) => (
                              <label
                                key={index}
                                style={{
                                  padding: "10px 5px",
                                  borderBottom: "1px solid #ddd",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  color: "var(--blue)",
                                }}
                              >
                                <p>{option.label}</p>
                                <input
                                  type="checkbox"
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    accentColor: "blue",
                                    cursor: "pointer",
                                  }}
                                  checked={selectedTransplants.includes(
                                    option.value
                                  )}
                                  onChange={() => {
                                    if (
                                      selectedTransplants.includes(option.value)
                                    ) {
                                      setSelectedTransplants((prev) =>
                                        prev.filter(
                                          (item) => item !== option.value
                                        )
                                      );
                                    } else {
                                      setSelectedTransplants((prev) => [
                                        ...prev,
                                        option.value,
                                      ]);
                                    }
                                  }}
                                />
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          margin: "15px",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        onClick={openCheckingTimes}
                      >
                        <input
                          type="text"
                          placeholder="Время"
                          className="transparentStyle"
                          // disabled
                        />
                        <span
                          className="dropStyle"
                          onClick={() => setDropShowTime(!dropShowTime)}
                        >
                          {dropShowTime ? (
                            <IoIosArrowDropdown color="var(--blue)" size={25} />
                          ) : (
                            <IoIosArrowDropup color="var(--blue)" size={25} />
                          )}
                        </span>
                      </div>

                      {filterTimes && (
                        <div style={{ padding: "20px", width: "100%" }}>
                          <div className="timeStyle">
                            <button
                              onClick={resetSlider}
                              style={{
                                padding: "10px",
                                borderRadius: "6px",

                                color: "white",

                                background: "var(--blue)",
                                fontSize: "16px",

                                border: " 1px solid var(--blue)",
                                outlineColor: "none",
                              }}
                              className="item2"
                            >
                              Сбросить время
                            </button>
                            <h3 className="item1">Вылет</h3>
                          </div>
                          <>
                            <Slider
                              range
                              min={0}
                              max={24}
                              step={1}
                              value={departureTimeRange}
                              onChange={(newRange) =>
                                setDepartureTimeRange(newRange)
                              }
                            />
                          </>
                          <p>
                            Выбрано: {departureTimeRange[0]}:00 -{" "}
                            {departureTimeRange[1]}:00
                          </p>
                          <h3
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyItems: "center",
                              marginTop: "60px",
                              marginBottom: "30px",
                            }}
                          >
                            Прилет
                          </h3>
                          <>
                            <Slider
                              range
                              min={0}
                              max={24}
                              step={1}
                              defaultValue={[0, 24]}
                              value={arrivalTimeRange}
                              onChange={(newRange) =>
                                setArrivalTimeRange(newRange)
                              }
                            />
                          </>
                          <p>
                            <p>
                              Выбрано: {arrivalTimeRange[0]}:00 -{" "}
                              {arrivalTimeRange[1]}:00
                            </p>
                          </p>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // paddingTop: "30px",
                          paddingBottom: "15px 10px 15px 10px",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            textAlign: "center",
                            margin: "0 15px 15px 15px",
                          }}
                        >
                          <button
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "10px",
                              background: "var(--blue)",
                              fontSize: "16px",
                              color: "white",
                              border: " 1px solid var(--blue)",
                              outlineColor: "none",
                            }}
                            onClick={() => scrollToSearchBlock()}
                          >
                            Применить фильтры
                          </button>{" "}
                          <>
                            <>
                              {filterModalOpen &&
                                (departureTimeRange[0] !== 0 ||
                                  departureTimeRange[1] !== 24 ||
                                  arrivalTimeRange[0] !== 0 ||
                                  arrivalTimeRange[1] !== 24) && (
                                  <div
                                    style={{
                                      fontSize: "22px",
                                      color: "blue",
                                      paddingTop: "20px",
                                    }}
                                  >
                                    <div>
                                      Билеты отфильтрованы по времени: вылет - ({" "}
                                      {departureTimeRange[0]}:00 -{" "}
                                      {departureTimeRange[1]}:00 )- прилет - ({" "}
                                      {arrivalTimeRange[0]}:00 -
                                      {arrivalTimeRange[1]}:00)
                                    </div>
                                  </div>
                                )}
                            </>
                          </>
                        </div>
                      </div>
                    </div>
                    <div id="search-block">
                      {(selectedAirlines.length > 0 ||
                        selectedAirports.length > 0 ||
                        departureTimeRange[0] !== 0 ||
                        departureTimeRange[1] !== 24 ||
                        arrivalTimeRange[0] !== 0 ||
                        arrivalTimeRange[1] !== 24) &&
                        getFilteredTickets()?.length > 0 &&
                        getFilteredTickets()?.map((flight, index) => {
                          return (
                            <AirElement key={index} el={flight} Alert={Alert} />
                          );
                        })}
                    </div>
                  </>
                ) : (
                  tickets.flights.map((el, index) => (
                    <AirElement
                      el={el}
                      index={index}
                      key={index}
                      Alert={Alert}
                    />
                  ))
                )
              ) : (
                <div className="empty">
                  {/* <h1 className="not_data">
                    <img src={empty} alt="Пусто" />
                    Пусто
                  </h1> */}
                  <p
                    style={{
                      flex: "flex",
                      color: "blue",
                      textAlign: "center",
                      paddingTop: "150px",
                      fontSize: "24px",
                    }}
                  >
                    {tickets?.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {dateFilter && (
        <Modal close={setDateFilter}>
          <div className="filter_block_modal">
            <div className="div_btn_filter_menu">
              <div className="div_btn_filter active">
                <h3>Даты вылета</h3>
                <p style={{ fontSize: 18, fontWeight: 500 }}>
                  {formatDateWithoutYear(dateNightFrom)}
                </p>
              </div>
            </div>
            <DateComponent
              rangeStart={rangeStart}
              setRangeStart={setRangeStart}
              rangeEnd={rangeEnd}
              setRangeEnd={setRangeEnd}
              dateNightFrom={dateNightFrom}
              setDateNightFrom={setDateNightFrom}
              setDateNightTo={setDateNightTo}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              dateData={[]}
            />
            <button
              onClick={() => setDateFilter(false)}
              className="btn_close_block_modal active"
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AirTickets;
