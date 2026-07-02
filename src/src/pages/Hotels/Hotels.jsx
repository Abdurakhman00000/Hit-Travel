import React, { useEffect, useMemo, useState } from "react";
import "./Hotels.css";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import {
  searchAction,
  searchActionNot,
} from "../../store/actions/searchAction";
import { GiRollingSuitcase } from "react-icons/gi";
import { CgCalendarDates } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { BiSearchAlt2 } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import { PiCoffee } from "react-icons/pi";
import Slider from "react-slider";
import { MdArrowForwardIos } from "react-icons/md";
import { AiOutlineCloseCircle, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import Modal from "../../components/UI/Modal/Modal";
import { BiCategoryAlt } from "react-icons/bi";
import Loader from "../../components/UI/Loader/Loader";
import NumberSelector from "../../components/UI/Day/Day";
import Calendar from "../../components/UI/DatePicker/DatePicker";
import { IoSearch } from "react-icons/io5";

const rateHotelData = [
  {
    id: 0,
    rate: "любое",
    ratecount: 0,
  },
  {
    id: 1,
    rate: "3.0",
    ratecount: 2,
  },
  {
    id: 2,
    rate: "3.5",
    ratecount: 3,
  },
  {
    id: 3,
    rate: "4.0",
    ratecount: 4,
  },
  {
    id: 4,
    rate: "4.5",
    ratecount: 5,
  },
];

const currencyData = [
  {
    id: 1,
    currency: "USD/EUR",
    name: "Валюта",
  },
  {
    id: 99,
    currency: "KGS",
    name: "Кыргызский сом",
  },
];

const hotelData = [
  {
    id: 1,
    code: "active",
    name: "активный",
  },
  {
    id: 2,
    code: "relax",
    name: "расслабляться",
  },
  {
    id: 3,
    code: "family",
    name: "семья",
  },
  {
    id: 4,
    code: "health",
    name: "здоровье",
  },
  {
    id: 5,
    code: "city",
    name: "город",
  },
  {
    id: 6,
    code: "beach",
    name: "пляж",
  },
  {
    id: 7,
    code: "deluxe",
    name: "делюкс",
  },
];

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();

  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
}

const formatDateWithoutYear = (inputDate) => {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();

  const formattedDate = `${day}.${month}`;

  return formattedDate;
};

