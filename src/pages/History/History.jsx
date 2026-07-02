import React, { useEffect, useMemo, useState } from "react";
import "./History.css";
import Header from "../../components/Header/Header";
import axios from "axios";
import { url } from "../../Api";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineHistory } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineWifiProtectedSetup } from "react-icons/md";
import empty from "../../img/empty-box.svg";
import { AiOutlineDownload } from "react-icons/ai";
import { BsFiletypeDoc } from "react-icons/bs";
import { AiOutlineCloudDownload } from "react-icons/ai";
import Loader from "../../components/UI/Loader/Loader";
import Segments from "../../components/UI/Segments/Segments";
import { PiPackageDuotone } from "react-icons/pi";
import Loading from "../../components/UI/Loading/Loading";
import Load from "../../components/UI/Load/Load";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [historyDataBus, setHistoryDataBus] = useState([]);
  const [historyDataHotel, setHistoryDataHotel] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  const [cancelledTickets, setCancelledTickets] = useState([]);
  const [historyHand, setHistoryHand] = useState([]);
  const [his, setHis] = useState(true);
  const [hand, setHand] = useState(false);
  const [bus, setBus] = useState(false);
  const [hotel, setHotel] = useState(false);
  const [tickets, setTickets] = useState(false);
  const [local, setLocal] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loader, setLoader] = useState();

  const location = useLocation(); 
  // const token = localStorage.getItem("token");
  // useEffect(() => {
  //   if (location?.state?.updatedTicket) {
  //     // Обновляем состояние historyTickets
  //     setHistoryTicket(location.state.updatedTicket)
  //   }
  // }, [location.state]);

  useEffect(() => {
    if (location?.state?.updatedTicket) {
      setCancelledTickets((prev) => {
        const isAlreadyCancelled = prev.some(
          (ticket) => ticket.id === location.state.updatedTicket.id
        );
        if (!isAlreadyCancelled) {
          return [...prev, location.state.updatedTicket];
        }
        return prev;
      });
    }
  }, [location.state]);

  const updatedTickets = useMemo(() => {
    return historyTickets.map((ticket) => {
      const cancelledTicket = cancelledTickets.filter(
        (t) => t.id === ticket.id
      );
      return cancelledTicket && ( { ...ticket, status: "Cancelled" } )
    });
  }, [historyTickets, cancelledTickets]);

  useEffect(() => {
    if (location?.state?.updatedTicket) {
      const isAlreadyCancelled = cancelledTickets.some(
        (ticket) => ticket.id === location.state.updatedTicket.id
      );
      if (!isAlreadyCancelled) {
        setCancelledTickets((prev) => [...prev, location.state.updatedTicket]);
      }
    }
  }, [location.state]);


  // const cancelTicket = async (ticketId) => {
  //   try {
  //     const response = await fetch("https://hit-travel.org/avia/booking-cancel", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ id: ticketId }),
  //     });

  //     const result = await response.json();
  //     if (result.success) {
  //       fetchHistoryTickets();
  //     }
  //   } catch (error) {
  //     console.error("Ошибка при отмене билета:", error);
  //   }
  // };

  // const updatedTickets = useMemo(() => {
  //   return historyTickets.map((ticket) => {
  //     const cancelledTicket = cancelledTickets.find((t) => t.id === ticket.id);
  //     return cancelledTicket ? cancelledTicket : ticket;
  //   });
  // }, [historyTickets, cancelledTickets]);

  console.log(updatedTickets);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    }
  }, []);

  const headers = {
    Authorization: `Token ${local}`,
  };

  useEffect(() => {
    if (local) {
      setLoading(true);
      axios
        .get(url + "/profile/my-tour", { headers })
        .then((response) => {
          setHistoryData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [local]);

  useEffect(() => {
    if (local) {
      axios
        .get(url + "/profile/manual-requests/", { headers })
        .then((response) => {
          setHistoryHand(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [local]);

  useEffect(() => {
    if (local) {
      axios
        .get(url + "/profile/my-tour-bus", { headers })
        .then((response) => {
          setHistoryDataBus(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [local]);

  useEffect(() => {
    if (local) {
      axios
        .get(url + "/hotel", { headers })
        .then((response) => {
          setHistoryDataHotel(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [local]);

  useEffect(() => {
    if (local) {
      axios
        .get(url + "/avia/booking-history", { headers })
        .then((response) => {
          setHistoryTickets(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [local]);

  const ticketRequest = (id) => {
    console.log(id);
    navigate(`/ticket-request/${id}`);
  };

  const openInNewTab = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getDoc = async (org) => {
    setLoader(true);
    try {
      const response = await axios.get(
        `https://hit-travel.org/avia/booking-info/${org}`,
        { headers }
      );
      if (response.data) {
        console.log(
          response.data.data.book.tickets[0].documents.ticket_receipt
        );

        openInNewTab(
          response.data.data.book.tickets[0].documents.ticket_receipt
        );
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  console.log(historyTickets);

  return (
  
    <div className="history">
      <Header>
        <h1>Мои заказы</h1>
      </Header>
      {loading ? (
        <div className="loading_div">
          <Loader />
        </div>
      ) : (
        <>
          <div className="btns_his">
            <button
              className={`btn_his ${his && "active"}`}
              onClick={() => {
                setHis(true);
                setBus(false);
                setHotel(false);
                setTickets(false);
                setHand(false);
              }}
            >
              Туры
            </button>
            <button
              className={`btn_his ${hotel && "active"}`}
              onClick={() => {
                setHotel(true);
                setBus(false);
                setHis(false);
                setTickets(false);
                setHand(false);
              }}
            >
              Отели
            </button>
            <button
              style={{
                minWidth: 150,
              }}
              className={`btn_his ${hand && "active"}`}
              onClick={() => {
                setHand(true);
                setTickets(false);
                setBus(false);
                setHis(false);
                setHotel(false);
              }}
            >
              Ручные заявки
            </button>
            <button
              className={`btn_his ${bus && "active"}`}
              onClick={() => {
                setBus(true);
                setHis(false);
                setHotel(false);
                setTickets(false);
                setHand(false);
              }}
            >
              Авторские
            </button>
            <button
              className={`btn_his ${tickets && "active"}`}
              onClick={() => {
                setTickets(true);
                setBus(false);
                setHis(false);
                setHotel(false);
                setHand(false);
              }}
            >
              Авиабилеты
            </button>
          </div>
          <div className="container">
            {his ? (
              historyData && historyData.length == 0 ? (
                <h1 className="not_data">
                  <img src={empty} alt="" />
                  Пусто
                </h1>
              ) : (
                <div className="his">
                  {historyData &&
                    historyData.map((el, id) =>
                      el.from_main_view == true ? (
                        <div key={id} className="tour_block">
                          <div
                            onClick={() =>
                              navigate(`/details-my-tour/${el.id}`)
                            }
                            className="tour_block_one"
                          >
                            <img src={el.tour?.hotelpicturebig} alt="" />
                            <div className="rixos">
                              {el.tour?.tourname.length > 70 ? (
                                <h2 className="height">{el.tour?.tourname}</h2>
                              ) : (
                                <h2>{el.tour?.tourname}</h2>
                              )}
                              {el.status == 1 && (
                                <p className="status blue">
                                  <MdOutlineWifiProtectedSetup size={20} />
                                  Новая заявка
                                </p>
                              )}
                              {el.status == 2 && (
                                <p className="status yellow">
                                  <MdOutlineHistory size={22} />В процессе
                                  покупки
                                </p>
                              )}
                              {el.status == 3 && (
                                <p className="status green">
                                  <BsCheckCircleFill size={16} />
                                  Тур куплен
                                </p>
                              )}
                              {el.status == 4 && (
                                <p className="status red">
                                  <IoMdCloseCircle size={20} />
                                  Отказано
                                </p>
                              )}
                            </div>
                          </div>
                          {el?.documents.length > 0
                            ? el?.documents.map((el, id) => (
                                <>
                                  <div key={id} className="hr"></div>
                                  <div className="hostory_doc">
                                    <div className="flex">
                                      <BsFiletypeDoc
                                        className="iocn_doc"
                                        size={25}
                                      />
                                      <div>
                                        <h2>{el.name}</h2>
                                        <p>документ</p>
                                      </div>
                                    </div>
                                    <a href={el.file} className="dowload">
                                      {" "}
                                      Скачать{" "}
                                      <AiOutlineCloudDownload size={20} />{" "}
                                    </a>
                                  </div>
                                </>
                              ))
                            : ""}
                          {el.link ? (
                            <>
                              <div className="hr"></div>
                              <div className="history_all_two">
                                <a href={el.link} className="dowload doc">
                                  {" "}
                                  Скачать договор{" "}
                                  <AiOutlineDownload size={20} />{" "}
                                </a>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <div
                          key={el.id}
                          onClick={() => navigate(`/package-tour/${el.id}`)}
                          className="tour_block"
                        >
                          <div className="rixos">
                            <h2>{el?.services[0]?.tour_name}</h2>
                            <p className="status green">
                              <BsCheckCircleFill size={16} />
                              {el?.services[0]?.status_pay_name}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                </div>
              )
            ) : (
              ""
            )}
            {tickets ? (
              historyTickets && historyTickets.length === 0 ? (
                <h1 className="not_data">
                  <img src={empty} alt="" />
                  Пусто
                </h1>
              ) : (
                <div className="tickets">
                  {historyTickets.map((el) =>
                    el.segments.length === 0 ? (
                      ""
                    ) : (
                      <div className="air_box" key={el.id}>
                        <div onClick={() => ticketRequest(el.id)}>
                          {el.segments?.map((item) => (
                            <Segments
                              key={item.id}
                              from_time={item?.time_from}
                              from_date={item?.date_from}
                              from_city={item?.from_name}
                              from_country={item?.from_country}
                              to_time={item?.time_to}
                              to_date={item?.date_to}
                              to_city={item?.to_name}
                              to_country={item?.to_country}
                              hour={item?.duration_hour}
                              minute={item?.duration_minute}
                            />
                          ))}
                          <div className="grid">
                            <div className="column">
                              <p className="text">Класс:</p>
                              <p className="title">{el.book_class}</p>
                            </div>
                            <div className="column center">
                              <p className="text">Статус:</p>
                              {el.status === "Бронирован" && (
                                <p
                                  style={{ justifyContent: "center" }}
                                  className="status yellow"
                                >
                                  <MdOutlineHistory size={22} />
                                  Забронировано
                                </p>
                              )}
                              {el.status === "Оплачено" && (
                                <p
                                  style={{ justifyContent: "center" }}
                                  className="status green"
                                >
                                  <BsCheckCircleFill size={16} />
                                  {el.status}
                                </p>
                              )}
                              {el.status === "Отменено" && (
                                <p
                                  style={{ justifyContent: "center" }}
                                  className="status red"
                                >
                                  <BsCheckCircleFill size={16} />
                                  Отменен
                                </p>
                              )}
                            </div>
                            <div className="column">
                              <p className="text left">Цена:</p>
                              <p className="price left">{el.amount} KGS</p>
                            </div>
                          </div>
                        </div>
                        <div className="hr"></div>
                        {loader ? (
                          <div
                            onClick={() => getDoc(el.billing_number)}
                            style={{
                              width: "100%",
                              height: 25,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            <Load />
                          </div>
                        ) : (
                          <div
                            onClick={() => getDoc(el.billing_number)}
                            className="history_all_two"
                          >
                            <p className="dowload doc active">
                              Скачать маршрутную квитанцию
                              <AiOutlineDownload size={20} />
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )
                  }
                </div>
              )
            ) : (
              ""
            )}
            {bus ? (
              historyDataBus && historyDataBus.length == 0 ? (
                <h1 className="not_data">
                  <img src={empty} alt="" />
                  Пусто
                </h1>
              ) : (
                <div className="bus">
                  {historyDataBus &&
                    historyDataBus.map((el, id) => (
                      <div key={id} className="tour_block">
                        <div
                          onClick={() => navigate(`/bus-detail/${el.id}`)}
                          className="tour_block_one"
                        >
                          {el.img ? (
                            <img
                              src={"https://hit-travel.org" + el.img}
                              alt=""
                            />
                          ) : (
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                background: "#cdcdcd",
                                borderRadius: "50%",
                              }}
                              className="circle"
                            ></div>
                          )}
                          <div className="rixos">
                            {el.title.length > 70 ? (
                              <h2 className="height">{el.title}</h2>
                            ) : (
                              <h2>{el.title}</h2>
                            )}
                            {el.status == 1 && (
                              <p className="status blue">
                                <MdOutlineWifiProtectedSetup size={20} />
                                Новая заявка
                              </p>
                            )}
                            {el.status == 2 && (
                              <p className="status yellow">
                                <MdOutlineHistory size={22} />В процессе покупки
                              </p>
                            )}
                            {el.status == 3 && (
                              <p className="status green">
                                <BsCheckCircleFill size={16} />
                                Тур куплен
                              </p>
                            )}
                            {el.status == 4 && (
                              <p className="status red">
                                <IoMdCloseCircle size={20} />
                                Отказано
                              </p>
                            )}
                          </div>
                        </div>
                        {el.documents && el.documents.length > 0
                          ? el.documents.map((el, id) => (
                              <>
                                <div key={id} className="hr"></div>
                                <div className="hostory_doc">
                                  <div className="flex">
                                    <BsFiletypeDoc
                                      className="iocn_doc"
                                      size={25}
                                    />
                                    <div>
                                      <h2>{el.name}</h2>
                                      <p>документ</p>
                                    </div>
                                  </div>
                                  <a href={el.file} className="dowload">
                                    {" "}
                                    Скачать <AiOutlineCloudDownload
                                      size={20}
                                    />{" "}
                                  </a>
                                </div>
                              </>
                            ))
                          : ""}
                        {el.link ? (
                          <>
                            <div className="hr"></div>
                            <div className="history_all_two">
                              <a href={el.link} className="dowload doc">
                                {" "}
                                Скачать договор <AiOutlineDownload
                                  size={20}
                                />{" "}
                              </a>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
              )
            ) : (
              ""
            )}
            {hotel ? (
              historyDataHotel && historyDataHotel.length === 0 ? (
                <h1 className="not_data">
                  <img src={empty} alt="" />
                  Пусто
                </h1>
              ) : (
                <div className="his">
                  {historyDataHotel &&
                    historyDataHotel.map((el, id) =>
                      el.error ? (
                        ""
                      ) : (
                        <div key={id} className="tour_block">
                          <div
                            onClick={() =>
                              navigate(`/details-my-hotel/${el?.id}`)
                            }
                            className="tour_block_one"
                          >
                            <img src={el?.data.hotel.images.image[0]} alt="" />
                            <div className="rixos">
                              {el?.data.hotel?.name.length > 70 ? (
                                <h2 className="height">
                                  {el?.data.hotel.name}
                                </h2>
                              ) : (
                                <h2>{el?.data.hotel.name}</h2>
                              )}
                              {el?.data.hotel.status == 1 && (
                                <p className="status blue">
                                  <MdOutlineWifiProtectedSetup size={20} />
                                  Новая заявка
                                </p>
                              )}
                              {el?.data.hotel.status == 2 && (
                              <p className="status yellow">
                                <MdOutlineHistory size={22} />В процессе покупки
                              </p>
                             )} 
                              {el?.data.hotel.status == 3 && (
                                <p className="status green">
                                  <BsCheckCircleFill size={16} />
                                  Тур куплен
                                </p>
                              )}
                              {el?.data.hotel.status == 4 && (
                                <p className="status red">
                                  <IoMdCloseCircle size={20} />
                                  Отказано
                                </p>
                              )}
                            </div>
                          </div>
                          {el?.documents?.length > 0
                            ? el?.documents.map((el, id) => (
                                <>
                                  <div key={id} className="hr"></div>
                                  <div className="hostory_doc">
                                    <div className="flex">
                                      <BsFiletypeDoc
                                        className="iocn_doc"
                                        size={25}
                                      />
                                      <div>
                                        <h2>{el.name}</h2>
                                        <p>документ</p>
                                      </div>
                                    </div>
                                    <a href={el.file} className="dowload">
                                      {" "}
                                      Скачать{" "}
                                      <AiOutlineCloudDownload size={20} />{" "}
                                    </a>
                                  </div>
                                </>
                              ))
                            : ""}
                          {el.data.hotel.link ? (
                            <>
                              <div className="hr"></div>
                              <div className="history_all_two">
                                <a
                                  href={el.data.hotel.link}
                                  className="dowload doc"
                                >
                                  {" "}
                                  Скачать договор{" "}
                                  <AiOutlineDownload size={20} />{" "}
                                </a>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      )
                    )}
                </div>
              )
            ) : (
              ""
            )}
           
            {hand ? (
              historyHand && historyHand.length == 0 ? (
                <h1 className="not_data">
                  <img src={empty} alt="" />
                  Пусто
                </h1>
              ) : (
                <div className="his">
                  {historyHand.map((el, id) =>
                    el.error ? (
                      ""
                    ) : (
                      <div
                        key={id}
                        onClick={() => navigate(`/package-tour/${el.id}`)}
                        className="tour_block"
                      >
                        <div className="tour_block_one">
                          <div
                            style={{
                              margin: "0 5px",
                            }}
                          >
                            <PiPackageDuotone size={32} color="var(--blue)" />
                          </div>
                          <div className="rixos">
                            <h2
                              style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: "var(--black)",
                              }}
                            >
                              {el?.data.travel_type}
                            </h2>
                            <div
                              style={{
                                marginTop: 4,
                                borderRadius: 3,
                                background: el.data.status_color,
                                padding: "2px 6px",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  color: "var(--white)",
                                }}
                                className="status"
                              >
                                {el.data.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;
