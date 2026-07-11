import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Slider from "react-slider";
import axios from "axios";

import { url } from "../../Api";

import "./MainNav.css";
import Storis from "../Storis/Storis";
import Modal from "../UI/Modal/Modal";
import Loader from "../UI/Loader/Loader";
import NumberSelector from "../UI/Day/Day";
import locationICon from "../../img/location.svg";
import hotelImage from "../../img/hotel-svgrepo-com.svg";
import Calendar from "../UI/DatePicker/DatePicker";
import { formatDate } from "../utils/FormatDate";
import {
  formatDateWithMonthName,
  formatDateWithoutYear,
} from "../utils/FormatDateWithoutYear";

import { FaCheck } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { PiCoffee } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { GoLocation } from "react-icons/go";
import { BsChatSquareDots } from "react-icons/bs";
import { MdArrowForwardIos } from "react-icons/md";
import {
  IconAirTickets,
  IconAuthorTours,
  IconHotels,
  IconInsurance,
  IconTourSearch,
  NavTabItem,
} from "./NavTabIcons";
import { AiOutlineCloseCircle, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import Air from "../Air/Air";
import InsuranceTab from "../Insurance/InsuranceTab";
import { debounce } from "lodash";
import Users from "../UI/Users/Users";

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

const MainNav = ({
  date,
  regions,
  countBaby,
  Alert,
  Clear,
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
  country,
  setCountry,
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
  setLoader,
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
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  selectedDay,
  setSelectedDay,
  tourDiv,
  setTourDiv,
  hotelDiv,
  setHotelDiv,
  hotDiv,
  setHotDiv,
  avtorDiv,
  setAvtorDiv,
  insuranceDiv,
  setInsuranceDiv,
}) => {
  const navigate = useNavigate();
  const { dataFilter } = useSelector((state) => state.filter);
  const [tourHot, setTourHot] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateState, setDateState] = useState({
    one: false,
    two: false,
    three: false,
  });

  useEffect(() => {
    if (dataFilter && dataFilter.regions && dataFilter.regions.region) {
      const data =
        regions &&
        regions.regions &&
        regions.regions.region &&
        regions.regions.region
          ? regions.regions.region
          : dataFilter.regions.region;
      const resortsWithChildren = data.filter((resort) => {
        return dataFilter.regions.region.some(
          (child) => child.parentid === resort.id,
        );
      });
      setResortsWithChildren(resortsWithChildren);
    }
  }, [dataFilter, regions]);

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
    if (country) {
      return country.filter((obj) => {
        const fullName = obj.name.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });
    }
  }, [country, value]);

  function funcDepor(bec) {
    setDepor(bec);
  }

  function funcCountry(bec) {
    setCountryData(bec);
    apiCountryRequest(bec.id);
    apiRegionsRequest(bec.id);
  }

  function Redirect({ hotel }) {
    if (countryData.name !== "Выберите страну") {
      const deporUrl = `departure=${depor.id}`;
      const countryUrl = countryData.id ? `&&country=${countryData.id}` : "";
      const datefromUrl =
        dateNightFrom > new Date().toISOString().split("T")[0]
          ? `&&datefrom=${formatDate(dateNightFrom)}`
          : "";
      const datetoUrl =
        dateNightTo > new Date().toISOString().split("T")[0]
          ? `&&dateto=${formatDate(dateNightTo)}`
          : "";
      const nightsfromUrl = requests.budget[0]
        ? `&&nightsfrom=${requests.budget[0]}`
        : "";
      const nightstoUrl = requests.budget[1]
        ? requests.budget[1] !== requests.budget[0]
          ? `&&nightsto=${requests.budget[1]}`
          : ""
        : "";
      const adultsUrl = `&&adults=${count.count1}`;
      const childUrl = count.count2 > 0 ? `&&child=${count.count2}` : "";
      const childage1Url =
        count.count3 > 0 ? `&&childage1=${count.count3}` : "";
      const childage2Url =
        count.count4 > 0 ? `&&childage2=${count.count4}` : "";
      const childage3Url =
        count.count5 > 0 ? `&&childage3=${count.count5}` : "";
      const starsUrl = `&&stars=${selectedStars}`;
      const mealUrl = mealModal.meal && `&&meal=${mealModal.meal}`;
      const currencyUrl = `&&currency=${currencyModal.selected}`;
      const pricefromUrl = currencyModal.pricefrom
        ? `&&pricefrom=${currencyModal.pricefrom}`
        : "&&pricefrom=0";
      const pricetoUrl = currencyModal.priceto
        ? `&&priceto=${currencyModal.priceto}`
        : "&&priceto=999999999";
      const ratingUrl = rateHotelModal.ratecount
        ? `&&rating=${rateHotelModal.ratecount}`
        : "";
      const servicesUrl =
        servicesHotelModal.serviceshotel.length > 0
          ? `&&services=${servicesHotelModal.serviceshotelread}`
          : "";
      const operatorsUrl =
        operatorModal.operator.length > 0
          ? `&&operators=${operatorModal.operatorread}`
          : "";
      const regionsUrl =
        resortModal.resort.length > 0
          ? `&&regions=${resortModal.resortread}`
          : "";
      const subregionsUrl =
        resortModal.resirtchildrenread.length > 0
          ? `&&subregions=${resortModal.resirtchildrenread}`
          : "";
      const directOnlyUrl = `&&directOnly=${charter}`;
      const hotelsUrl =
        hotelModal.hotel.length > 0 ? `&&hotels=${hotelModal.hotelread}` : "";
      const hoteltypesUrl =
        typeHotelModal.typehotel.length > 0
          ? `&&hoteltypes=${typeHotelModal.typehotelread}`
          : "";
      const hoteldepor = hotel ? deporUrl : deporUrl;
      const hotelDetail = hotel ? "hotel" : "not";
      const get =
        hoteldepor +
        countryUrl +
        datefromUrl +
        datetoUrl +
        nightsfromUrl +
        nightstoUrl +
        adultsUrl +
        childUrl +
        childage1Url +
        childage2Url +
        childage3Url +
        starsUrl +
        mealUrl +
        currencyUrl +
        pricefromUrl +
        pricetoUrl +
        ratingUrl +
        servicesUrl +
        regionsUrl +
        operatorsUrl +
        subregionsUrl +
        directOnlyUrl +
        hotelsUrl +
        hoteltypesUrl;
      setLoader(true);
      if (depor.id) {
        navigate(
          `/city-and-country/${get}/${depor.name}/${countryData.name}/${hotelDetail}`,
        );
      }
      setFilterModal(false);
    } else {
      Alert("Выберите направление", "error");
    }
  }

  function clickDiv(el) {
    const closePanel = (prev, openKey) => ({
      ...prev,
      [openKey]: false,
      transition: prev[openKey] ? true : prev.transition,
    });

    switch (el) {
      case "hotel":
        setTourDiv((prev) => closePanel(prev, "tour"));
        setHotelDiv({ hotel: true, transition: true });
        setHotDiv((prev) => closePanel(prev, "hot"));
        setAvtorDiv((prev) => closePanel(prev, "avtor"));
        setInsuranceDiv((prev) => closePanel(prev, "insurance"));
        break;
      case "hot":
        setTourDiv((prev) => closePanel(prev, "tour"));
        setHotelDiv((prev) => closePanel(prev, "hotel"));
        setHotDiv({ hot: true, transition: true });
        setAvtorDiv((prev) => closePanel(prev, "avtor"));
        setInsuranceDiv((prev) => closePanel(prev, "insurance"));
        break;
      case "avtor":
        setTourDiv((prev) => closePanel(prev, "tour"));
        setHotelDiv((prev) => closePanel(prev, "hotel"));
        setHotDiv((prev) => closePanel(prev, "hot"));
        setAvtorDiv({ avtor: true, transition: true });
        setInsuranceDiv((prev) => closePanel(prev, "insurance"));
        break;
      case "insurance":
        setTourDiv((prev) => closePanel(prev, "tour"));
        setHotelDiv((prev) => closePanel(prev, "hotel"));
        setHotDiv((prev) => closePanel(prev, "hot"));
        setAvtorDiv((prev) => closePanel(prev, "avtor"));
        setInsuranceDiv({ insurance: true, transition: true });
        break;
      default:
        setTourDiv({ tour: true, transition: true });
        setHotelDiv((prev) => closePanel(prev, "hotel"));
        setHotDiv((prev) => closePanel(prev, "hot"));
        setAvtorDiv((prev) => closePanel(prev, "avtor"));
        setInsuranceDiv((prev) => closePanel(prev, "insurance"));
        break;
    }
  }

  function divEnd(el) {
    switch (el) {
      case "hotel":
        setTimeout(() => {
          setHotelDiv((prevState) => ({ ...prevState, transition: prevState.hotel }));
        }, 800);
        break;
      case "hot":
        setTimeout(() => {
          setHotDiv((prevState) => ({ ...prevState, transition: prevState.hot }));
        }, 800);
        break;
      case "avtor":
        setTimeout(() => {
          setAvtorDiv((prevState) => ({ ...prevState, transition: prevState.avtor }));
        }, 800);
        break;
      case "insurance":
        setTimeout(() => {
          setInsuranceDiv((prevState) => ({ ...prevState, transition: prevState.insurance }));
        }, 800);
        break;
      default:
        setTimeout(() => {
          setTourDiv((prevState) => ({ ...prevState, transition: prevState.tour }));
        }, 800);
        break;
    }
  }

  useEffect(() => {
    if (!hotDiv.hot) {
      divEnd("hot");
    }
  }, [hotDiv.hot]);

  useEffect(() => {
    if (!hotelDiv.hotel) {
      divEnd("hotel");
    }
  }, [hotelDiv.hotel]);

  useEffect(() => {
    if (!avtorDiv.avtor) {
      divEnd("avtor");
    }
  }, [avtorDiv.avtor]);

  useEffect(() => {
    if (!insuranceDiv.insurance) {
      divEnd("insurance");
    }
  }, [insuranceDiv.insurance]);

  useEffect(() => {
    if (!tourDiv.tour) {
      divEnd("tour");
    }
  }, [tourDiv.tour]);

  const guarantee = {
    group: "Доп.фильтры",
    id: 46,
    name: "Мгновенное подтверждение",
  };

  useEffect(() => {
    axios
      .get(url + "/api/hottours")
      .then((response) => {
        const tours = response.data?.hottours?.tour
          || response.data?.TheBest_ALL?.PACKETS
          || [];
        setTourHot(tours);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setTourHot([]);
        setLoading(false);
      });
  }, []);

  const price_child =
    countBaby == 1
      ? 80
      : countBaby == 2
        ? 160
        : countBaby == 3
          ? 240
          : countBaby == 4
            ? 320
            : 0;

  const isWhatsAppAvailable = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return hour >= 9 && hour < 21;
    } else if (dayOfWeek === 6) {
      return hour >= 10 && hour < 18;
    } else {
      return false;
    }
  };

  const handleSliderChange = debounce((newBudget) => {
    setRequests({ ...requests, budget: newBudget });
  }, 1);

  useEffect(() => {
    const savedSearchParams = JSON.parse(localStorage.getItem("searchParams_v2"));

    if (savedSearchParams) {
      const savedDepor = savedSearchParams.depor || {};
      const VALID_DEPARTURE_IDS = [912, 2116, 9, 12, 103, 105, 106, 107, 109, 112, 113, 115, 136, 17, 15, 16, 26, 180, 538, 1411, 911, 919, 941];
      setDepor(savedDepor.id && VALID_DEPARTURE_IDS.includes(Number(savedDepor.id)) ? savedDepor : { id: 912, name: "Бишкек" });
      setCountryData(savedSearchParams.countryData || {});
      setResortModal(savedSearchParams.resortModal || { resort: [] });
      setHotelModal(savedSearchParams.hotelModal || { hotel: [] });
      setDateNightFrom(savedSearchParams.dateNightFrom || "");
      setDateNightTo(savedSearchParams.dateNightTo || "");
      setRequests(savedSearchParams.requests || { budget: [0, 0] });
      setCount(savedSearchParams.count || { count: 0 });
      setCharter(savedSearchParams.charter || false);
      setSelectedStars(savedSearchParams.selectedStars || 0);
      setMealModal(savedSearchParams.mealModal || { mealread: "Любое" });
    }
  }, []);

  useEffect(() => {
    const searchParams = {
      depor,
      countryData,
      resortModal,
      hotelModal,
      dateNightFrom,
      dateNightTo,
      requests,
      count,
      charter,
      selectedStars,
      mealModal,
    };
    localStorage.setItem("searchParams_v2", JSON.stringify(searchParams));
  }, [
    depor,
    countryData,
    resortModal,
    hotelModal,
    dateNightFrom,
    dateNightTo,
    requests,
    count,
    charter,
    selectedStars,
    mealModal,
  ]);

  return (
    <div className="nav">
      <div className="nav_top_card">
        <Storis />
        <div className="container">
          <div className="nav_box">
            <NavTabItem
              active={tourDiv.tour}
              onClick={() => clickDiv("tour")}
              icon={IconTourSearch}
              label="Поиск туров"
              shortLabel="Поиск|туров"
            />
            <NavTabItem
              active={avtorDiv.avtor}
              onClick={() => clickDiv("avtor")}
              icon={IconAirTickets}
              label="Авиабилеты"
              shortLabel="Авиа|билеты"
            />
            <NavTabItem
              active={hotelDiv.hotel}
              onClick={() => clickDiv("hotel")}
              icon={IconHotels}
              label="Отели"
              shortLabel="Отели"
            />
            <NavTabItem
              active={false}
              onClick={() => navigate("/bus")}
              icon={IconAuthorTours}
              label="Авторские туры"
              shortLabel="Авторские|туры"
            />
            <NavTabItem
              active={insuranceDiv.insurance}
              onClick={() => clickDiv("insurance")}
              icon={IconInsurance}
              label="Страхование"
              shortLabel="Страховка"
            />
          </div>
        </div>
      </div>
      {hotDiv.transition && (
        <div className={hotDiv.hot ? "htkz" : " htkz closed"}>
          <div className="compilation">
            <div className="containers">
              <div className="tour">
                <h1>Подборка горящих туров</h1>
                {loading ? (
                  <div className="loading_div">
                    <Loader />
                  </div>
                ) : tourHot.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
                    <p style={{ fontSize: "16px" }}>Горящих туров пока нет</p>
                    <p style={{ fontSize: "13px", marginTop: "8px" }}>Следите за обновлениями — новые предложения появятся скоро</p>
                  </div>
                ) : (
                  <div className="map_boxs">
                    {tourHot.map((el, id) => (
                      <div
                        onClick={() => navigate(`/details-tour/${el.tourid}`)}
                        key={id}
                        className="compilation_box"
                      >
                        {el.hotelpicture ? (
                          <div>
                            <img src={"https:" + el.hotelpicture} alt="" />
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="tour-info-wrap">
                          <h1>{el.countryname}</h1>
                          <div className="like">
                            <p>
                              От <span className="old">{el.priceold}</span>{" "}
                              {el.price} {el.currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {hotelDiv.transition && (
        <div className={hotelDiv.hotel ? "htkz" : " htkz closed"}>
          {isWhatsAppAvailable() ? (
            <a href="https://wa.me/+996700636676" target="blank">
              <div className="chat_div">
                <FaWhatsapp size={24} />
                Чат с поддержкой
              </div>
            </a>
          ) : (
            ""
          )}
          <div className="container">
            <div className="search_block">
              <div>
                <p>Страна, курорт, отель</p>
                <h1 onClick={() => setModal(!modal)}>
                  {" "}
                  {countryData.name ? countryData.name : ""}{" "}
                  {resortModal.resort.length == 0
                    ? ""
                    : resortModal.resort.length == 1
                      ? `, ${resortModal.resort.length} регион`
                      : `, ${resortModal.resort.length} региона`}
                  {hotelModal.hotel.length == 0
                    ? ""
                    : hotelModal.hotel.length == 1
                      ? `, ${hotelModal.hotel.length} отель`
                      : `, ${hotelModal.hotel.length} отеля`}
                </h1>
              </div>
            </div>
            <div className="filt_new">
              <div className="filt_grid">
                <div
                  onClick={() =>
                    setDateFilter(!dateFilter) ||
                    setDateState({
                      ...dateState,
                      one: true,
                      two: false,
                      three: true,
                    })
                  }
                  className="filt_box"
                >
                  <p>Дата заезда</p>
                  <h1> {formatDateWithMonthName(dateNightFrom)}</h1>
                </div>
                <div
                  onClick={() =>
                    setDateFilter(true) ||
                    setDateState({
                      ...dateState,
                      one: true,
                      two: false,
                      three: true,
                    })
                  }
                  className="filt_box prew"
                >
                  <p>Дата отъезда</p>
                  <h1>{formatDateWithMonthName(dateNightTo)}</h1>
                </div>
              </div>
              <div
                onClick={() => setUserModal(!userModal)}
                className="filt_save"
              >
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
                      className={`star ${starIndex < selectedStars ? "active" : ""}`}
                      key={starIndex}
                      onClick={() => setSelectedStars(starIndex + 1)}
                    >
                      <FaStar className="icon" size={15} />
                    </span>
                  ))}
                </div>
                <div
                  onClick={() => setMealModal({ ...mealModal, closeDiv: true })}
                  className="filt_box prew"
                >
                  <p>Питание</p>
                  <div className="flex">
                    <h1>
                      {" "}
                      {mealModal.mealread ? mealModal.mealread : "Любое"}
                    </h1>
                  </div>
                </div>
                {/* <div onClick={() => setFilterModal(!filterModal)} className="filt_box">
                  <div className="box">
                    <BiCategoryAlt className="icon_btn" size={18} />
                    Фильтры
                  </div>
                </div> */}
              </div>
              {/* <div className="filt_grid">
                <div
                  onClick={() =>
                    setHotelModal({ ...hotelModal, closeDiv: true })
                  }
                  className="filt_box prew"
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
                  onClick={() =>
                    setResortModal({ ...resortModal, closeDiv: true })
                  }
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
              </div> */}
            </div>
            <button
              onClick={() => Redirect({ hotel: true })}
              className="button_form"
            >
              Найти отели
            </button>
          </div>
        </div>
      )}
      {tourDiv.transition && (
        <div className={tourDiv.tour ? "htkz htkz_form" : " htkz closed htkz_form"}>
          {isWhatsAppAvailable() ? (
            <a
              href="https://wa.me/+996700636676?text=Здравствуйте!%0A%0AПишу из приложения Hit Travel%0A%0A"
              target="blank"
            >
              <div className="chat_div">
                <FaWhatsapp size={24} />
                Чат с поддержкой
              </div>
            </a>
          ) : (
            ""
          )}
          <div className="container">
            <div className="search_block">
              <div>
                <p>Город вылета</p>
                <h1 onClick={() => setModalSearch(true)}> {depor.name} </h1>
                <div className="br"></div>
                <p>Страна, курорт, отель</p>
                <h1 onClick={() => setModal(!modal)}>
                  {" "}
                  {countryData.name ? countryData.name : ""}{" "}
                  {resortModal.resort.length == 0
                    ? ""
                    : resortModal.resort.length == 1
                      ? `, ${resortModal.resort.length} регион`
                      : `, ${resortModal.resort.length} региона`}
                  {hotelModal.hotel.length == 0
                    ? ""
                    : hotelModal.hotel.length == 1
                      ? `, ${hotelModal.hotel.length} отель`
                      : `, ${hotelModal.hotel.length} отеля`}
                </h1>
              </div>
              <div className="image">
                <img src={locationICon} alt="" />
              </div>
            </div>
            <div className="filt_new">
              <div className="filt_grid">
                <div
                  onClick={() =>
                    setDateFilter(true) ||
                    setDateState({
                      ...dateState,
                      one: true,
                      two: false,
                      three: false,
                    })
                  }
                  className="filt_box"
                >
                  <p>Дата вылета</p>
                  <h1>
                    {" "}
                    {formatDateWithoutYear(dateNightFrom)} -{" "}
                    {formatDateWithoutYear(dateNightTo)}{" "}
                  </h1>
                </div>
                <div
                  onClick={() =>
                    setDateFilter(true) ||
                    setDateState({
                      ...dateState,
                      one: false,
                      two: true,
                      three: false,
                    })
                  }
                  className="filt_box prew"
                >
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
              <div className="filt_grid">
                <div
                  onClick={() => setUserModal(!userModal)}
                  className="filt_box"
                >
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
                <div
                  onClick={() => setCharter(!charter)}
                  className="filt_box prew"
                >
                  <p>Только чартер</p>
                  <div style={{ display: "flex", gap: 5 }}>
                    <input
                      type="checkbox"
                      checked={charter}
                      onChange={(e) =>
                        setCharter(e.target.value) || setCharter(!charter)
                      }
                    />
                    <h1>{charter ? "Включено" : "Выключено"}</h1>
                  </div>
                </div>
              </div>
              <div className="filt_grid">
                <div className="filt_box">
                  <p>Класс отеля</p>
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <span
                      className={`star ${starIndex < selectedStars ? "active" : ""}`}
                      key={starIndex}
                      onClick={() => setSelectedStars(starIndex + 1)}
                    >
                      <FaStar className="icon" size={15} />
                    </span>
                  ))}
                </div>
                <div
                  onClick={() => setMealModal({ ...mealModal, closeDiv: true })}
                  className="filt_box prew"
                >
                  <p>Питание</p>
                  <div className="flex">
                    <h1>
                      {" "}
                      {mealModal.mealread ? mealModal.mealread : "Любое"}
                    </h1>
                  </div>
                </div>
              </div>
              {/* <div className="filt_grid">
                <div
                  onClick={() =>
                    setHotelModal({ ...hotelModal, closeDiv: true })
                  }
                  className="filt_box prew"
                >
                  <p>Отель</p>
                  <h1>
                    {hotelModal.hotel.length > 0 ? (
                      `Выбрано (${hotelModal.hotel.length})`
                    ) : "Любое"}
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
                  onClick={() =>
                    setResortModal({ ...resortModal, closeDiv: true })
                  }
                  className="filt_box"
                >
                  <p>Курорт</p>
                  <h1>
                    {resortModal.resort.length > 0 ? (
                      `Выбрано (${resortModal.resort.length})`
                    ) : "Любое"}
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
              </div> */}
            </div>
            <button onClick={Redirect} className="button_form">
              Найти туры
            </button>
          </div>
        </div>
      )}
      {avtorDiv.transition && <Air Alert={Alert} ht={avtorDiv.avtor} />}
      {insuranceDiv.transition && (
        <InsuranceTab Alert={Alert} ht={insuranceDiv.insurance} />
      )}
      {country
        ? modal && (
            <Modal close={setModal}>
              <div className="relative">
                <IoSearch color="var(--blue)" className="icon" size={20} />
                <input
                  className="input_form"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="text"
                  placeholder="Страна"
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
                      {/* <GoLocation className="icon dark" size={20} /> */}
                      <img
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          marginRight: 10,
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        src={el?.img}
                        alt=""
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>{el.name}</p>
                      {el.name === countryData.name && (
                        <FaCheck size={24} color="#25d366" />
                      )}
                      {/* <span>
                      {el.directfly == 0
                        ? "Не прямой перелёт"
                        : "Прямой перелёт"}
                    </span> */}
                    </div>
                  </div>
                ))}
                {/* {charter == true && filteredDatasCountryRegular.length == 0 && (
                <p className="regular">
                  Стран с прямым перелетом из выбранного города не найдено.
                  Попробуйте включить регулярные рейсы, сняв галочку.
                </p>
              )} */}
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
                      setValue("") ||
                      setCountryData({ id: 45689, name: "Выберите страну" })
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
                          className={`star ${starIndex < selectedStars ? "active" : ""}`}
                          key={starIndex}
                          onClick={() => setSelectedStars(starIndex + 1)}
                        >
                          <FaStar className="icon" size={15} />
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
              </div> */}
                {/* <div
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
                <div className="buttons_send">
                  <button onClick={Clear} className="clear_btn">
                    Сброс фильтров
                  </button>
                  <button onClick={Redirect} className="send_btn">
                    Найти
                  </button>
                </div>
              </div>
            </div>
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
                className={`star_box ${rateHotelModal.selected === el.id ? "selected" : ""}`}
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
        <Modal open={hotelModal} close={setHotelModal}>
          <div className="filter_block_modal">
            <div className="relative">
              <IoSearch color="var(--blue)" className="icon" size={20} />
              <input
                className="input_form"
                value={hotelModal.hotelvalue}
                onChange={(e) =>
                  setHotelModal({ ...hotelModal, hotelvalue: e.target.value })
                }
                type="text"
                placeholder="Отель"
              />
            </div>
            <div className="map_mest_travel">
              {hotel.length > 0 ? (
                hotel
                  .filter((obj) => {
                    const fullName = obj.name.toLowerCase();
                    return fullName.includes(
                      hotelModal.hotelvalue.toLowerCase(),
                    );
                  })
                  .slice(0, 100)
                  .map((el) => (
                    <div
                      key={el.id}
                      className="star_box"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "25px  minmax(0, 1fr) 15px",
                        gap: 15,
                      }}
                      onClick={() => handleSelectHotel(el)}
                    >
                      <img
                        style={{ width: 25, height: 25 }}
                        src={hotelImage}
                        alt=""
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", gap: 3 }}>
                          {Array.from({ length: el.stars }, (_, starIndex) => (
                            <span style={{ color: "gold" }} key={starIndex}>
                              <FaStar size={12} />
                            </span>
                          ))}
                        </div>
                        <p
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {el.name}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={hotelModal.hotel.includes(el.id)}
                        onChange={() => handleSelectHotel(el)}
                        onClick={() => handleSelectHotel(el)}
                      />
                    </div>
                  ))
              ) : (
                <p>В этой стране отелей нет</p>
              )}
            </div>
            <button
              onClick={() => setHotelModal({ ...hotelModal, closeDiv: false })}
              className="btn_close_block_modal"
            >
              Готово
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
            <div className="relative">
              <IoSearch color="var(--blue)" className="icon" size={20} />
              <input
                className="input_form"
                type="text"
                placeholder="Курорт"
                value={resortModal.resortvalue}
                onChange={(e) =>
                  setResortModal({
                    ...resortModal,
                    resortvalue: e.target.value,
                  })
                }
              />
            </div>
            <div className="map_mest_travel">
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
                          onClick={() => {
                            handleSelectResort(resort);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={resortModal.resort.includes(resort.id)}
                            onChange={() => handleSelectResort(resort)}
                            onClick={() => {
                              handleSelectResort(resort);
                            }}
                          />
                          <p>{resort.name}</p>
                        </div>
                        {regions &&
                          regions.subregions &&
                          regions.subregions.subregion &&
                          regions.subregions.subregion.some(
                            (childResort) =>
                              childResort.parentregion === resort.id,
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
                                childResort.parentregion === resort.id,
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
                                    childResort.id,
                                  )}
                                  onChange={() =>
                                    handleSelectResort(childResort)
                                  }
                                  onClick={() =>
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
              onClick={() => {
                setResortModal({ ...resortModal, closeDiv: false });
                setHotelModal({ ...hotelModal, closeDiv: true });
              }}
              className={`btn_close_block_modal ${resortModal.resort.length > 0 ? "active" : ""}`}
            >
              Готово
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
          <Users
            count={count}
            setCount={setCount}
            price_child={price_child}
            setUserModal={setUserModal}
          />
          {/* <div className="user_tour">
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
            {price_child !== 0 ? (
              <div className="child_data">
                <p className="child">За каждого младенца 80$</p>{" "}
                <p className="child_price">
                  {price_child}$<span>Итог</span>
                </p>
              </div>
            ) : (
              ""
            )}
            <button
              style={{ marginTop: price_child !== 0 ? 0 : 20 }}
              onClick={() => setUserModal(false)}
              className="button_form"
            >
              готово
            </button>
          </div> */}
        </Modal>
      )}
      {dateFilter && (
        <Modal close={setDateFilter}>
          <div className="filter_block_modal">
            {dateState.three ? (
              <div
                style={{
                  gridTemplateColumns: "1fr",
                }}
                className="div_btn_filter_menu"
              >
                <div
                  onClick={() =>
                    setDateState({ ...dateState, one: true, two: false })
                  }
                  className={`div_btn_filter ${dateState.one ? "active" : ""}`}
                >
                  <h3>Дата заезда - дата отъезда</h3>
                  <p style={{ fontSize: 18, fontWeight: 500 }}>
                    {formatDateWithoutYear(dateNightFrom)}
                    {` - ${formatDateWithoutYear(dateNightTo)}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="div_btn_filter_menu">
                <div
                  onClick={() =>
                    setDateState({ ...dateState, one: true, two: false })
                  }
                  className={`div_btn_filter ${dateState.one ? "active" : ""}`}
                >
                  <h3>Даты вылета</h3>
                  <p style={{ fontSize: 18, fontWeight: 500 }}>
                    {formatDateWithoutYear(dateNightFrom)}
                    {` - ${formatDateWithoutYear(dateNightTo)}`}
                  </p>
                </div>
                <div
                  onClick={() =>
                    setDateState({ ...dateState, one: false, two: true })
                  }
                  className={`div_btn_filter ${dateState.two ? "active" : ""}`}
                >
                  <h3>На сколько</h3>
                  <p style={{ fontSize: 18, fontWeight: 500 }}>
                    {" "}
                    {requests.budget[0]}{" "}
                    {requests.budget[1] !== requests.budget[0] &&
                      `- ${requests.budget[1]}`}{" "}
                    ночей{" "}
                  </p>
                </div>
              </div>
            )}

            {dateState.one && (
              <>
                <Calendar
                  rangeStart={rangeStart}
                  setRangeStart={setRangeStart}
                  rangeEnd={rangeEnd}
                  setRangeEnd={setRangeEnd}
                  dateNightFrom={dateNightFrom}
                  setDateNightFrom={setDateNightFrom}
                  setDateNightTo={setDateNightTo}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  dateData={date}
                  Alert={Alert}
                />
              </>
            )}
            {dateState.two && (
              <>
                <div className="filter_block_modal range_slider">
                  <div style={{ marginTop: 30 }} className="renge">
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
                      onChange={handleSliderChange}
                      value={requests.budget}
                      min={MIN}
                      max={MAX}
                    />
                  </div>
                </div>
              </>
            )}
            {/* <DateRangePicker
              date={date}
              dateNightFrom={dateNightFrom}
              dateNightTo={dateNightTo}
              setDateNightFrom={setDateNightFrom}
              setDateNightTo={setDateNightTo}
            /> */}
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
            </div> */}
            <button
              onClick={() =>
                setDateFilter(false) ||
                setDateState({ ...dateState, one: false, two: false })
              }
              className={`btn_close_block_modal active`}
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MainNav;