const Hotels = ({
  dateData,
  regions,
  countBaby,
  Alert,
  loader,
  setLoader,
  apiCountryRequest,
  apiRegionsRequest,
  MIN,
  MAX,
  modal,
  setModal,
  modalSearch,
  setModalSearch,
  userModal,
  setUserModal,
  dateFilter,
  setDateFilter,
  count,
  setCount,
  requests,
  setRequests,
  dateNightFrom,
  setDateNightFrom,
  dateNightTo,
  setDateNightTo,
  value,
  setValue,
  depor,
  setDepor,
  countryMain,
  setCountryMain,
  countryData,
  setCountryData,
  selectedStars,
  setSelectedStars,
  selectedMeal,
  setSelectedMeal,
  hotel,
  setHotel,
  resortsWithChildren,
  setResortsWithChildren,
  openedResorts,
  setOpenedResorts,
  dateform,
  setDateForm,
  filterModal,
  setFilterModal,
  charter,
  setCharter,
  mealModal,
  setMealModal,
  currencyModal,
  setCurrencyModal,
  resortModal,
  setResortModal,
  operatorModal,
  setOperatorModal,
  typeHotelModal,
  setTypeHotelModal,
  hotelModal,
  setHotelModal,
  rateHotelModal,
  setRateHotelModal,
  servicesHotelModal,
  setServicesHotelModal,
  handleResortClick,
  formatDateToYYYYMMDD,
  handleDateNightFromChange,
  handleSelectMeal,
  handleSelectCurrency,
  handleSelectResort,
  handleSelectOperator,
  handleSelectTypeHotel,
  handleSelectHotel,
  handleSelectRateHotel,
  handleSelectServicesHotel,
}) => {
  const [getten, setGetten] = useState("");
  const { get, name, country } = useParams();
  const navigate = useNavigate();
  const messages = true;
  const dispatch = useDispatch();
  const { search, loading } = useSelector((state) => state.search);
  const { dataFilter } = useSelector((state) => state.filter);
  const [valueHotels, setValueHotels] = useState("");
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(false);

  useEffect(() => {
    if (search && search.result) {
      setOpen(true);
    }
  }, [search]);

  useEffect(() => {
    if (dataFilter && dataFilter.regions && dataFilter.regions.region) {
      const data = regions.regions.region
        ? regions.regions.region
        : dataFilter.regions.region;
      const resortsWithChildren = data.filter((resort) => {
        return dataFilter.regions.region.some(
          (child) => child.parentid === resort.id
        );
      });

      setResortsWithChildren(resortsWithChildren);
    }
  }, [dataFilter, regions]);

  useEffect(() => {
    if (search && search.status && search.status.hotelsfound == 0) {
      Alert("По вашему запросу нечего не найдено", "warning");
      navigate("/");
      dispatch(searchActionNot());
    }
  }, [search]);

  useEffect(() => {
    if (get) {
      setGetten(get);
    }
  }, [get]);

  useEffect(() => {
    if (loader == true) {
      dispatch(searchActionNot());
      if (getten !== "") {
        dispatch(searchAction(getten));
        setLoader(false);
      }
    }
  }, [loader, getten]);

  const filteredDatas = useMemo(() => {
    if (
      dataFilter &&
      dataFilter.departures &&
      dataFilter.departures.departure
    ) {
      return dataFilter.departures.departure.filter((obj) => {
        const fullName = obj.name.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });
    }
  }, [dataFilter, value]);

  const filteredDatasCountry = useMemo(() => {
    if (countryMain) {
      return countryMain.filter((obj) => {
        const fullName = obj.name.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });
    }
  }, [countryMain, value]);

  function funcDepor(bec) {
    setDepor(bec);
  }

  function funcCountry(bec) {
    setCountryData(bec);
    apiCountryRequest(bec.id);
    apiRegionsRequest(bec.id);
  }

  function Redirect() {
    const get = `departure=${depor.id}${
      countryData.id ? `&&country=${countryData.id}` : ""
    }${
      dateNightFrom > new Date().toISOString().split("T")[0]
        ? `&&datefrom=${formatDate(dateNightFrom)}`
        : ""
    }${
      dateNightTo > new Date().toISOString().split("T")[0]
        ? `&&dateto=${formatDate(dateNightTo)}`
        : ""
    }${requests.budget[0] ? `&&nightsfrom=${requests.budget[0]}` : ""}${
      requests.budget[1] ? `&&nightsto=${requests.budget[1]}` : ""
    }&&adults=${count.count1}${
      count.count2 > 0 ? `&&child=${count.count2}` : ""
    }${count.count3 > 0 ? `&&childage1=${count.count3}` : ""}${
      count.count4 > 0 ? `&&childage2=${count.count4}` : ""
    }${
      count.count5 > 0 ? `&&childage3=${count.count5}` : ""
    }&&stars=${selectedStars}${
      mealModal.meal == "" ? "" : `&&meal=${mealModal.meal}`
    }&&currency=${currencyModal.selected}${
      currencyModal.pricefrom
        ? `&&pricefrom=${currencyModal.pricefrom}`
        : "&&pricefrom=0"
    }${
      currencyModal.priceto
        ? `&&priceto=${currencyModal.priceto}`
        : "&&priceto=999999999"
    }${rateHotelModal.ratecount ? `&&rating=${rateHotelModal.ratecount}` : ""}${
      servicesHotelModal.serviceshotel.length > 0
        ? `&&services=${servicesHotelModal.serviceshotelread}`
        : ""
    }${
      operatorModal.operator.length > 0
        ? `&&operators=${operatorModal.operatorread}`
        : ""
    }${
      resortModal.resort.length > 0 ? `&&regions=${resortModal.resortread}` : ""
    }${
      resortModal.resort.length > 0
        ? `&&subregions=${resortModal.resirtchildrenread}`
        : ""
    }&&directOnly=${charter}${
      hotelModal.hotel.length > 0 ? `&&hotels=${hotelModal.hotelread}` : ""
    }${
      typeHotelModal.typehotel.length > 0
        ? `&&hoteltypes=${typeHotelModal.typehotelread}`
        : ""
    }`;
    setOpen(true);
    setLoader(true);
    setGetten(get);
    setFilterModal(false);
  }

  const guarantee = {
    group: "Доп.фильтры",
    id: 46,
    name: "Мгновенное подтверждение",
  };

  const hotelValueSearch = useMemo(() => {
    if (search && search.result && search.result.hotel) {
      return search.result.hotel.filter((obj) => {
        const fullName = obj.hotelname.toLowerCase();
        return fullName.includes(valueHotels.toLowerCase());
      });
    }
  }, [search, valueHotels]);

  const countTourist = count.count1 + count.count2;

  const price_child =
    countBaby == 1 ? 80 : countBaby == 2 ? 160 : countBaby == 3 ? 240 : 0;

  return (
    <div className="hotels">
      <Header>
        <h1>Отели</h1>
      </Header>
      <div className="container">
        <div className="search_block">
          {/* <div
            onClick={() => setModalSearch(true)}
            className="search_block_box"
          >
            <GiAirplaneDeparture color="var(--blue)" className="icon" size={25} />
            <div>
              <p> Город вылета</p>
              <h1> {depor.name} </h1>
            </div>
          </div>
          <div className="hr"></div> */}
          <div onClick={() => setModal(!modal)} className="search_block_box">
            <GiRollingSuitcase color="var(--blue)" className="icon" size={25} />
            <div>
              <p> Страна, курорт, отель</p>
              <h1> {countryData.name} </h1>
            </div>
          </div>
        </div>
        <div className="filt_new">
          <div className="filt_grid">
            <div
              onClick={() => setDateFilter(!dateFilter)}
              className="filt_box"
            >
              <p>Дата вылета</p>
              <h1>
                {" "}
                {formatDateWithoutYear(dateNightFrom)} -{" "}
                {formatDateWithoutYear(dateNightTo)}{" "}
              </h1>
            </div>
            <div onClick={() => setDay(!day)} className="filt_box">
              <p>На сколько</p>
              <h1>
                {" "}
                {requests.budget[0]}{" "}
                {requests.budget[1] !== requests.budget[0] &&
                  `- ${requests.budget[1]}`}{" "}
                ночей{" "}
              </h1>
            </div>
          </div>
          <div onClick={() => setUserModal(!userModal)} className="filt_save">
            <p>Кто летит</p>
            <h1>
              {count.count1
                ? count.count1 == 1
                  ? `${count.count1} взрослый`
                  : `${count.count1} взрослых`
                : ""}{" "}
              {count.count2
                ? count.count2 == 1
                  ? `, ${count.count2} ребенок`
                  : `, ${count.count2} детей`
                : ""}{" "}
            </h1>
          </div>
          <div className="filt_grid">
            <div className="filt_box">
              <p>Класс отеля</p>
              {Array.from({ length: 5 }, (_, starIndex) => (
                <span
                  className={`star ${
                    starIndex < selectedStars ? "active" : ""
                  }`}
                  key={starIndex}
                  onClick={() => setSelectedStars(starIndex + 1)}
                >
                  <FaStar className="icon" size={15} />
                </span>
              ))}
            </div>
            <div
              onClick={() => setMealModal({ ...mealModal, closeDiv: true })}
              className="filt_box"
            >
              <p>Питание</p>
              <div className="flex">
                <h1> {mealModal.mealread ? mealModal.mealread : "Любое"}</h1>
              </div>
            </div>
            {/* <div onClick={() => setFilterModal(!filterModal)} className="filt_box">
              <div className="box">
                <BiCategoryAlt className="icon_btn" size={18} />
                Фильтры
              </div>
            </div> */}
          </div>
          <div className="filt_grid">
            <div
              onClick={() => setHotelModal({ ...hotelModal, closeDiv: true })}
              className="filt_box"
            >
              <p>Отель</p>
              <h1>
                {hotelModal.hotel.length > 0
                  ? `Выбрано (${hotelModal.hotel.length})`
                  : "Любое"}
                {hotelModal.hotel.length == 0 ? (
                  <MdArrowForwardIos color="var(--blue)" size={20} />
                ) : (
                  <AiOutlineClose
                    onClick={(e) =>
                      e.stopPropagation() ||
                      setHotelModal({
                        ...hotelModal,
                        hotel: [],
                        hotelread: "",
                      })
                    }
                    color="var(--blue)"
                    size={20}
                  />
                )}
              </h1>
            </div>
            <div
              onClick={() => setResortModal({ ...resortModal, closeDiv: true })}
              className="filt_box"
            >
              <p>Курорт</p>
              <h1>
                {resortModal.resort.length > 0
                  ? `Выбрано (${resortModal.resort.length})`
                  : "Любое"}
                {resortModal.resort.length == 0 ? (
                  <MdArrowForwardIos color="var(--blue)" size={20} />
                ) : (
                  <AiOutlineClose
                    onClick={(e) =>
                      e.stopPropagation() ||
                      setResortModal({
                        ...resortModal,
                        resort: [],
                        resortread: "",
                      })
                    }
                    color="var(--blue)"
                    size={20}
                  />
                )}
              </h1>
            </div>
          </div>
        </div>
        {/* <div className="filter_block">
          <button
            onClick={() => setDateFilter(!dateFilter)}
            className="btn"
          >
            {" "}
            <CgCalendarDates className="icon_btn" size={22} /> Дата
          </button>
          <button
            onClick={() => setUserModal(!userModal)}
            className="btn g"
          >
            <FaUser className="icon_btn" size={18} /> {countTourist}
          </button>
          <button onClick={() => setFilterModal(!filterModal)} className="btn">
            <BiCategoryAlt className="icon_btn" size={18} />
            Фильтры
          </button>
        </div> */}
        <button onClick={Redirect} className="button_form">
          Поиск
        </button>
      </div>
      {open ? (
        loading ? (
          search && search.result && search.result.hotel.length > 0 ? (
            <div className="body">
              {search.toursfound == 0 ? (
                ""
              ) : (
                <div className="container">
                  <div className="input_box_country">
                    <BiSearchAlt2
                      className="icon_search"
                      color="var(--blue)"
                      size={25}
                    />
                    <input
                      value={valueHotels}
                      onChange={(e) => setValueHotels(e.target.value)}
                      className="input"
                      type="text"
                      placeholder="Поиск отеля"
                    />
                  </div>
                  {search.result.hotel
                    ? hotelValueSearch.map((el, id) => (
                        <div
                          key={id}
                          onClick={() => navigate(`/reis/${el.hotelcode}`)}
                          className="body_block"
                        >
                          <img className="img" src={el.picturelink} alt="" />
                          <div className="content_home">
                            <div className="content">
                              <div className="conntent_block_one">
                                <div className="conntent_block_two">
                                  <div className="content_p">
                                    {Array.from(
                                      { length: el.hotelstars },
                                      (_, starIndex) => (
                                        <span key={starIndex}>
                                          <FaStar className="icon" size={15} />
                                        </span>
                                      )
                                    )}
                                    <h1>{el.hotelname}</h1>
                                    <p>{el.subregionname}</p>
                                  </div>
                                  <div>
                                    <div className="rate">{el.hotelrating}</div>
                                    <div className="ratingIcon tripadvisor"></div>
                                  </div>
                                </div>
                                <p className="top">{el.hoteldescription}</p>
                              </div>
                            </div>
                            {/* <div className="beach_div">
                                  <div className="beach">
                                    <img src={beach1} alt="" />1 линия
                                  </div>
                                  <div className="beach">
                                    <img src={beach2} alt="" />
                                    Песок
                                  </div>
                                  <div className="beach">
                                    <img src={beach3} alt="" />
                                    Аквапарк
                                  </div>
                                </div> */}
                            <div className="hr"></div>
                            <div className="price">
                              <p className="p">
                                Цена за {el.tours.tour[0].adults} взрослых
                              </p>
                              <div>
                                <h1>
                                  {el.price} {el.currency}
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              )}
            </div>
          ) : (
            ""
          )
        ) : (
          <div className="loading_div">
            <Loader />
          </div>
        )
      ) : (
        ""
      )}
      {dataFilter && dataFilter.meals && dataFilter.meals.meal
        ? filterModal && (
            <div className="filter_home_div">
              <div className="container">
                <div className="header_filter_box">
                  <h2 className="header_h2">Фильтры</h2>
                  <AiOutlineCloseCircle
                    onClick={() => setFilterModal(false)}
                    style={{ color: "var(--blue)", cursor: "pointer" }}
                    size={25}
                  />
                </div>
                <div className="filter_block_div">
                  <p>Класс отеля</p>
                  <div className="star_block">
                    <div>
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <span
                          className={`star ${
                            starIndex < selectedStars ? "active" : ""
                          }`}
                          key={starIndex}
                          onClick={() => setSelectedStars(starIndex + 1)}
                        >
                          <FaStar className="icons" size={15} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setMealModal({ ...mealModal, closeDiv: true })}
                  className="filter_block_div"
                >
                  <div>
                    <p>Питание</p>
                    {mealModal.mealread ? <h4>{mealModal.mealread}</h4> : ""}
                  </div>
                  {mealModal.mealread ? (
                    <AiOutlineClose
                      onClick={(e) =>
                        e.stopPropagation() ||
                        setMealModal({
                          ...mealModal,
                          meal: [],
                          mealread: "",
                        }) ||
                        setSelectedMeal(null)
                      }
                      color="var(--blue)"
                      size={20}
                    />
                  ) : (
                    <MdArrowForwardIos color="var(--blue)" size={20} />
                  )}
                </div>
                <div
                  onClick={() =>
                    setResortModal({ ...resortModal, closeDiv: true })
                  }
                  className="filter_block_div"
                >
                  <div>
                    <p>Курорт</p>
                    {resortModal.resort.length > 0 && (
                      <h4>{`Выбрано (${resortModal.resort.length})`}</h4>
                    )}
                  </div>
                  {resortModal.resort.length == 0 ? (
                    <MdArrowForwardIos color="var(--blue)" size={20} />
                  ) : (
                    <AiOutlineClose
                      onClick={(e) =>
                        e.stopPropagation() ||
                        setResortModal({
                          ...resortModal,
                          resort: [],
                          resortread: "",
                        })
                      }
                      color="var(--blue)"
                      size={20}
                    />
                  )}
                </div>
                {/* <div
                onClick={() =>
                  setCurrencyModal({ ...currencyModal, closeDiv: true })
                }
                className="filter_block_div"
              >
                <div>
                  <p>
                    Бюджет{" "}
                    <span className="currency_rub">
                      ({currencyModal.currency})
                    </span>{" "}
                  </p>
                  {currencyModal.pricefrom || currencyModal.priceto ? (
                    <h4>
                      {currencyModal.pricefrom &&
                        `от ${currencyModal.pricefrom}`}{" "}
                      {currencyModal.priceto && `до ${currencyModal.priceto}`}{" "}
                      {currencyModal.currency}
                    </h4>
                  ) : (
                    ""
                  )}
                </div>
                {currencyModal.pricefrom ? (
                  <AiOutlineClose
                    onClick={(e) =>
                      e.stopPropagation() ||
                      setCurrencyModal({
                        ...currencyModal,
                        currency: "РУБ",
                        pricefrom: "",
                        priceto: "",
                        selected: 0,
                      })
                    }
                    color="var(--blue)"
                    size={20}
                  />
                ) : (
                  <MdArrowForwardIos color="var(--blue)" size={20} />
                )}
              </div> */}
                {/* <div
                  onClick={() =>
                    setOperatorModal({ ...operatorModal, closeDiv: true })
                  }
                  className="filter_block_div"
                >
                  <div>
                    <p>Туроператор</p>
                    {operatorModal.operator.length > 0 && (
                      <h4>{`Выбрано (${operatorModal.operator.length})`}</h4>
                    )}
                  </div>
                  {operatorModal.operator.length == 0 ? (
                    <MdArrowForwardIos color="var(--blue)" size={20} />
                  ) : (
                    <AiOutlineClose
                      onClick={(e) =>
                        e.stopPropagation() ||
                        setOperatorModal({
                          ...operatorModal,
                          operator: [],
                          operatorread: "",
                        })
                      }
                      color="var(--blue)"
                      size={20}
                    />
                  )}
                </div> */}
                <div
                  onClick={() => setCharter(!charter)}
                  className="filter_block_div"
                >
                  <p>Только чартер</p>
                  <input
                    type="checkbox"
                    checked={charter}
                    onChange={(e) => setCharter(e.target.value)}
                  />
                </div>
                <div
                  onClick={() =>
                    setHotelModal({ ...hotelModal, closeDiv: true })
                  }
                  className="filter_block_div"
                >
                  <div>
                    <p>Отель</p>
                    {hotelModal.hotel.length > 0 && (
                      <h4>{`Выбрано (${hotelModal.hotel.length})`}</h4>
                    )}
                  </div>
                  {hotelModal.hotel.length == 0 ? (
                    <MdArrowForwardIos color="var(--blue)" size={20} />
                  ) : (
                    <AiOutlineClose
                      onClick={(e) =>
                        e.stopPropagation() ||
                        setHotelModal({
                          ...hotelModal,
                          hotel: [],
                          hotelread: "",
                        })
                      }
                      color="var(--blue)"
                      size={20}
                    />
                  )}
                </div>
                {/* <div
                onClick={() =>
                  setTypeHotelModal({ ...typeHotelModal, closeDiv: true })
                }
                className="filter_block_div"
              >
                <div>
                  <p>Тип отеля</p>
                  {typeHotelModal.typehotel.length > 0 && (
                    <h4>{`Выбрано (${typeHotelModal.typehotel.length})`}</h4>
                  )}
                </div>
                {typeHotelModal.typehotel.length == 0 ? (
                  <MdArrowForwardIos color="var(--blue)" size={20} />
                ) : (
                  <AiOutlineClose
                    onClick={(e) =>
                      e.stopPropagation() ||
                      setTypeHotelModal({
                        ...typeHotelModal,
                        typehotel: [],
                        typehotelread: "",
                      })
                    }
                    color="var(--blue)"
                    size={20}
                  />
                )}
              </div> */}
                {/* <div
                onClick={() =>
                  setRateHotelModal({ ...rateHotelModal, closeDiv: true })
                }
                className="filter_block_div"
              >
                <div>
                  <p>Рейтинг отеля</p>
                  {rateHotelModal.ratehotelread ? (
                    <h4>{rateHotelModal.ratehotelread}</h4>
                  ) : (
                    ""
                  )}
                </div>
                {rateHotelModal.ratehotelread ? (
                  <AiOutlineClose
                    onClick={(e) =>
                      e.stopPropagation() ||
                      setRateHotelModal({
                        ...rateHotelModal,
                        ratehotelread: "",
                        selected: 0,
                        ratecount: 0,
                      })
                    }
                    color="var(--blue)"
                    size={20}
                  />
                ) : (
                  <MdArrowForwardIos color="var(--blue)" size={20} />
                )}
              </div>
              <div
                onClick={() =>
                  setServicesHotelModal({
                    ...servicesHotelModal,
                    closeDiv: true,
                  })
                }
                className="filter_block_div"
              >
                <div>
                  <p>Услуги отеля</p>
                  {servicesHotelModal.serviceshotel.includes(46) ? (
                    <h4>Мгновенное подтверждение</h4>
                  ) : (
                    servicesHotelModal.serviceshotel.length > 0 && (
                      <h4>{`Выбрано (${servicesHotelModal.serviceshotel.length})`}</h4>
                    )
                  )}
                </div>
                {servicesHotelModal.serviceshotel.length == 0 ? (
                  <MdArrowForwardIos color="var(--blue)" size={20} />
                ) : (
                  <AiOutlineClose
                    onClick={(e) =>
                      e.stopPropagation() ||
                      setServicesHotelModal({
                        ...servicesHotelModal,
                        serviceshotel: [],
                        serviceshotelread: "",
                      })
                    }
                    color="var(--blue)"
                    size={20}
                  />
                )}
              </div> */}
                {/* <div
                  onClick={() =>
                    handleSelectServicesHotel(guarantee) ||
                    (servicesHotelModal.serviceshotel.includes(guarantee.id)
                      ? ""
                      : setServicesHotelModal({
                          ...servicesHotelModal,
                          serviceshotel: [46],
                          serviceshotelread: "46",
                        }))
                  }
                  className="filter_block_div"
                >
                  <p>Гарантия мест в отеле </p>
                  <input
                    type="checkbox"
                    checked={servicesHotelModal.serviceshotel.includes(
                      guarantee.id
                    )}
                    onChange={() =>
                      handleSelectServicesHotel(guarantee) ||
                      (servicesHotelModal.serviceshotel.includes(guarantee.id)
                        ? ""
                        : setServicesHotelModal({
                            ...servicesHotelModal,
                            serviceshotel: [46],
                            serviceshotelread: "46",
                          }))
                    }
                    onClick={() =>
                      handleSelectServicesHotel(guarantee) ||
                      (servicesHotelModal.serviceshotel.includes(guarantee.id)
                        ? ""
                        : setServicesHotelModal({
                            ...servicesHotelModal,
                            serviceshotel: [46],
                            serviceshotelread: "46",
                          }))
                    }
                  />
                </div> */}
                <button onClick={Redirect} className="button_form">
                  Найти
                </button>
              </div>
            </div>
          )
        : ""}
      {country
        ? modal && (
            <Modal close={setModal}>
              <div className="relative">
                <IoSearch color="var(--blue)" className="icon" size={20} />
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="text"
                  placeholder="Поиск"
                />
              </div>
              <div className="map_mest_travel">
                {filteredDatasCountry.map((el) => (
                  <div
                    onClick={() =>
                      funcCountry(el) ||
                      setModal(false) ||
                      setResortModal({ ...resortModal, closeDiv: true })
                    }
                    key={el.id}
                    className="mest cursor"
                  >
                    <div className="icons">
                      <GoLocation className="icon dark" size={20} />
                    </div>
                    <div>
                      <p>{el.name}</p>
                      {/* <span>
                        {el.directfly == 0
                          ? "Не прямой перелёт"
                          : "Прямой перелёт"}
                      </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
          )
        : ""}
      {dataFilter && dataFilter.countries && dataFilter.countries.country
        ? modalSearch && (
            <Modal close={setModalSearch}>
              <div className="relative">
                <IoSearch color="var(--blue)" className="icon" size={20} />
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="text"
                  placeholder="Поиск"
                />
              </div>
              <div className="map_mest_travel">
                {filteredDatas.map((el) => (
                  <div
                    onClick={() =>
                      funcDepor(el) ||
                      setModalSearch(false) ||
                      setCountryData({ name: "Не выбрано" }) ||
                      setValue("")
                    }
                    key={el.id}
                    className="mest cursor"
                  >
                    <div className="icons">
                      <GoLocation className="icon dark" size={20} />
                    </div>
                    <div>
                      <p>{el.name}</p>
                      <span>
                        {el.national == 1
                          ? "Россия"
                          : el.national == 2
                          ? "Беларусия"
                          : el.national == 3
                          ? "Казахстан"
                          : el.national == 99
                          ? "Другие страны"
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
          )
        : ""}
      {servicesHotelModal.closeDiv && (
        <Modal open={servicesHotelModal} close={setServicesHotelModal}>
          <div className="filter_block_modal">
            <h1 className="shadow_h1">Выберите услуги отеля</h1>
            <div className="overflow">
              {/* <h4>Доп.фильтры</h4>
              {dataFilter.services.service
                .filter((item) => item.group.includes("Доп.фильтры"))
                .map((el) => (
                  <div
                    key={el.id}
                    className="star_box"
                    onClick={() => handleSelectServicesHotel(el)}
                  >
                    <input
                      type="checkbox"
                      checked={servicesHotelModal.serviceshotel.includes(el.id)}
                      onChange={() => handleSelectServicesHotel(el)}
                    />
                    <p>{el.name}</p>
                  </div>
                ))} */}
              <h4>Для детей</h4>
              {dataFilter.services.service
                .filter((item) => item.group.includes("Для детей"))
                .map((el) => (
                  <div
                    key={el.id}
                    className="star_box"
                    onClick={() => handleSelectServicesHotel(el)}
                  >
                    <input
                      type="checkbox"
                      checked={servicesHotelModal.serviceshotel.includes(el.id)}
                      onChange={() => handleSelectServicesHotel(el)}
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
              <h4>Номер</h4>
              {dataFilter.services.service
                .filter((item) => item.group.includes("Номер"))
                .map((el) => (
                  <div
                    key={el.id}
                    className="star_box"
                    onClick={() => handleSelectServicesHotel(el)}
                  >
                    <input
                      type="checkbox"
                      checked={servicesHotelModal.serviceshotel.includes(el.id)}
                      onChange={() => handleSelectServicesHotel(el)}
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
              <h4>Пляж</h4>
              {dataFilter.services.service
                .filter((item) => item.group.includes("Пляж"))
                .map((el) => (
                  <div
                    key={el.id}
                    className="star_box"
                    onClick={() => handleSelectServicesHotel(el)}
                  >
                    <input
                      type="checkbox"
                      checked={servicesHotelModal.serviceshotel.includes(el.id)}
                      onChange={() => handleSelectServicesHotel(el)}
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
              <h4>Территория</h4>
              {dataFilter.services.service
                .filter((item) => item.group.includes("Территория"))
                .map((el) => (
                  <div
                    key={el.id}
                    className="star_box"
                    onClick={() => handleSelectServicesHotel(el)}
                  >
                    <input
                      type="checkbox"
                      checked={servicesHotelModal.serviceshotel.includes(el.id)}
                      onChange={() => handleSelectServicesHotel(el)}
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
              <h4>Услуги</h4>
              {dataFilter.services.service
                .filter((item) => item.group.includes("Услуги"))
                .map((el) => (
                  <div
                    key={el.id}
                    className="star_box"
                    onClick={() => handleSelectServicesHotel(el)}
                  >
                    <input
                      type="checkbox"
                      checked={servicesHotelModal.serviceshotel.includes(el.id)}
                      onChange={() => handleSelectServicesHotel(el)}
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
              <h4>Тип отеля</h4>
              {dataFilter.services.service
                .filter((item) => item.group.includes("Тип отеля"))
                .map((el) => (
                  <div
                    key={el.id}
                    className="star_box"
                    onClick={() => handleSelectServicesHotel(el)}
                  >
                    <input
                      type="checkbox"
                      checked={servicesHotelModal.serviceshotel.includes(el.id)}
                      onChange={() => handleSelectServicesHotel(el)}
                    />
                    <p>{el.name}</p>
                  </div>
                ))}
            </div>
            <button
              onClick={() =>
                servicesHotelModal.serviceshotel.length > 0
                  ? setServicesHotelModal({
                      ...servicesHotelModal,
                      closeDiv: false,
                    }) ||
                    servicesHotelModal.serviceshotel.includes(guarantee.id)
                    ? handleSelectServicesHotel(guarantee)
                    : ""
                  : ""
              }
              className={`btn_close_block_modal ${
                servicesHotelModal.serviceshotel.length > 0 ? "active" : ""
              }`}
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
      {rateHotelModal.closeDiv && (
        <Modal open={rateHotelModal} close={setRateHotelModal}>
          <div className="filter_block_modal">
            <h1>Выберите рейтинг отеля</h1>
            {rateHotelData.map((el) => (
              <div
                key={el.id}
                className={`star_box ${
                  rateHotelModal.selected === el.id ? "selected" : ""
                }`}
                onClick={() => handleSelectRateHotel(el)}
              >
                <input
                  type="checkbox"
                  checked={rateHotelModal.selected === el.id}
                  onChange={() => handleSelectRateHotel(el)}
                />
                <p>{el.rate}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {hotelModal.closeDiv && (
        <Modal open={hotelModal} close={setHotelModal} style={"style"}>
          <div className="filter_block_modal">
            <h1>Выберите отель</h1>
            <input
              className="input_form"
              type="text"
              placeholder="Введите названия отеля"
              value={hotelModal.hotelvalue}
              onChange={(e) =>
                setHotelModal({ ...hotelModal, hotelvalue: e.target.value })
              }
            />
            <div className="overflow">
              {hotel.length > 0 ? (
                hotel
                  .filter((obj) => {
                    const fullName = obj.name.toLowerCase();
                    return fullName.includes(
                      hotelModal.hotelvalue.toLowerCase()
                    );
                  })
                  .map((el) => (
                    <div
                      key={el.id}
                      className="star_box"
                      onClick={() => handleSelectHotel(el)}
                    >
                      <input
                        type="checkbox"
                        checked={hotelModal.hotel.includes(el.id)}
                        onChange={() => handleSelectHotel(el)}
                      />
                      <p>{el.name}</p>
                    </div>
                  ))
              ) : (
                <p>В этой стране отелей нет</p>
              )}
            </div>
            <button
              onClick={() =>
                hotelModal.hotel.length > 0
                  ? setHotelModal({ ...hotelModal, closeDiv: false })
                  : ""
              }
              className={`btn_close_block_modal absolute ${
                hotelModal.hotel.length > 0 ? "active" : ""
              }`}
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
      {typeHotelModal.closeDiv && (
        <Modal open={typeHotelModal} close={setTypeHotelModal}>
          <div className="filter_block_modal">
            <h1>Выберите тип отеля</h1>
            {hotelData.map((el, id) => (
              <div
                key={id}
                className="star_box"
                onClick={() => handleSelectTypeHotel(el)}
              >
                <input
                  type="checkbox"
                  checked={typeHotelModal.typehotel.includes(el.code)}
                  onChange={() => handleSelectTypeHotel(el)}
                />
                <p>{el.name}</p>
              </div>
            ))}
            <button
              onClick={() =>
                typeHotelModal.typehotel.length > 0
                  ? setTypeHotelModal({ ...typeHotelModal, closeDiv: false })
                  : ""
              }
              className={`btn_close_block_modal ${
                typeHotelModal.typehotel.length > 0 ? "active" : ""
              }`}
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
      {operatorModal.closeDiv && (
        <Modal open={operatorModal} close={setOperatorModal}>
          <div className="filter_block_modal">
            <h1>Выберите туроператора</h1>
            <div className="overflow">
              {dataFilter.operators.operator.map((el) => (
                <div
                  key={el.id}
                  className="star_box"
                  onClick={() => handleSelectOperator(el)}
                >
                  <input
                    type="checkbox"
                    checked={operatorModal.operator.includes(el.id)}
                    onChange={() => handleSelectOperator(el)}
                  />
                  <p>{el.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                operatorModal.operator.length > 0
                  ? setOperatorModal({ ...operatorModal, closeDiv: false })
                  : ""
              }
              className={`btn_close_block_modal ${
                operatorModal.operator.length > 0 ? "active" : ""
              }`}
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
      {resortModal.closeDiv && (
        <Modal open={resortModal} close={setResortModal}>
          <div className="filter_block_modal">
            <h1>Выберите курорт</h1>
            <input
              className="input_form"
              type="text"
              placeholder="Введите названия курорта"
              value={resortModal.resortvalue}
              onChange={(e) =>
                setResortModal({ ...resortModal, resortvalue: e.target.value })
              }
            />
            <div className="details overflow">
              {regions.regions.region &&
                regions.regions.region
                  .filter((obj) => {
                    return obj.name.includes(resortModal.resortvalue);
                  })
                  .map((resort) => (
                    <div key={resort.id}>
                      <div className="relative_resort">
                        <div
                          key={resort.id}
                          className="star_box"
                          onClick={() => handleSelectResort(resort)}
                        >
                          <input
                            type="checkbox"
                            checked={resortModal.resort.includes(resort.id)}
                            onChange={() => handleSelectResort(resort)}
                          />
                          <p>{resort.name}</p>
                        </div>
                        {regions &&
                          regions.subregions &&
                          regions.subregions.subregion &&
                          regions.subregions.subregion.some(
                            (childResort) =>
                              childResort.parentregion === resort.id
                          ) && (
                            <div
                              className="plus"
                              onClick={() => handleResortClick(resort)}
                            >
                              {openedResorts.includes(resort.id) ? (
                                <IoIosArrowDropup
                                  color="var(--blue)"
                                  size={25}
                                />
                              ) : (
                                <IoIosArrowDropdown
                                  color="var(--blue)"
                                  size={25}
                                />
                              )}
                            </div>
                          )}
                      </div>
                      {openedResorts.includes(resort.id) && (
                        <div className="nested-resorts">
                          {regions.subregions.subregion
                            .filter(
                              (childResort) =>
                                childResort.parentregion === resort.id
                            )
                            .map((childResort) => (
                              <div
                                key={childResort.id}
                                className="star_box left"
                                onClick={() => handleSelectResort(childResort)}
                              >
                                <input
                                  type="checkbox"
                                  checked={resortModal.resort.includes(
                                    childResort.id
                                  )}
                                  onChange={() =>
                                    handleSelectResort(childResort)
                                  }
                                />
                                <p>{childResort.name}</p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
            </div>
            <button
              onClick={() =>
                setResortModal({ ...resortModal, closeDiv: false })
              }
              className={`btn_close_block_modal ${
                resortModal.resort.length > 0 ? "active" : ""
              }`}
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
      {currencyModal.closeDiv && (
        <Modal open={currencyModal} close={setCurrencyModal}>
          <div className="filter_block_modal">
            <h1>Выберите бюджет</h1>
            <div className="form">
              <label className="label_form">
                минимальный бюджет ({currencyModal.currency}){" "}
              </label>
              <input
                className="input_form"
                value={currencyModal.pricefrom}
                onChange={(e) =>
                  setCurrencyModal({
                    ...currencyModal,
                    pricefrom: e.target.value,
                  })
                }
                type="number"
              />
              <label className="label_form">
                максимальный бюджет ({currencyModal.currency}){" "}
              </label>
              <input
                className="input_form"
                value={currencyModal.priceto}
                onChange={(e) =>
                  setCurrencyModal({
                    ...currencyModal,
                    priceto: e.target.value,
                  })
                }
                type="number"
              />
            </div>
            <h2>ВАЛЮТА</h2>
            {currencyData.map((el) => (
              <div
                key={el.id}
                className="star_box"
                onClick={() => handleSelectCurrency(el)}
              >
                <input
                  type="checkbox"
                  checked={currencyModal.selected === el.id}
                  onChange={() => handleSelectCurrency(el)}
                />
                <h4>{el.currency}</h4>-<p>{el.name}</p>
              </div>
            ))}
            <button
              onClick={() =>
                setCurrencyModal({ ...currencyModal, closeDiv: false })
              }
              className="button_form m"
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
      {mealModal.closeDiv && (
        <Modal open={mealModal} close={setMealModal}>
          <div className="filter_block_modal">
            <h1>
              <PiCoffee color="var(--blue)" size={20} />
              Выберите тип питания
            </h1>
            <div className="all_star">
              <div
                onClick={() =>
                  setSelectedMeal(null) ||
                  setMealModal({
                    ...mealModal,
                    meal: [],
                    mealread: "",
                    closeDiv: false,
                  })
                }
                className="star_box"
              >
                <input
                  type="checkbox"
                  checked={!selectedMeal}
                  onChange={() => setSelectedMeal(!selectedMeal)}
                />
                <p>Любое</p>
              </div>
              {dataFilter.meals.meal.map((el) => (
                <div
                  key={el.id}
                  className="star_box"
                  onClick={() => handleSelectMeal(el)}
                >
                  <input
                    type="checkbox"
                    checked={selectedMeal === el.id}
                    onChange={() => handleSelectMeal(el)}
                  />
                  <p>{el.russianfull}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
      {userModal && (
        <Modal close={setUserModal}>
          <div className="user_tour">
            <h1 className="head">Туристы</h1>
            <div className="user_box_tour">
              <div>
                <h1>Взрослые</h1>
                <p>Старше 12 лет</p>
              </div>
              <div className="btns">
                <button
                  onClick={() =>
                    count.count1 > 1
                      ? setCount({ ...count, count1: count.count1 - 1 })
                      : ""
                  }
                  className="minus"
                >
                  -
                </button>
                <h1>{count.count1}</h1>
                <button
                  onClick={() =>
                    count.count1 < 8
                      ? setCount({ ...count, count1: count.count1 + 1 })
                      : ""
                  }
                  className="plus"
                >
                  +
                </button>
              </div>
            </div>
            {/* <div className="user_box_tour">
              <div>
                <h1>Кол-во детей</h1>
                <p>От 2 до 12 лет</p>
              </div>
              <div className="btns">
                <button
                  onClick={() =>
                    count.count2 > 0
                      ? setCount({ ...count, count2: count.count2 - 1 })
                      : ""
                  }
                  className="minus"
                >
                  -
                </button>
                <h1>{count.count2}</h1>
                <button
                  onClick={() =>
                    count.count2 < 6
                      ? setCount({ ...count, count2: count.count2 + 1 })
                      : ""
                  }
                  className="plus"
                >
                  +
                </button>
              </div>{" "}
            </div> */}
            <div className="user_box_tour">
              <div>
                <h1>Возраст первого ребенка</h1>
                <p>До 2 лет, без места</p>
              </div>
              <div className="btns">
                <button
                  onClick={() =>
                    count.count3 > 0
                      ? setCount({ ...count, count3: count.count3 - 1 })
                      : ""
                  }
                  className="minus"
                >
                  -
                </button>
                <h1>{count.count3}</h1>
                <button
                  onClick={() =>
                    count.count3 < 15
                      ? setCount({ ...count, count3: count.count3 + 1 })
                      : ""
                  }
                  className="plus"
                >
                  +
                </button>
              </div>
            </div>
            <div className="user_box_tour">
              <div>
                <h1>Возраст второго ребенка</h1>
                <p>До 2 лет, без места</p>
              </div>
              <div className="btns">
                <button
                  onClick={() =>
                    count.count4 > 0
                      ? setCount({ ...count, count4: count.count4 - 1 })
                      : ""
                  }
                  className="minus"
                >
                  -
                </button>
                <h1>{count.count4}</h1>
                <button
                  onClick={() =>
                    count.count4 < 15
                      ? setCount({ ...count, count4: count.count4 + 1 })
                      : ""
                  }
                  className="plus"
                >
                  +
                </button>
              </div>
            </div>
            <div className="user_box_tour">
              <div>
                <h1>Возраст третьего ребенка</h1>
                <p>До 2 лет, без места</p>
              </div>
              <div className="btns">
                <button
                  onClick={() =>
                    count.count5 > 0
                      ? setCount({ ...count, count5: count.count5 - 1 })
                      : ""
                  }
                  className="minus"
                >
                  -
                </button>
                <h1>{count.count5}</h1>
                <button
                  onClick={() =>
                    count.count5 < 15
                      ? setCount({ ...count, count5: count.count5 + 1 })
                      : ""
                  }
                  className="plus"
                >
                  +
                </button>
              </div>
            </div>
            {/* <div>
            <div
              onClick={() =>
                setType({
                  ...type,
                  econom: true,
                  comfort: false,
                  bisnes: false,
                  class: false,
                })
              }
              className={type.econom ? "type_box active" : "type_box"}
            >
              <h1> Эконом </h1>
            </div>
            <div
              onClick={() =>
                setType({
                  ...type,
                  econom: false,
                  comfort: true,
                  bisnes: false,
                  class: false,
                })
              }
              className={type.comfort ? "type_box active" : "type_box"}
            >
              <h1> Комфорт </h1>
            </div>
            <div
              onClick={() =>
                setType({
                  ...type,
                  econom: false,
                  comfort: false,
                  bisnes: true,
                  class: false,
                })
              }
              className={type.bisnes ? "type_box active" : "type_box"}
            >
              <h1> Бизнес </h1>
            </div>
            <div
              onClick={() =>
                setType({
                  ...type,
                  econom: false,
                  comfort: false,
                  bisnes: false,
                  class: true,
                })
              }
              className={type.class ? "type_box active" : "type_box"}
            >
              <h1> Первый класс </h1>
            </div>
            </div> */}
            {/* {price_child !== 0 ? (
                <div className="child_data">
                  <p className="child">За каждого младенца 80$</p>{" "}
                  <p className="child_price">
                    {price_child}$<span>Итог</span>
                  </p>
                </div>
              ) : (
                ""
              )} */}
            <button
              style={{ marginTop: 20 }}
              onClick={() => setUserModal(false)}
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
            <h1>
              Даты вылета
              <p style={{ fontSize: 18, fontWeight: 500 }}>
                {formatDateWithoutYear(dateNightFrom)}
                {` - ${formatDateWithoutYear(dateNightTo)}`}
              </p>
            </h1>
            <Calendar
              dateNightFrom={dateNightFrom}
              setDateNightFrom={setDateNightFrom}
              setDateNightTo={setDateNightTo}
              dateData={dateData}
            />
            {/* <label>Дата вылета:</label> */}
            {/* <div className="date_modal">
                <input
                  className="input_form"
                  value={dateNightFrom}
                  onChange={handleDateNightFromChange}
                  type="date"
                />
                <input
                  className="input_form"
                  value={dateNightTo}
                  onChange={(e) => setDateNightTo(e.target.value)}
                  type="date"
                  min={dateNightFrom}
                  max={dateform}
                />
              </div>
              <div className="renge">
                <h1 className="budget_text"> Кол-во дней </h1>
                <div className="value">
                  <div className="values">{requests.budget[0]}</div>
                  <div className="values">{requests.budget[1]}</div>
                </div>
                <Slider
                  className="slider"
                  onChange={(newBudget) =>
                    setRequests({ ...requests, budget: newBudget })
                  }
                  value={requests.budget}
                  min={MIN}
                  max={MAX}
                />
              </div> */}
            <button
              onClick={() => setDateFilter(false)}
              className="button_form"
            >
              готово
            </button>
          </div>
        </Modal>
      )}
      {day && (
        <Modal close={setDay}>
          <div className="filter_block_modal range_slider">
            <div className="renge">
              <h1 className="budget_text c"> Количество ночей </h1>
              <NumberSelector
                requests={requests}
                setRequests={setRequests}
                first={requests.budget[0]}
                second={requests.budget[1]}
              />
              <div className="fex_day">
                <p>1 ночь </p>
                <p>28 ночей</p>
              </div>
              <Slider
                className="slider"
                onChange={(newBudget) =>
                  setRequests({ ...requests, budget: newBudget })
                }
                value={requests.budget}
                min={MIN}
                max={MAX}
              />
            </div>
            <button onClick={() => setDay(false)} className="button_form">
              готово
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Hotels;
