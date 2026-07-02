import React, { useEffect, useMemo, useState } from "react";
import "./Reis.css";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../Api";
import Review from "./Review";
import { useDispatch, useSelector } from "react-redux";
import { PiCoffee } from "react-icons/pi";
import { LiaBedSolid } from "react-icons/lia";
import { BsCalendar2Check } from "react-icons/bs";
import Loader from "../../components/UI/Loader/Loader";
import { IoIosArrowBack } from "react-icons/io";
import { GoLocation } from "react-icons/go";
import { SlArrowRight } from "react-icons/sl";
import { Map, Placemark, YMaps } from "react-yandex-map";
import { ReisData, ReisDataNot } from "../../store/actions/reisAction";
import "react-calendar/dist/Calendar.css";
// import Calendar from "react-calendar/dist/cjs/Calendar.js";

const Reis = () => {
  const { slug, code } = useParams();

  const [one, setOne] = useState(true);
  const [two, setTwo] = useState(false);
  const [read, setRead] = useState(true);
  const [four, setFour] = useState(false);
  const [three, setThree] = useState(false);
  const [openTour, setOpenTour] = useState(false);
  const [dataReis, setDataReis] = useState([]);
  const [key, setKey] = useState(false);
  const [photo, setPhoto] = useState({
    block: false,
    photo: "",
  });
  const [stateData, setStateData] = useState({
    name: "",
    data: [],
  });
  const [dataTourDetail, setDataTourDetail] = useState([]);
  const { search } = useSelector((state) => state.search);
  const [local, setLocal] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [date, setDate] = useState(new Date());

  // const handleDateChange = (newDate) => {
  //   setDate(newDate);
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    }
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (code) {
      axios
        .get(url + `/api/detail/hotel/${code}`)
        .then((response) => {
          setDataReis(response.data.hotel);
          setKey(response.data.key);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [code]);

  const dataTour = useMemo(() => {
    // console.log("search?.result?.hotel:", search.result.hotel);

    if (search?.result?.hotel) {
      const filteredTours = search.result.hotel.filter(
        (obj) => String(obj.hotelcode) === String(code)
      );
      console.log("filteredTours:", filteredTours);
      return filteredTours;
    }
    return [];
  }, [search, code]);

  useEffect(() => {
    if (dataTour) {
      setDataTourDetail(dataTour);
    } else {
      setDataTourDetail([]);
    }
  }, [dataTour]);

  useEffect(() => {
    dispatch(ReisDataNot(dataReis));
    if (dataReis) {
      dispatch(ReisData(dataReis));
    }
  }, [dataReis]);

  return (
    <div className="reis">
      <div className="container">
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          className="exit"
          size={25}
        />
      </div>
      {dataReis.images || dataTourDetail.length > 0 ? (
        <>
          {dataReis.images?.image?.length > 0 && (
          <div className="slide">
            <Slider {...settings} className="slide_border">
              {dataReis.images.image.map((el, id) => (
                <div key={id} className="slider_dot-beck">
                  <img
                    onClick={() =>
                      setOne(false) ||
                      setTwo(true) ||
                      setThree(false) ||
                      setFour(false)
                    }
                    src={"https:" + el}
                    alt=""
                  />
                </div>
              ))}
            </Slider>
          </div>
          )}
          <div className="container">
            {/* <div className="relative">
              <div className="category">
                <button
                  onClick={() =>
                    setOne(true) ||
                    setThree(false) ||
                    setFour(false) ||
                    setTwo(false)
                  }
                  className={one ? "btn active" : "btn"}
                >
                  Отель
                </button>
                <button
                  onClick={() =>
                    setOne(false) ||
                    setTwo(true) ||
                    setThree(false) ||
                    setFour(false)
                  }
                  className={two ? "btn active" : "btn"}
                >
                  Фото
                </button>
                <button
                  onClick={() =>
                    setOne(false) ||
                    setThree(true) ||
                    setFour(false) ||
                    setTwo(false)
                  }
                  className={three ? "btn active" : "btn"}
                >
                  Отзывы
                </button>
                {dataReis.coord1 ? (
                  <button
                    onClick={() =>
                      setOne(false) ||
                      setThree(false) ||
                      setFour(true) ||
                      setTwo(false)
                    }
                    className={four ? "btn active" : "btn"}
                  >
                    На карте
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div> */}
            {one && (
              <>
                <div className="head_text">
                  <div className="stars">
                    {Array.from({ length: Math.min(dataReis.stars || dataTourDetail[0]?.hotelstars || 0, 5) }, (_, starIndex) => (
                      <span key={starIndex}>
                        <FaStar className="icon" size={15} />
                      </span>
                    ))}
                  </div>
                  <h1>{dataReis.name || dataTourDetail[0]?.hotelname || ""}</h1>
                  <p>{dataReis.placement || dataTourDetail[0]?.subregionname || ""}</p>
                </div>
                <div className="head_body_block">
                  <div className="geo">
                    <div className="div_geo">
                      <p className="bold_mini">
                        {dataReis?.country}, {dataReis?.region}
                      </p>
                      <div
                        onClick={() =>
                          setOne(false) ||
                          setThree(false) ||
                          setFour(true) ||
                          setTwo(false)
                        }
                        className="box_open"
                      >
                        <GoLocation size={20} color="var(--blue)" />
                        На карте
                      </div>
                    </div>
                    <div className="div_geo">
                      <div className="flex_geo">
                        <div className="rate">{dataReis.rating}</div>
                        <div className="ratingIcon tripadvisor"></div>
                      </div>
                      <div
                        onClick={() =>
                          setOne(false) ||
                          setThree(true) ||
                          setFour(false) ||
                          setTwo(false)
                        }
                        className="box_open"
                      >
                        Все отзывы
                      </div>
                    </div>
                  </div>
                </div>
                {read && (
                  <div className="services_wrapper">
                    {dataReis?.services ? (
                      <div
                        onClick={() =>
                          setStateData({
                            ...stateData,
                            name: "Сервис",
                            data: dataReis.services,
                          })
                        }
                        className={
                          stateData.name === "Сервис"
                            ? "services_box active"
                            : "services_box"
                        }
                      >
                        <h1> Сервис </h1>
                      </div>
                    ) : (
                      ""
                    )}
                    {dataReis?.meallist ? (
                      <div
                        onClick={() =>
                          setStateData({
                            ...stateData,
                            name: "Питание",
                            data: dataReis.meallist,
                          })
                        }
                        className={
                          stateData.name === "Питание"
                            ? "services_box active"
                            : "services_box"
                        }
                      >
                        <h1> Питание </h1>
                      </div>
                    ) : (
                      ""
                    )}
                    {dataReis?.beach ? (
                      <div
                        onClick={() =>
                          setStateData({
                            ...stateData,
                            name: "Пляж",
                            data: dataReis.beach,
                          })
                        }
                        className={
                          stateData.name === "Пляж"
                            ? "services_box active"
                            : "services_box"
                        }
                      >
                        <h1> Пляж </h1>
                      </div>
                    ) : (
                      ""
                    )}
                    {dataReis?.roomtypes ? (
                      <div
                        onClick={() =>
                          setStateData({
                            ...stateData,
                            name: "Типы комнат",
                            data: dataReis.roomtypes,
                          })
                        }
                        className={
                          stateData.name === "Типы комнат"
                            ? "services_box active"
                            : "services_box"
                        }
                      >
                        <h1> Типы комнат </h1>
                      </div>
                    ) : (
                      ""
                    )}
                    {dataReis?.territory ? (
                      <div
                        onClick={() =>
                          setStateData({
                            ...stateData,
                            name: "Территория отеля",
                            data: dataReis.territory,
                          })
                        }
                        className={
                          stateData.name === "Территория отеля"
                            ? "services_box active"
                            : "services_box"
                        }
                      >
                        <h1> Территория отеля </h1>
                      </div>
                    ) : (
                      ""
                    )}
                    {dataReis?.inroom ? (
                      <div
                        onClick={() =>
                          setStateData({
                            ...stateData,
                            name: "Номер",
                            data: dataReis.inroom,
                          })
                        }
                        className={
                          stateData.name === "Номер"
                            ? "services_box active"
                            : "services_box"
                        }
                      >
                        <h1> Номер </h1>
                      </div>
                    ) : (
                      ""
                    )}
                    {dataReis?.servicepay ? (
                      <div
                        onClick={() =>
                          setStateData({
                            ...stateData,
                            name: "Спорт",
                            data: dataReis.servicepay,
                          })
                        }
                        className={
                          stateData.name === "Спорт"
                            ? "services_box active"
                            : "services_box"
                        }
                      >
                        <h1> Спорт </h1>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
                {/* <div>
                  <h2>Выбранная дата: {date.toDateString()}</h2>
                  <Calendar onChange={handleDateChange} value={date} />
                </div> */}
                {stateData.name && (
                  <div className="services">
                    <h1>{stateData.name}</h1>
                    {React.createElement("div", {
                      dangerouslySetInnerHTML: {
                        __html: stateData.data,
                      },
                    })}
                  </div>
                )}
                {/* <button onClick={() => setRead(!read)} className="more">
                  Подробнее{" "}
                  {read ? (
                    <IoIosArrowUp className="icon" size={20} />
                  ) : (
                    <IoIosArrowDown className="icon" size={20} />
                  )}
                </button> */}
                {dataTourDetail?.length > 0 ? (
                    // <button
                    //   onClick={() => navigate(`/decor-hotel/${code}`)}
                    //   className="button_form fixet"
                    // >
                    //   {"Показать цены"}
                    // </button>
                    <button
                      onClick={() => setOpenTour(!openTour)}
                      className="button_form fixet"
                    >
                      { "Показать цены"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setOpenTour(!openTour)}
                      className="button_form fixet"
                    >
                      {"Скрыть"}
                    </button>
                    
                  )
                }

                {openTour && (
                  <div className="tour_details">
                    <div className="box_header"></div>
                    <div className="header">
                      <div className="container">
                        <div className="header_box">
                          <IoIosArrowBack
                            onClick={() => setOpenTour(false)}
                            className="icon"
                            size={25}
                          />
                          <div className="title">
                            <h1>Туры</h1>
                          </div>
                          <div style={{ width: 25 }}></div>
                        </div>
                      </div>
                    </div>
                    {/* {dataTourDetail.length > 0 ? (
                      dataTourDetail.map((el, index) => (
                        <div
                          onClick={() => navigate(`details-tour/${el.tourid}`)}
                          key={index}
                          className="tour_box"
                        >
                          <div className="contant_two">
                            <div className="div">
                              <BsCalendar2Check className="icon" size={23} />
                              <div className="btnp">
                                <h3>{el.flydate}</h3>
                              </div>
                            </div>
                            <div className="div">
                              <PiCoffee className="icon" size={23} />
                              <div className="btnp">
                                <h3>Питание: {el.meal}</h3>
                              </div>
                            </div>
                            <div className="div">
                              <LiaBedSolid className="icon" size={23} />
                              <div className="btnp">
                                <h3>Номер: {el.room}</h3>
                              </div>
                            </div>
                            <div className="hr"></div>
                            <div className="div pricediv">
                              <div className="btnp">
                                <h3>
                                  {el.price} {el.currency}
                                </h3>
                              </div>
                              <SlArrowRight size={15} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="loading_div">
                        <Loader />
                      </div>
                    )} */}
                    {dataTourDetail.length > 0 &&
                    dataTourDetail[0].tours.tour.length > 0 ? (
                      dataTourDetail[0].tours.tour.map((el) => (
                        <div
                          onClick={() => navigate(`/details-tour/${el.tourid}`)}
                          key={el.tourid}
                          className="tour_box"
                        >
                          <div className="contant_two">
                            <div className="div">
                              <BsCalendar2Check className="icon" size={23} />
                              <div className="btnp">
                                <h3>{el.flydate}</h3>
                              </div>
                            </div>
                            <div className="div">
                              <PiCoffee className="icon" size={23} />
                              <div className="btnp">
                                <h3>Питание: {el.meal}</h3>
                              </div>
                            </div>
                            <div className="div">
                              <LiaBedSolid className="icon" size={23} />
                              <div className="btnp">
                                <h3>Номер: {el.room}</h3>
                              </div>
                            </div>
                            <div className="hr"></div>
                            <div className="div pricediv">
                              <div className="btnp">
                                <h3>
                                  {el.price} {el.currency}
                                </h3>
                              </div>
                              <SlArrowRight size={15} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="loading_div">
                        <Loader />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {two && (
              <div className="map">
                <div className="box_header"></div>
                <div className="header">
                  <div className="container">
                    <div className="header_box">
                      <IoIosArrowBack
                        onClick={() => setTwo(false) || setOne(true)}
                        className="icon"
                        size={25}
                      />
                      <div className="title">
                        <h1>Фотографии</h1>
                      </div>
                      <div style={{ width: 25 }}></div>
                    </div>
                  </div>
                </div>
                <div className="overflowDiv">
                  <div className="gallery">
                    {dataReis.images.image.map((el, id) => (
                      <img
                        onClick={() =>
                          setPhoto({ ...photo, block: true, photo: el })
                        }
                        key={id}
                        src={"https:" + el}
                        alt=""
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {three && (
              <div className="map">
                <div className="reviews">
                  <div className="reviews_head">
                    <IoIosArrowBack
                      onClick={() => setThree(false) || setOne(true)}
                      className="icon_back"
                      size={25}
                    />
                    <div>
                      <div className="rate_rewiew">{dataReis.rating}</div>
                    </div>
                  </div>
                  <div className="rewiew_blocks">
                    <h3>Отзывы</h3>
                    <p>
                      Мы собираем реальные отзывы наших туристов после их
                      возвращения из тура
                    </p>
                  </div>
                  {dataReis.reviewscount === 0 ? (
                    <p className="reviewscount">Отзывов нет</p>
                  ) : (
                    dataReis.reviews.review.map((el, id) => (
                      <Review el={el} key={id} />
                    ))
                  )}
                </div>
              </div>
            )}
            {four && (
              <YMaps>
                <div className="map">
                  <div className="map_head">
                    <IoIosArrowBack
                      onClick={() => {
                        setFour(false);
                        setOne(true);
                      }}
                      className="icon"
                      size={20}
                    />
                    <p>{dataReis.name}</p>
                  </div>
                  <Map
                    defaultState={{
                      center: [dataReis.coord1, dataReis.coord2],
                      zoom: 12,
                    }}
                    width="100%"
                    height="100vh"
                    onBoundsChange={(event) => {
                      console.log("Bounds changed:", event);
                    }}
                  >
                    <Placemark geometry={[dataReis.coord1, dataReis.coord2]} />
                  </Map>
                </div>
              </YMaps>
            )}
          </div>
          {photo.block && (
            <div className="black_box">
              <IoIosArrowBack
                onClick={() => setPhoto({ ...photo, block: false, photo: "" })}
                className="back"
                size={25}
              />
              <div className="slide">
                <Slider {...settings} className="slide_border">
                  <div>
                    <img src={"https:" + photo.photo} alt="" />
                  </div>
                  {dataReis.images.image.map((el, id) =>
                    el === photo.photo ? (
                      ""
                    ) : (
                      <div>
                        <img src={"https:" + el} alt="" />
                      </div>
                    )
                  )}
                </Slider>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="loading_div">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Reis;
