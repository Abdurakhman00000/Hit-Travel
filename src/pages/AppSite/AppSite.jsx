import React, { useEffect, useState } from "react";
import "./AppSite.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Main from "../Main/Main";
import NotFaundPage from "../NotFaundPage/NotFaundPage";
import CityAndCountry from "../CityAndCountry/CityAndCountry";
import Reis from "../Reis/Reis";
import DetailsTour from "../DetailsTour/DetailsTour";
import Decor from "../Decor/Decor";
import Profile from "../Profile/Profile";
import Favorites from "../Favorites/Favorites";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Activation from "../Activation/Activation";
import Recommendations from "../Recommendations/Recommendations";
import Hotels from "../Hotels/Hotels";
import Payment from "../../components/Payment/Payment";
import Contact from "../Contact/Contact";
import Forgot from "../Forgot/Forgot";
import Chat from "../Chat/Chat";
import axios from "axios";
import { url } from "../../Api";
import Bus from "../Bus/Bus";
import Faq from "../Faq/Faq";
import BusDetails from "../BusDetails/BusDetails";
import DetailMyTour from "../DetailMyTour/DetailMyTour";
import DecorHotel from "../DecorHotel/DecorHotel";
import AirTickets from "../AirTickets/AirTickets";
import DateilAir from "../DateilAir/DateilAir";
import TicketRequest from "../TicketRequest/TicketRequest";
import DetailMyHotel from "../DetailMyHotel/DetailMyHotel";
import PackegeTour from "../PackageTour/PackageTour";
import Insurance from "../Insurance/Insurance";
import PaymentSuccess from "../PaymentSuccess/PaymentSuccess";

const bishkek = {
  id: 912,
  name: "Бишкек",
};

const turkey = {
  id: 17,
  name: "Турция",
};

const MIN = 1;
const MAX = 28;

