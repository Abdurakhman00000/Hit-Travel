import React, { useEffect } from "react";
import "./Main.css";
import MainNav from "../../components/MainNav/MainNav";
import Сompilation from "../../components/Сompilation/Сompilation";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchActionNot } from "../../store/actions/searchAction";

const Main = ({
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
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(searchActionNot());
  }, []);

  return (
    <div className="main">
      <MainNav
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
        setLoader={setLoader}
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
        tourDiv={tourDiv}
        setTourDiv={setTourDiv}
        hotelDiv={hotelDiv}
        setHotelDiv={setHotelDiv}
        hotDiv={hotDiv}
        setHotDiv={setHotDiv}
        avtorDiv={avtorDiv}
        setAvtorDiv={setAvtorDiv}
      />
      {/* <Сompilation /> */}
    </div>
  );
};

export default Main;
