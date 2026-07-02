import React, { useEffect, useState } from "react";
import "./Bus.css";
import empty from "../../img/empty-box.svg";
import Header from "../../components/Header/Header";
import axios from "axios";
import { url } from "../../Api";
import { useNavigate } from "react-router-dom";
import { PiCoffee } from "react-icons/pi";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdAirportShuttle, MdHomeRepairService } from "react-icons/md";
import { PiPersonFill } from "react-icons/pi";
import { BsFillCalendarDateFill } from "react-icons/bs";
import Modal from "../../components/UI/Modal/Modal";
import Loader from "../../components/UI/Loader/Loader";
import Calendar from "../../components/UI/DatePicker/DatePicker";
import { BsAirplane } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import { formatDateWithoutYear } from "../../components/utils/FormatDateWithoutYear";
import Users from "../../components/UI/Users/Users";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const Bus = ({ date }) => {
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState([]);
  const [whereFrom, setWhereFrom] = useState({
    wherevalue: "",
    closeDiv: false,
  });
  const [tour, setTour] = useState({
    tourvalue: "",
    tourid: "",
    closeDiv: false,
  });
  const [dateFly, setDateFly] = useState({
    dateflyvalue: "",
    closeDiv: false,
  });
  const [user, setUser] = useState({
    count1: 0,
    count2: 0,
    count3: 0,
    count4: 0,
    count5: 0,
    closeDiv: false,
  });
  const [countBaby, setCountBaby] = useState(0);
  const [dateFilter, setDateFilter] = useState(false);
  const [dateNightFrom, setDateNightFrom] = useState(getTodayDate());
  const [dateNightTo, setDateNightTo] = useState(getTodayDate());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const navigate = useNavigate();

  console.log(filter);

  useEffect(() => {
    setDateFly({
      ...dateFly,
      wherevalue: filter && filter.datefrom && filter.datefrom[0],
    });
  }, []);

  useEffect(() => {
    busGet();
  }, []);

  function busGet() {
    const users = user.count1 + user.count2;
    setLoading(true);
    axios
      .get(
        url +
          `/bus-tour/list?departure=${whereFrom.wherevalue}&num_of_tourists=${
            user.count1 == null ? "" : users == 0 ? "" : users
          }&cat=${tour.tourid}&datefrom=${formatDate(dateNightFrom)}`
      )
      .then((response) => {
        setBusData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    axios
      .get(url + `/bus-tour/list-params`)
      .then((response) => {
        setFilter(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const one = user.count3 > 0 ? 1 : 0;
    const two = user.count4 > 0 ? 1 : 0;
    const three = user.count5 > 0 ? 1 : 0;
    const oneBaby = user.count3 > 0 ? (user.count3 > 2 ? 0 : 1) : 0;
    const twoBaby = user.count4 > 0 ? (user.count4 > 2 ? 0 : 1) : 0;
    const threeBaby = user.count5 > 0 ? (user.count5 > 2 ? 0 : 1) : 0;
    const data = one + two + three;
    const dataBaby = oneBaby + twoBaby + threeBaby;
    setUser({
      ...user,
      count2: data,
    });
    setCountBaby(dataBaby);
  }, [user.count3, user.count4, user.count5]);

  const price_child =
    countBaby == 1 ? 80 : countBaby == 2 ? 160 : countBaby == 3 ? 240 : 0;

  return (
    <div className="bus">
      <Header>
        <h1>Авторские туры</h1>
      </Header>
      <div className="container">
        <div className="filter_bus">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "23px minmax(0, 1fr)",
            }}
            onClick={() => setWhereFrom({ ...whereFrom, closeDiv: true })}
            className="tour_block_flexs"
          >
            <MdAirportShuttle className="icon" size={23} />
            <div className="tour_block_flex_div">
              <h3
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {whereFrom.wherevalue}
              </h3>
              <p>Откуда</p>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "23px minmax(0, 1fr)",
            }}
            onClick={() => setTour({ ...tour, closeDiv: true })}
            className="tour_block_flexs"
          >
            <MdHomeRepairService className="icon" size={23} />
            <div className="tour_block_flex_div">
              <h3
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tour.tourvalue}
              </h3>
              <p>Тур</p>
            </div>
          </div>
          <div onClick={() => setDateFilter(true)} className="tour_block_flexs">
            <BsFillCalendarDateFill className="icon" size={23} />
            <div className="tour_block_flex_div">
              <h3>
                {" "}
                {formatDateWithoutYear(dateNightFrom)}
                {` - ${formatDateWithoutYear(dateNightTo)}`}
              </h3>
              <p>Дата вылета</p>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "23px minmax(0, 1fr)",
            }}
            onClick={() => setUser({ ...user, closeDiv: true })}
            className="tour_block_flexs"
          >
            <PiPersonFill className="icon" size={23} />
            <div className="tour_block_flex_div">
              <h3
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.count1
                  ? user.count1 == 1
                    ? `${user.count1} взрослый`
                    : `${user.count1} взрослых`
                  : ""}{" "}
                {user.count2
                  ? user.count2 == 1
                    ? `, ${user.count2} ребенок`
                    : `, ${user.count2} детей`
                  : ""}{" "}
              </h3>
              <p>Кол-во человек</p>
            </div>
          </div>
        </div>
        <button onClick={() => busGet()} className="button_form">
          Поиск
        </button>
        {whereFrom.closeDiv && (
          <Modal open={whereFrom} close={setWhereFrom}>
            <div className="filter_block_modal">
              <div
                onClick={() =>
                  setWhereFrom({
                    ...whereFrom,
                    closeDiv: false,
                    wherevalue: "",
                  })
                }
                className="star_box"
              >
                <input
                  type="checkbox"
                  checked={whereFrom.wherevalue == ""}
                  onChange={() =>
                    setWhereFrom({
                      ...whereFrom,
                      closeDiv: false,
                      wherevalue: "",
                    })
                  }
                />
                <p>Любое</p>
              </div>
              {filter.departures &&
                filter.departures.map((el) => (
                  <div
                    onClick={() =>
                      setWhereFrom({
                        ...whereFrom,
                        closeDiv: false,
                        wherevalue: el.name,
                      })
                    }
                    className="star_box"
                  >
                    <input
                      type="checkbox"
                      checked={whereFrom.wherevalue == el.name}
                      onChange={() =>
                        setWhereFrom({
                          ...whereFrom,
                          closeDiv: false,
                          wherevalue: el.name,
                        })
                      }
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
              <button
                style={{ marginTop: 15 }}
                onClick={() => setWhereFrom({ ...whereFrom, closeDiv: false })}
                className="button_form"
              >
                готово
              </button>
            </div>
          </Modal>
        )}
        {tour.closeDiv && (
          <Modal open={tour} close={setTour}>
            <div className="filter_block_modal">
              <div
                onClick={() =>
                  setTour({
                    ...tour,
                    closeDiv: false,
                    tourvalue: "",
                    tourid: "",
                  })
                }
                className="star_box"
              >
                <input
                  type="checkbox"
                  checked={tour.tourid == ""}
                  onChange={() =>
                    setTour({
                      ...tour,
                      closeDiv: false,
                      tourvalue: "",
                      tourid: "",
                    })
                  }
                />
                <p>Любое</p>
              </div>
              {filter.categories &&
                filter.categories.map((el) => (
                  <div
                    onClick={() =>
                      setTour({
                        ...tour,
                        closeDiv: false,
                        tourvalue: el.name,
                        tourid: el.id,
                      })
                    }
                    className="star_box"
                  >
                    <input
                      type="checkbox"
                      checked={tour.tourid == el.id}
                      onChange={() =>
                        setTour({
                          ...tour,
                          closeDiv: false,
                          tourvalue: el.name,
                          tourid: el.id,
                        })
                      }
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
              <button
                style={{ marginTop: 15 }}
                onClick={() => setTour({ ...tour, closeDiv: false })}
                className="button_form"
              >
                готово
              </button>
            </div>
          </Modal>
        )}
        {dateFilter && (
          <Modal close={setDateFilter}>
            <div className="filter_block_modal">
              <div className="div_btn_filter_menu">
                <h3>Даты вылета</h3>
                <p style={{ fontSize: 18, fontWeight: 500 }}>
                  {formatDateWithoutYear(dateNightFrom)}
                  {` - ${formatDateWithoutYear(dateNightTo)}`}
                </p>
              </div>
              <>
                <Calendar
                  rangeStart={rangeStart}
                  setRangeStart={setRangeStart}
                  rangeEnd={rangeEnd}
                  setRangeEnd={setRangeEnd}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  dateNightFrom={dateNightFrom}
                  setDateNightFrom={setDateNightFrom}
                  setDateNightTo={setDateNightTo}
                  dateData={filter}
                />
              </>
              Ç{" "}
              <button
                onClick={() => setDateFilter(false)}
                className={`btn_close_block_modal active`}
              >
                Выбрать
              </button>
            </div>
          </Modal>
        )}
        {user.closeDiv && (
          <Modal open={user} close={setUser}>
            <Users
              bus={true}
              count={user}
              setCount={setUser}
              price_child={price_child}
              setUserModal={setUser}
            />
          </Modal>
        )}
        {loading ? (
          <div className="loading_div">
            <Loader />
          </div>
        ) : busData.length > 0 ? (
          busData.map((el, id) => (
            <div
              key={id}
              onClick={() => navigate(`/bus-detail/${el.id}`)}
              className="bus_block"
            >
              {el.img ? (
                <img src={"https://hit-travel.org" + el.img} alt="" />
              ) : (
                ""
              )}
              <div className="contant">
                <h1>
                  {el.title ? el.title : ""}{" "}
                  <p className="nights">Ночей: {el.nights ? el.nights : ""}</p>{" "}
                </h1>
                <div className="hr"></div>
                <div className="contant_two">
                  <div className="div">
                    <BsAirplane className="icon" size={23} />
                    <div className="btnp">
                      <h3>{el.datefrom ? el.datefrom : ""}</h3>
                      <p>Дата вылета</p>
                    </div>
                  </div>
                  <div className="div">
                    <PiCoffee className="icon" size={23} />
                    <div className="btnp">
                      <h3>
                        {el.meal ? el.meal : ""} -{" "}
                        {el.mealname ? el.mealname : ""}
                      </h3>
                      <p>Питание</p>
                    </div>
                  </div>
                  <div className="div">
                    <HiOutlineUsers className="icon" size={23} />
                    <div className="btnp">
                      <h3>{el.seats ? el.seats : ""}</h3>
                      <p>Доступно мест</p>
                    </div>
                  </div>
                  <div className="div">
                    <IoPricetagsOutline className="icon" size={23} />
                    <div className="btnp">
                      <h3>
                        {el.price ? el.price : ""}{" "}
                        {el.currency ? el.currency : ""}
                      </h3>
                      <p>Цена</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className="not_data">
            <img src={empty} alt="" />
            Пусто
          </h1>
        )}
      </div>
    </div>
  );
};

export default Bus;