const AppSite = ({ local, Alert }) => {
  const [loader, setLoader] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [charter, setCharter] = useState(false);
  const [mealModal, setMealModal] = useState({
    mealread: "",
    meal: [],
    closeDiv: false,
  });
  const [currencyModal, setCurrencyModal] = useState({
    currency: "USD/EUR",
    closeDiv: false,
    pricefrom: "",
    priceto: "",
    selected: 1,
  });
  const [resortModal, setResortModal] = useState({
    resortvalue: "",
    resortread: "",
    resirtchildrenread: "",
    resort: [],
    closeDiv: false,
  });
  const [operatorModal, setOperatorModal] = useState({
    operatorread: "",
    operator: [],
    closeDiv: false,
  });
  const [typeHotelModal, setTypeHotelModal] = useState({
    typehotelread: "",
    typehotel: [],
    closeDiv: false,
  });
  const [hotelModal, setHotelModal] = useState({
    hotelvalue: "",
    hotelread: "",
    hotel: [],
    closeDiv: false,
  });
  const [rateHotelModal, setRateHotelModal] = useState({
    ratehotelread: "",
    selected: 0,
    ratecount: 0,
    closeDiv: false,
  });
  const [servicesHotelModal, setServicesHotelModal] = useState({
    serviceshotelread: "",
    serviceshotel: [],
    closeDiv: false,
  });
  const [modal, setModal] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [count, setCount] = useState({
    count1: 2,
    count2: 0,
    count3: 0,
    count4: 0,
    count5: 0,
  });
  const [requests, setRequests] = useState({
    budget: [MIN, MAX],
  });
  const [dateNightFrom, setDateNightFrom] = useState(getTodayDate());
  const [dateNightTo, setDateNightTo] = useState(getTodayDate());
  const [value, setValue] = useState("");
  const [depor, setDepor] = useState(bishkek);
  const [country, setCountry] = useState([]);
  const [countryData, setCountryData] = useState(turkey);
  const [selectedStars, setSelectedStars] = useState("1");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [hotel, setHotel] = useState([]);
  const [regions, setRegions] = useState([]);
  const [resortsWithChildren, setResortsWithChildren] = useState([]);
  const [openedResorts, setOpenedResorts] = useState([]);
  const [dateform, setDateForm] = useState("");
  const [countBaby, setCountBaby] = useState(0);
  const [date, setDate] = useState([]);

  useEffect(() => {
    apiRegionsRequest(countryData.id);
  }, []);

  useEffect(() => {
    if (depor) {
      axios
        .get(url + `/api/country/${depor.id} `)
        .then((response) => {
          setCountry(response.data.lists.countries.country);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [depor.id]);

  useEffect(() => {
    const one = count.count3 > 0 ? 1 : 0;
    const two = count.count4 > 0 ? 1 : 0;
    const three = count.count5 > 0 ? 1 : 0;
    const oneBaby = count.count3 > 0 ? (count.count3 > 2 ? 0 : 1) : 0;
    const twoBaby = count.count4 > 0 ? (count.count4 > 2 ? 0 : 1) : 0;
    const threeBaby = count.count5 > 0 ? (count.count5 > 2 ? 0 : 1) : 0;
    const data = one + two + three;
    const dataBaby = oneBaby + twoBaby + threeBaby;
    setCount({
      ...count,
      count2: data,
    });
    setCountBaby(dataBaby);
  }, [count.count3, count.count4, count.count5]);

  useEffect(() => {
    setRequests({ ...requests, budget: [6, 14] });
  }, []);

  useEffect(() => {
    apiCountryRequest(countryData.id);
  }, [
    resortModal.resortread,
    selectedStars,
    rateHotelModal.ratecount,
    typeHotelModal.typehotelread,
  ]);

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function apiCountryRequest(api) {
    const get = `type=hotel&hotcountry=${api}${
      resortModal.resort.length > 0
        ? `&&hotregion=${resortModal.resortread}`
        : ""
    }${selectedStars ? `&&hotstars=${selectedStars}` : ""}${
      rateHotelModal.ratecount ? `&&hotrating=${rateHotelModal.ratecount}` : ""
    }`;
    console.log('alert()')
    axios
      .get(url + `/api/hotels?${get}`)
      .then((response) => {
        setHotel(response.data.lists.hotels.hotel);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setHotelModal({ ...hotelModal, hotel: [], hotelread: "" });
  }

  useEffect(() => {
    setResortModal({
      ...resortModal,
      resortvalue: "",
      resortread: "",
      resirtchildrenread: "",
      resort: [],
    });
  }, [countryData.name, depor.name]);

  function apiRegionsRequest(api) {
    axios
      .get(url + `/api/regions/${api} `)
      .then((response) => {
        setRegions(response.data.lists);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleResortClick = (resort) => {
    if (openedResorts.includes(resort.id)) {
      setOpenedResorts(openedResorts.filter((id) => id !== resort.id));
    } else {
      setOpenedResorts([...openedResorts, resort.id]);
    }
  };

  function formatDateToYYYYMMDD(date) {
    const parts = date.split(".");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return date;
  }

  const handleDateNightFromChange = (e) => {
    const selectedDate = e.target.value;
    setDateNightFrom(selectedDate);

    const formattedDate = formatDateToYYYYMMDD(selectedDate);

    const maxDate = new Date(formattedDate);
    maxDate.setDate(maxDate.getDate() + 14);
    const maxDateStr = maxDate.toISOString().substr(0, 10);
    setDateForm(maxDateStr);
    setDateNightTo(maxDateStr);
  };

  const handleSelectMeal = (el) => {
    setSelectedMeal(el.id === selectedMeal ? el.id : el.id);
    setMealModal({
      ...mealModal,
      meal: el.id,
      mealread: el.russianfull,
      closeDiv: false,
    });
  };

  const handleSelectCurrency = (el) => {
    setCurrencyModal({
      ...currencyModal,
      meal: el.id,
      currency: el.currency,
      selected: el.id,
    });
  };

  const handleSelectResort = (el) => {
    setResortModal((prevModal) => {
      const updatedModal = { ...prevModal };
      const isSelected = updatedModal.resort.includes(el.id);

      const handleNestedResorts = (resorts, isSelected) => {
        resorts.forEach((resort) => {
          if (isSelected) {
            updatedModal.resort = updatedModal.resort.filter(
              (id) => id !== resort.id
            );
          } else {
            updatedModal.resort.push(resort.id);
          }
          const parentResort = regions.regions.region.find(
            (parent) => parent.id === resort.parentregion
          );

          if (parentResort) {
            const nestedResorts = regions.subregions.subregion || [];
            const childResorts = nestedResorts.filter(
              (childResort) => childResort.parentregion === parentResort.id
            );

            const areAnyNestedSelected = childResorts.some((nestedResort) =>
              updatedModal.resort.includes(nestedResort.id)
            );

            if (!areAnyNestedSelected) {
              updatedModal.resort = updatedModal.resort.filter(
                (id) => id !== parentResort.id
              );
            } else if (!isSelected) {
              if (!updatedModal.resort.includes(parentResort.id)) {
                updatedModal.resort.push(parentResort.id);
              }
            }
          }

          const nestedResorts = regions?.subregions?.subregion
            ? regions.subregions.subregion.filter(
                (childResort) => childResort.parentregion === resort.id
              )
            : [];
          if (nestedResorts.length > 0) {
            handleNestedResorts(nestedResorts, isSelected);
          }
        });
      };

      handleNestedResorts([el], isSelected);

      updatedModal.selected = isSelected ? null : el.id;

      updatedModal.resortread = updatedModal.resort
        .filter((id) => {
          const resort = regions.regions.region.find(
            (resort) => resort.id === id
          );
          return resort && !resort.parentregion;
        })
        .join(",");

      updatedModal.resirtchildrenread = updatedModal.resort
        .filter((id) => {
          const resort = regions?.subregions?.subregion
            ? regions.subregions.subregion.find((resort) => resort.id === id)
            : null;
          return resort && resort.parentregion;
        })
        .join(",");

      return updatedModal;
    });
  };

  const handleSelectOperator = (el) => {
    setOperatorModal((prevModal) => {
      const updatedModal = { ...prevModal };
      const isSelected = updatedModal.operator.includes(el.id);

      if (isSelected) {
        updatedModal.operator = updatedModal.operator.filter(
          (id) => id !== el.id
        );
      } else {
        updatedModal.operator.push(el.id);
      }

      updatedModal.selected = el.id === currencyModal.selected ? el.id : null;
      updatedModal.operatorread = updatedModal.operator.join(",");

      return updatedModal;
    });
  };

  const handleSelectTypeHotel = (el) => {
    setTypeHotelModal((prevModal) => {
      const updatedModal = { ...prevModal };
      const isSelected = updatedModal.typehotel.includes(el.code);

      if (isSelected) {
        updatedModal.typehotel = updatedModal.typehotel.filter(
          (code) => code !== el.code
        );
      } else {
        updatedModal.typehotel.push(el.code);
      }

      updatedModal.selected =
        el.code === currencyModal.selected ? el.code : null;
      updatedModal.typehotelread = updatedModal.typehotel.join(",");

      return updatedModal;
    });
  };

  const handleSelectHotel = (el) => {
    setHotelModal((prevModal) => {
      const updatedModal = { ...prevModal };
      const isSelected = updatedModal.hotel.includes(el.id);

      if (isSelected) {
        updatedModal.hotel = updatedModal.hotel.filter((id) => id !== el.id);
      } else {
        updatedModal.hotel.push(el.id);
      }

      updatedModal.selected = el.id === currencyModal.selected ? el.id : null;
      updatedModal.hotelread = updatedModal.hotel.join(",");

      return updatedModal;
    });
  };

  const handleSelectRateHotel = (el) => {
    setRateHotelModal({
      ...rateHotelModal,
      ratehotelread: `${el.rate} и более `,
      ratecount: el.ratecount,
      selected: el.id === rateHotelModal.selected ? el.id : el.id,
      closeDiv: false,
    });
  };

  const handleSelectServicesHotel = (el) => {
    setServicesHotelModal((prevModal) => {
      const updatedModal = { ...prevModal };
      const isSelected = updatedModal.serviceshotel.includes(el.id);

      if (isSelected) {
        updatedModal.serviceshotel = updatedModal.serviceshotel.filter(
          (id) => id !== el.id
        );
      } else {
        updatedModal.serviceshotel.push(el.id);
      }

      updatedModal.serviceshotelread = updatedModal.serviceshotel.join(",");

      return updatedModal;
    });
  };

  function Clear() {
    setRequests({ ...requests, budget: [6, 14] });
    setDepor(bishkek);
    setCountryData(turkey);
    setCount({
      ...count,
      count1: 2,
      count2: 0,
      count3: 0,
      count4: 0,
      count5: 0,
    });
    setSelectedStars("1");
    setSelectedMeal(null);
    setCharter(true);
    setMealModal({ ...mealModal, mealread: "", meal: [] });
    setCurrencyModal({
      ...currencyModal,
      currency: "USD/EUR",
      pricefrom: "",
      priceto: "",
      selected: 1,
    });
    setRateHotelModal({
      ...rateHotelModal,
      ratehotelread: "",
      selected: 0,
      ratecount: 0,
    });
    setResortModal({
      ...resortModal,
      resortvalue: "",
      resortread: "",
      resirtchildrenread: "",
      resort: [],
    });
    setOperatorModal({
      ...operatorModal,
      operatorread: "",
      operator: [],
    });
    setServicesHotelModal({
      ...servicesHotelModal,
      serviceshotelread: "",
      serviceshotel: [],
    });
    setHotelModal({
      ...hotelModal,
      hotelread: "",
      hotel: [],
    });
    setTypeHotelModal({
      ...typeHotelModal,
      typehotel: [],
      typehotelread: "",
    });
  }

  const DataDayFun = async () => {
    const countryUrl = `country=${countryData.id}`;
    const deporUrl = `&departure=${depor.id}`;

    const currentMonth = new Date().getMonth() + 1;

    const monthsArray = [];
    for (let i = currentMonth; i <= 12; i++) {
      monthsArray.push(i);
    }
    const monthsUrl = `&month=${monthsArray.join(",")}`;

    await axios
      .get(
        `https://tourvisor.ru/xml/getdates.php?${countryUrl}&currency=1${deporUrl}&regular=1${monthsUrl}&referrer=https://hit-travel.kg`
      )
      .then((response) => {
        setDate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    DataDayFun();
  }, [countryData.name, depor.name]);

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tourDiv, setTourDiv] = useState({
    tour: true,
    transition: true,
  });
  const [hotelDiv, setHotelDiv] = useState({
    hotel: false,
    transition: false,
  });
  const [hotDiv, setHotDiv] = useState({
    hot: false,
    transition: false,
  });
  const [avtorDiv, setAvtorDiv] = useState({
    avtor: false,
    transition: false,
  });
  const [insuranceDiv, setInsuranceDiv] = useState({
    insurance: false,
    transition: false,
  });

  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem("token");

    return token ? element : <Navigate to="/login" replace />;
  };

  return (
    <div className="app_site">
      <Routes>
        <Route path="forgot-password" element={<Forgot Alert={Alert} />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="ticket-request/:cancel"
          element={<PrivateRoute element={<TicketRequest Alert={Alert} />} />}
        />
        <Route path="air-tickets/:get" element={<AirTickets Alert={Alert} />} />
        <Route path="detail-air/:id" element={<DateilAir Alert={Alert} />} />
        <Route
          index
          element={
            <Main
              tourDiv={tourDiv}
              setTourDiv={setTourDiv}
              hotelDiv={hotelDiv}
              setHotelDiv={setHotelDiv}
              hotDiv={hotDiv}
              setHotDiv={setHotDiv}
              avtorDiv={avtorDiv}
              setAvtorDiv={setAvtorDiv}
              insuranceDiv={insuranceDiv}
              setInsuranceDiv={setInsuranceDiv}
              date={date}
              regions={regions}
              countBaby={countBaby}
              Alert={Alert}
              Clear={Clear}
              apiCountryRequest={apiCountryRequest}
              apiRegionsRequest={apiRegionsRequest}
              MIN={MIN}
              MAX={MAX}
              modal={modal}
              setModal={setModal}
              modalSearch={modalSearch}
              setModalSearch={setModalSearch}
              userModal={userModal}
              setUserModal={setUserModal}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              count={count}
              setCount={setCount}
              requests={requests}
              setRequests={setRequests}
              dateNightFrom={dateNightFrom}
              setDateNightFrom={setDateNightFrom}
              dateNightTo={dateNightTo}
              setDateNightTo={setDateNightTo}
              value={value}
              setValue={setValue}
              depor={depor}
              setDepor={setDepor}
              country={country}
              setCountry={setCountry}
              countryData={countryData}
              setCountryData={setCountryData}
              selectedStars={selectedStars}
              setSelectedStars={setSelectedStars}
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              hotel={hotel}
              setHotel={setHotel}
              resortsWithChildren={resortsWithChildren}
              setResortsWithChildren={setResortsWithChildren}
              openedResorts={openedResorts}
              setOpenedResorts={setOpenedResorts}
              dateform={dateform}
              setDateForm={setDateForm}
              filterModal={filterModal}
              setFilterModal={setFilterModal}
              charter={charter}
              setCharter={setCharter}
              setLoader={setLoader}
              mealModal={mealModal}
              setMealModal={setMealModal}
              currencyModal={currencyModal}
              setCurrencyModal={setCurrencyModal}
              resortModal={resortModal}
              setResortModal={setResortModal}
              operatorModal={operatorModal}
              setOperatorModal={setOperatorModal}
              typeHotelModal={typeHotelModal}
              setTypeHotelModal={setTypeHotelModal}
              hotelModal={hotelModal}
              setHotelModal={setHotelModal}
              rateHotelModal={rateHotelModal}
              setRateHotelModal={setRateHotelModal}
              servicesHotelModal={servicesHotelModal}
              setServicesHotelModal={setServicesHotelModal}
              handleResortClick={handleResortClick}
              formatDateToYYYYMMDD={formatDateToYYYYMMDD}
              handleDateNightFromChange={handleDateNightFromChange}
              handleSelectMeal={handleSelectMeal}
              handleSelectCurrency={handleSelectCurrency}
              handleSelectResort={handleSelectResort}
              handleSelectOperator={handleSelectOperator}
              handleSelectTypeHotel={handleSelectTypeHotel}
              handleSelectHotel={handleSelectHotel}
              handleSelectRateHotel={handleSelectRateHotel}
              handleSelectServicesHotel={handleSelectServicesHotel}
              rangeStart={rangeStart}
              setRangeStart={setRangeStart}
              rangeEnd={rangeEnd}
              setRangeEnd={setRangeEnd}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          }
        />
        <Route path="favorites" element={<Favorites Alert={Alert} />} />
        <Route path="bus" element={<Bus date={date} />} />
        <Route path="insurance" element={<Insurance Alert={Alert} />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<Register Alert={Alert} />} />
        <Route path="login" element={<Login Alert={Alert} />} />
        <Route path="activation" element={<Activation Alert={Alert} />} />
        <Route path="reis/:code/" element={<Reis />} />
        <Route path="reis/:slug/:code" element={<Reis />} />
        <Route
          path="city-and-country/:get/:name/:country/:hotelDetail"
          element={
            <CityAndCountry
              dateData={date}
              regions={regions}
              countBaby={countBaby}
              Alert={Alert}
              loader={loader}
              setLoader={setLoader}
              apiCountryRequest={apiCountryRequest}
              apiRegionsRequest={apiRegionsRequest}
              MIN={MIN}
              MAX={MAX}
              modal={modal}
              setModal={setModal}
              modalSearch={modalSearch}
              setModalSearch={setModalSearch}
              userModal={userModal}
              setUserModal={setUserModal}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              count={count}
              setCount={setCount}
              requests={requests}
              setRequests={setRequests}
              dateNightFrom={dateNightFrom}
              setDateNightFrom={setDateNightFrom}
              dateNightTo={dateNightTo}
              setDateNightTo={setDateNightTo}
              value={value}
              setValue={setValue}
              depor={depor}
              setDepor={setDepor}
              countryMain={country}
              setCountryMain={setCountry}
              countryData={countryData}
              setCountryData={setCountryData}
              selectedStars={selectedStars}
              setSelectedStars={setSelectedStars}
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              hotel={hotel}
              setHotel={setHotel}
              resortsWithChildren={resortsWithChildren}
              setResortsWithChildren={setResortsWithChildren}
              openedResorts={openedResorts}
              setOpenedResorts={setOpenedResorts}
              dateform={dateform}
              setDateForm={setDateForm}
              filterModal={filterModal}
              setFilterModal={setFilterModal}
              charter={charter}
              setCharter={setCharter}
              mealModal={mealModal}
              setMealModal={setMealModal}
              currencyModal={currencyModal}
              setCurrencyModal={setCurrencyModal}
              resortModal={resortModal}
              setResortModal={setResortModal}
              operatorModal={operatorModal}
              setOperatorModal={setOperatorModal}
              typeHotelModal={typeHotelModal}
              setTypeHotelModal={setTypeHotelModal}
              hotelModal={hotelModal}
              setHotelModal={setHotelModal}
              rateHotelModal={rateHotelModal}
              setRateHotelModal={setRateHotelModal}
              servicesHotelModal={servicesHotelModal}
              setServicesHotelModal={setServicesHotelModal}
              handleResortClick={handleResortClick}
              formatDateToYYYYMMDD={formatDateToYYYYMMDD}
              handleDateNightFromChange={handleDateNightFromChange}
              handleSelectMeal={handleSelectMeal}
              handleSelectCurrency={handleSelectCurrency}
              handleSelectResort={handleSelectResort}
              handleSelectOperator={handleSelectOperator}
              handleSelectTypeHotel={handleSelectTypeHotel}
              handleSelectHotel={handleSelectHotel}
              handleSelectRateHotel={handleSelectRateHotel}
              handleSelectServicesHotel={handleSelectServicesHotel}
              rangeStart={rangeStart}
              setRangeStart={setRangeStart}
              rangeEnd={rangeEnd}
              setRangeEnd={setRangeEnd}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              Clear={Clear}
            />
          }
        />
        <Route path="chat" element={<Chat />} />
        <Route path="faq" element={<Faq />} />
        <Route
          path="details-tour/:tour"
          element={<DetailsTour local={local} Alert={Alert} />}
        />{" "}
        <Route
          path="details-my-tour/:id"
          element={<DetailMyTour local={local} Alert={Alert} />}
        />
        <Route
          path="package-tour/:id"
          element={<PackegeTour local={local} Alert={Alert} />}
        />
        <Route
          path="details-my-hotel/:id"
          element={<DetailMyHotel local={local} Alert={Alert} />}
        />
        <Route
          path="details-tour/:tour/:list"
          element={<DetailsTour local={local} Alert={Alert} />}
        />
        <Route path="decor/:tourid/" element={<Decor Alert={Alert} />} />
        <Route path="decor/:busid/:buspage" element={<Decor Alert={Alert} />} />
        <Route
          path="decor-hotel/:code"
          element={
            <DecorHotel
              Alert={Alert}
              count={count}
              requests={requests}
              dateNightFrom={dateNightFrom}
              dateNightTo={dateNightTo}
            />
          }
        />
        <Route path="payment" element={<Payment Alert={Alert} />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/:m" element={<Payment Alert={Alert} />} />
        <Route
          path="hotels/:country"
          element={
            <Hotels
              dateData={date}
              regions={regions}
              countBaby={countBaby}
              Alert={Alert}
              loader={loader}
              setLoader={setLoader}
              apiCountryRequest={apiCountryRequest}
              apiRegionsRequest={apiRegionsRequest}
              MIN={MIN}
              MAX={MAX}
              modal={modal}
              setModal={setModal}
              modalSearch={modalSearch}
              setModalSearch={setModalSearch}
              userModal={userModal}
              setUserModal={setUserModal}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              count={count}
              setCount={setCount}
              requests={requests}
              setRequests={setRequests}
              dateNightFrom={dateNightFrom}
              setDateNightFrom={setDateNightFrom}
              dateNightTo={dateNightTo}
              setDateNightTo={setDateNightTo}
              value={value}
              setValue={setValue}
              depor={depor}
              setDepor={setDepor}
              countryMain={country}
              setCountryMain={setCountry}
              countryData={countryData}
              setCountryData={setCountryData}
              selectedStars={selectedStars}
              setSelectedStars={setSelectedStars}
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              hotel={hotel}
              setHotel={setHotel}
              resortsWithChildren={resortsWithChildren}
              setResortsWithChildren={setResortsWithChildren}
              openedResorts={openedResorts}
              setOpenedResorts={setOpenedResorts}
              dateform={dateform}
              setDateForm={setDateForm}
              filterModal={filterModal}
              setFilterModal={setFilterModal}
              charter={charter}
              setCharter={setCharter}
              mealModal={mealModal}
              setMealModal={setMealModal}
              currencyModal={currencyModal}
              setCurrencyModal={setCurrencyModal}
              resortModal={resortModal}
              setResortModal={setResortModal}
              operatorModal={operatorModal}
              setOperatorModal={setOperatorModal}
              typeHotelModal={typeHotelModal}
              setTypeHotelModal={setTypeHotelModal}
              hotelModal={hotelModal}
              setHotelModal={setHotelModal}
              rateHotelModal={rateHotelModal}
              setRateHotelModal={setRateHotelModal}
              servicesHotelModal={servicesHotelModal}
              setServicesHotelModal={setServicesHotelModal}
              handleResortClick={handleResortClick}
              formatDateToYYYYMMDD={formatDateToYYYYMMDD}
              handleDateNightFromChange={handleDateNightFromChange}
              handleSelectMeal={handleSelectMeal}
              handleSelectCurrency={handleSelectCurrency}
              handleSelectResort={handleSelectResort}
              handleSelectOperator={handleSelectOperator}
              handleSelectTypeHotel={handleSelectTypeHotel}
              handleSelectHotel={handleSelectHotel}
              handleSelectRateHotel={handleSelectRateHotel}
              handleSelectServicesHotel={handleSelectServicesHotel}
            />
          }
        />
        <Route
          path="bus-detail/:buscode"
          element={<BusDetails local={local} Alert={Alert} />}
        />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="*" element={<NotFaundPage />} />
      </Routes>
    </div>
  );
};

export default AppSite;
