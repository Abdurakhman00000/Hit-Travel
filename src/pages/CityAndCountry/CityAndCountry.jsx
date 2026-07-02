import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './CityAndCountry.css'
import Slider from 'react-slider'
import Header from '../../components/Header/Header'
import Modal from '../../components/UI/Modal/Modal'
import NumberSelector from '../../components/UI/Day/Day'
import { formatDate } from '../../components/utils/FormatDate'
import Calendar from '../../components/UI/DatePicker/DatePicker'
import { formatDateWithoutYear } from '../../components/utils/FormatDateWithoutYear'

import { searchAction, searchActionNot } from '../../store/actions/searchAction'
import hotelImage from '../../img/hotel-svgrepo-com.svg'

import { FaStar } from 'react-icons/fa'
import { GoLocation } from 'react-icons/go'
import { PiCoffee } from 'react-icons/pi'
import { BiSearchAlt2 } from 'react-icons/bi'
import { IoFilterOutline, IoSearch } from 'react-icons/io5'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io'
import { GiAirplaneDeparture, GiRollingSuitcase } from 'react-icons/gi'
import axios from 'axios'
import { url } from '../../Api'
import Loading from '../../components/UI/Loading/Loading'
import { PriceData, PriceDataNot } from '../../store/actions/priceAction'
import Users from '../../components/UI/Users/Users'
import Preloader from '../../components/UI/Plan/Plan'

const rateHotelData = [
  {
    id: 0,
    rate: 'любое',
    ratecount: 0,
  },
  {
    id: 1,
    rate: '3.0',
    ratecount: 2,
  },
  {
    id: 2,
    rate: '3.5',
    ratecount: 3,
  },
  {
    id: 3,
    rate: '4.0',
    ratecount: 4,
  },
  {
    id: 4,
    rate: '4.5',
    ratecount: 5,
  },
]

const currencyData = [
  {
    id: 1,
    currency: 'USD/EUR',
    name: 'Валюта',
  },
  {
    id: 99,
    currency: 'KGS',
    name: 'Кыргызский сом',
  },
]

const hotelData = [
  {
    id: 1,
    code: 'active',
    name: 'активный',
  },
  {
    id: 2,
    code: 'relax',
    name: 'расслабляться',
  },
  {
    id: 3,
    code: 'family',
    name: 'семья',
  },
  {
    id: 4,
    code: 'health',
    name: 'здоровье',
  },
  {
    id: 5,
    code: 'city',
    name: 'город',
  },
  {
    id: 6,
    code: 'beach',
    name: 'пляж',
  },
  {
    id: 7,
    code: 'deluxe',
    name: 'делюкс',
  },
]

const CityAndCountry = ({
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
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  selectedDay,
  setSelectedDay,
  Clear,
}) => {
  const [getten, setGetten] = useState('')
  const { get, name, country, hotelDetail } = useParams()
  const navigate = useNavigate()
  const messages = true
  const dispatch = useDispatch()
  const { search } = useSelector((state) => state.search)
  const { dataFilter } = useSelector((state) => state.filter)
  const [valueHotels, setValueHotels] = useState('')
  const [startP, setStartP] = useState(false)
  const [countdown, setCountdown] = useState({
    seconds: 10,
  })
  const [dateState, setDateState] = useState({
    one: false,
    two: false,
  })
  const [data, setData] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (search?.result?.hotel) {
      setData(search?.result?.hotel)
    }
  }, [search])

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown((prevCountdown) => {
        const newSeconds = prevCountdown.seconds - 1

        if (newSeconds < 0) {
          clearInterval(countdownInterval)
          return { seconds: 0 }
        }

        return { seconds: newSeconds }
      })
    }

    const countdownInterval = setInterval(updateCountdown, 1000)

    return () => clearInterval(countdownInterval)
  }, [])

  useEffect(() => {
    if (dataFilter && dataFilter.regions && dataFilter.regions.region) {
      const data = regions.regions.region ? regions.regions.region : dataFilter.regions.region
      const resortsWithChildren = data.filter((resort) => {
        return dataFilter.regions.region.some((child) => child.parentid === resort.id)
      })

      setResortsWithChildren(resortsWithChildren)
    }
  }, [dataFilter, regions])

  useEffect(() => {
    if (search && search.status && search.status.hotelsfound == 0) {
      Alert('По вашему запросу нечего не найдено', 'warning')
      navigate('/')
      dispatch(searchActionNot())
      Clear()
    }
  }, [search])

  useEffect(() => {
    if (get) {
      setGetten(get)
    }
  }, [get])

  useEffect(() => {
    if (loader == true) {
      dispatch(searchActionNot())
      setData(false)
      if (getten !== '') {
        dispatch(searchAction(getten))
        setLoader(false)
      }
    }
  }, [loader, getten])

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        setStartP(true)
      }, 20000)
    } else {
      setStartP(true)
    }
  }, [])

  const filteredDatas = useMemo(() => {
    if (dataFilter && dataFilter.departures && dataFilter.departures.departure) {
      return dataFilter.departures.departure.filter((obj) => {
        const fullName = obj.name.toLowerCase()
        return fullName.includes(value.toLowerCase())
      })
    }
  }, [dataFilter, value])

  const filteredDatasCountry = useMemo(() => {
    if (countryMain) {
      return countryMain.filter((obj) => {
        const fullName = obj.name.toLowerCase()
        return fullName.includes(value.toLowerCase())
      })
    }
  }, [countryMain, value])

  function funcDepor(bec) {
    setDepor(bec)
  }

  function funcCountry(bec) {
    setCountryData(bec)
    apiCountryRequest(bec.id)
    apiRegionsRequest(bec.id)
  }

  const [page, setPage] = useState(2)

  function Redirect(items) {
    const get = `departure=${depor.id}${countryData.id ? `&&country=${countryData.id}` : ''}${
      dateNightFrom > new Date().toISOString().split('T')[0]
        ? `&&datefrom=${formatDate(dateNightFrom)}`
        : ''
    }${
      dateNightTo > new Date().toISOString().split('T')[0]
        ? `&&dateto=${formatDate(dateNightTo)}`
        : ''
    }${requests.budget[0] ? `&&nightsfrom=${requests.budget[0]}` : ''}${
      requests.budget[1] ? `&&nightsto=${requests.budget[1]}` : ''
    }&&adults=${count.count1}${count.count2 > 0 ? `&&child=${count.count2}` : ''}${
      count.count3 > 0 ? `&&childage1=${count.count3}` : ''
    }${count.count4 > 0 ? `&&childage2=${count.count4}` : ''}${
      count.count5 > 0 ? `&&childage3=${count.count5}` : ''
    }&&stars=${selectedStars}${mealModal.meal == '' ? '' : `&&meal=${mealModal.meal}`}&&currency=${
      currencyModal.selected
    }${currencyModal.pricefrom ? `&&pricefrom=${currencyModal.pricefrom}` : '&&pricefrom=0'}${
      currencyModal.priceto ? `&&priceto=${currencyModal.priceto}` : '&&priceto=999999999'
    }${rateHotelModal.ratecount ? `&&rating=${rateHotelModal.ratecount}` : ''}${
      servicesHotelModal.serviceshotel.length > 0
        ? `&&services=${servicesHotelModal.serviceshotelread}`
        : ''
    }${operatorModal.operator.length > 0 ? `&&operators=${operatorModal.operatorread}` : ''}${
      resortModal.resort.length > 0 ? `&&regions=${resortModal.resortread}` : ''
    }${
      resortModal.resort.length > 0 ? `&&subregions=${resortModal.resirtchildrenread}` : ''
    }&&directOnly=${charter}${
      hotelModal.hotel.length > 0 ? `&&hotels=${hotelModal.hotelread}` : ''
    }${typeHotelModal.typehotel.length > 0 ? `&&hoteltypes=${typeHotelModal.typehotelread}` : ''}${
      items === true ? '&&page=' + page : ''
    }`

    if (items === true) {
      if (page) {
        setPage(page + 1)
      }
      setLoading(true)
      axios
        .get(url + '/api/search?' + get)
        .then((response) => {
          const newDatas = response.data?.result?.hotel
          if (newDatas) {
            const updatedData = data.concat(newDatas)
            setData(updatedData)
          } else {
            Alert('Данных больше нет.', 'warning')
            setMessage(true)
          }
          setLoading(false)
        })
        .catch((error) => {
          setMessage(true)
          setLoading(false)
        })
    } else {
      setPage(2)
      setLoader(true)
      setGetten(get)
      setFilterModal(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const guarantee = {
    group: 'Доп.фильтры',
    id: 46,
    name: 'Мгновенное подтверждение',
  }

  const hotelValueSearch = useMemo(() => {
    if (data) {
      return data?.filter((obj) => {
        const fullName = obj.hotelname.toLowerCase()
        return fullName.includes(valueHotels.toLowerCase())
      })
    }
  }, [data, valueHotels])


  const price_child =
    countBaby == 1 ? 80 : countBaby == 2 ? 160 : countBaby == 3 ? 240 : countBaby == 4 ? 320 : 0

  useEffect(() => {
    if (hotelDetail) {
      dispatch(PriceDataNot())
    }
  }, [hotelDetail])

  function PriceFunc(price) {
    if (price) {
      dispatch(PriceData(price))
    }
  }
  function getAdultWord(count) {
    return count === 1 ? 'взрослого' : 'взрослых';
  }
  
  function getChildWord(count) {
    return count === 1 ? 'ребенка' : 'детей';
  }
  

  return (
    <div className="city_and_country">
      <>
        <Header messages={messages}>
          <h1>{hotelDetail ? country : `${name} - ${country}`}</h1>
        </Header>
        <div className="body">
          {search.toursfound == 0 ? (
            ''
          ) : (
            <>
              <div className="input_box_country">
                <BiSearchAlt2 className="icon_search" color="var(--blue)" size={25} />
                <input
                  className="city_input"
                  value={valueHotels}
                  onChange={(e) => setValueHotels(e.target.value)}
                  type="text"
                  placeholder="Поиск отеля"
                />
              </div>
              <div className="container">
                <div
                  onClick={() => (startP === true ? setFilterModal(true) : '')}
                  className="filter"
                >
                  <div className="filter_btn">
                    <div
                      style={{
                        animation: startP ? '' : 'WidthP 20s ease',
                      }}
                      className="after"
                    ></div>
                    <div className="clickable">
                      {startP === true ? (
                        <>
                          <IoFilterOutline style={{ marginRight: 5 }} color="#fff" size={18} />{' '}
                          Фильтры
                        </>
                      ) : (
                        `Поиск... ${countdown.seconds} секунд`
                      )}
                    </div>
                  </div>
                </div>
                {data ? (
                  <>
                    {hotelValueSearch.map((el, id) => (
                      <div
                        key={id}
                        onClick={() => {
                          navigate(
                            `/reis${hotelDetail === 'hotel' ? '/hotel' : ''}/${el.hotelcode}`,
                          )
                          PriceFunc({ price: el.price, currency: el.currency })
                        }}
                        className="body_block"
                      >
                        <img className="img" src={el.picturelink} alt="" />
                        <div className="content_home">
                          <div className="content">
                            <div className="conntent_block_one">
                              <div className="conntent_block_two">
                                <div className="content_p">
                                  {Array.from({ length: el.hotelstars }, (_, starIndex) => (
                                    <span key={starIndex}>
                                      <FaStar className="icon" size={15} />
                                    </span>
                                  ))}
                                  <h1>{el.hotelname}</h1>
                                  <p>
                                    {el.countryname}
                                    {el.regionname && `, ${el.regionname}`}
                                  </p>
                                </div>
                                <div>
                                  <div className="rate">{el.hotelrating}</div>
                                  <div className="ratingIcon tripadvisor"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hr"></div>
                          <div className="price">
                            <p className="p">
                              Цена за <br />
                              {el.tours.tour[0].adults} {getAdultWord(el.tours.tour[0].adults)}
                              {el.tours.tour[0].child ? ` и ${el.tours.tour[0].child} ${getChildWord(
                                    el.tours.tour[0].child,
                                  )}`
                                : ''}
                            </p>

                            <div>
                              <h1>
                                {el.price} {el.currency}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading ? (
                      <div
                        style={{
                          marginTop: 20,
                          marginBottom: 160,
                          width: '100%',
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Loading color={'var(--blue)'} />
                      </div>
                    ) : message ? (
                      ''
                    ) : (
                      <div
                        onClick={() => Redirect(true)}
                        style={{
                          marginTop: 20,
                          marginBottom: 160,
                        }}
                        className="button_form"
                      >
                        Еще отелей
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="div_load">
                      <div className="div_block_load"></div>
                      <div className="div_block_load one"></div>
                      <div className="div_block_load two"></div>
                    </div>
                    <div className="div_load">
                      <div className="div_block_load"></div>
                      <div className="div_block_load one"></div>
                      <div className="div_block_load two"></div>
                    </div>
                    <div className="div_load">
                      <div className="div_block_load"></div>
                      <div className="div_block_load one"></div>
                      <div className="div_block_load two"></div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </>
      {dataFilter && dataFilter.meals && dataFilter.meals.meal
        ? filterModal && (
            <div className="filter_home_div">
              <div className="container">
                <div className="header_filter_box">
                  <h2 className="header_h2">Фильтры</h2>
                  <AiOutlineCloseCircle
                    onClick={() => setFilterModal(false)}
                    style={{ color: 'var(--blue)', cursor: 'pointer' }}
                    size={25}
                  />
                </div>
                <div className="search_block">
                  <div onClick={() => setModalSearch(true)} className="search_block_box">
                    <GiAirplaneDeparture color="var(--blue)" className="icon" size={25} />
                    <div>
                      <p> Город вылета</p>
                      <h1> {depor.name} </h1>
                    </div>
                  </div>
                  <div className="hr"></div>
                  <div onClick={() => setModal(!modal)} className="search_block_box">
                    <GiRollingSuitcase color="var(--blue)" className="icon" size={25} />
                    <div>
                      <p> Страна, курорт, отель</p>
                      <h1 onClick={() => setModal(!modal)}>
                        {' '}
                        {countryData.name ? countryData.name : ''}{' '}
                        {resortModal.resort.length == 0
                          ? ''
                          : resortModal.resort.length == 1
                          ? `, ${resortModal.resort.length} регион`
                          : `, ${resortModal.resort.length} региона`}
                        {hotelModal.hotel.length == 0
                          ? ''
                          : hotelModal.hotel.length == 1
                          ? `, ${hotelModal.hotel.length} отель`
                          : `, ${hotelModal.hotel.length} отеля`}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="filt_new">
                  <div className="filt_grid">
                    <div
                      onClick={() =>
                        setDateFilter(!dateFilter) ||
                        setDateState({ ...dateState, one: true, two: false })
                      }
                      className="filt_box"
                    >
                      <p>Дата вылета</p>
                      <h1>
                        {' '}
                        {formatDateWithoutYear(dateNightFrom)} -{' '}
                        {formatDateWithoutYear(dateNightTo)}{' '}
                      </h1>
                    </div>
                    <div
                      onClick={() =>
                        setDateFilter(!dateFilter) ||
                        setDateState({ ...dateState, one: false, two: true })
                      }
                      className="filt_box"
                    >
                      <p>На сколько</p>
                      <h1>
                        {' '}
                        {requests.budget[0]}{' '}
                        {requests.budget[1] !== requests.budget[0] && `- ${requests.budget[1]}`}{' '}
                        ночей{' '}
                      </h1>
                    </div>
                  </div>
                  <div onClick={() => setUserModal(!userModal)} className="filt_save">
                    <p>Кто летит</p>
                    <h1>
                      {count.count1
                        ? count.count1 === 1
                          ? `${count.count1} взрослый`
                          : `${count.count1} взрослых`
                        : ''}{' '}
                      {count.count2
                        ? count.count2 === 1
                          ? `, ${count.count2} ребенок`
                          : `, ${count.count2} детей`
                        : ''}{' '}
                    </h1>
                  </div>
                  <div className="filt_grid">
                    <div className="filt_box">
                      <p>Класс отеля</p>
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <span
                          className={`star ${starIndex < selectedStars ? 'active' : ''}`}
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
                        <h1> {mealModal.mealread ? mealModal.mealread : 'Любое'}</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={Redirect} className="button_form">
                  Найти
                </button>
              </div>
            </div>
          )
        : ''}
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
                  placeholder="Страна,курорт,отель"
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
                      <img
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          marginRight: 10,
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        src={el?.img}
                        alt=""
                      />
                    </div>
                    <div>
                      <p>{el.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
          )
        : ''}
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
                      setCountryData({ name: 'Не выбрано' }) ||
                      setValue('')
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
                        {el.national === 1
                          ? 'Россия'
                          : el.national === 2
                          ? 'Беларусия'
                          : el.national === 3
                          ? 'Казахстан'
                          : el.national === 99
                          ? 'Другие страны'
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Modal>
          )
        : ''}
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
                .filter((item) => item.group.includes('Для детей'))
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
                .filter((item) => item.group.includes('Номер'))
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
                .filter((item) => item.group.includes('Пляж'))
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
                .filter((item) => item.group.includes('Территория'))
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
                .filter((item) => item.group.includes('Услуги'))
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
                .filter((item) => item.group.includes('Тип отеля'))
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
                    }) || servicesHotelModal.serviceshotel.includes(guarantee.id)
                    ? handleSelectServicesHotel(guarantee)
                    : ''
                  : ''
              }
              className={`btn_close_block_modal ${
                servicesHotelModal.serviceshotel.length > 0 ? 'active' : ''
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
                className={`star_box ${rateHotelModal.selected === el.id ? 'selected' : ''}`}
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
                onChange={(e) => setHotelModal({ ...hotelModal, hotelvalue: e.target.value })}
                type="text"
                placeholder="Отель"
              />
            </div>
            <div className="map_mest_travel">
              {hotel.length > 0 ? (
                hotel
                  .filter((obj) => {
                    const fullName = obj.name.toLowerCase()
                    return fullName.includes(hotelModal.hotelvalue.toLowerCase())
                  })
                  .slice(0, 100)
                  .map((el) => (
                    <div
                      key={el.id}
                      className="star_box"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '25px  minmax(0, 1fr) 15px',
                        gap: 15,
                      }}
                      onClick={() => handleSelectHotel(el)}
                    >
                      <img style={{ width: 25, height: 25 }} src={hotelImage} alt="" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {Array.from({ length: el.stars }, (_, starIndex) => (
                            <span style={{ color: 'gold' }} key={starIndex}>
                              <FaStar size={12} />
                            </span>
                          ))}
                        </div>
                        <p
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
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
              <div key={id} className="star_box" onClick={() => handleSelectTypeHotel(el)}>
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
                  : ''
              }
              className={`btn_close_block_modal ${
                typeHotelModal.typehotel.length > 0 ? 'active' : ''
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
                <div key={el.id} className="star_box" onClick={() => handleSelectOperator(el)}>
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
                  : ''
              }
              className={`btn_close_block_modal ${
                operatorModal.operator.length > 0 ? 'active' : ''
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
                    return obj.name.includes(resortModal.resortvalue)
                  })
                  .map((resort) => (
                    <div key={resort.id}>
                      <div className="relative_resort">
                        <div
                          key={resort.id}
                          className="star_box"
                          onClick={() => {
                            handleSelectResort(resort)
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={resortModal.resort.includes(resort.id)}
                            onChange={() => handleSelectResort(resort)}
                            onClick={() => {
                              handleSelectResort(resort)
                            }}
                          />
                          <p>{resort.name}</p>
                        </div>
                        {regions &&
                          regions.subregions &&
                          regions.subregions.subregion &&
                          regions.subregions.subregion.some(
                            (childResort) => childResort.parentregion === resort.id,
                          ) && (
                            <div className="plus" onClick={() => handleResortClick(resort)}>
                              {openedResorts.includes(resort.id) ? (
                                <IoIosArrowDropup color="var(--blue)" size={25} />
                              ) : (
                                <IoIosArrowDropdown color="var(--blue)" size={25} />
                              )}
                            </div>
                          )}
                      </div>
                      {openedResorts.includes(resort.id) && (
                        <div className="nested-resorts">
                          {regions.subregions.subregion
                            .filter((childResort) => childResort.parentregion === resort.id)
                            .map((childResort) => (
                              <div
                                key={childResort.id}
                                className="star_box left"
                                onClick={() => handleSelectResort(childResort)}
                              >
                                <input
                                  type="checkbox"
                                  checked={resortModal.resort.includes(childResort.id)}
                                  onChange={() => handleSelectResort(childResort)}
                                  onClick={() => handleSelectResort(childResort)}
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
                setResortModal({ ...resortModal, closeDiv: false })
                setHotelModal({ ...hotelModal, closeDiv: true })
              }}
              className={`btn_close_block_modal ${resortModal.resort.length > 0 ? 'active' : ''}`}
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
              <label className="label_form">минимальный бюджет ({currencyModal.currency}) </label>
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
              <label className="label_form">максимальный бюджет ({currencyModal.currency}) </label>
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
              <div key={el.id} className="star_box" onClick={() => handleSelectCurrency(el)}>
                <input
                  type="checkbox"
                  checked={currencyModal.selected === el.id}
                  onChange={() => handleSelectCurrency(el)}
                />
                <h4>{el.currency}</h4>-<p>{el.name}</p>
              </div>
            ))}
            <button
              onClick={() => setCurrencyModal({ ...currencyModal, closeDiv: false })}
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
                    mealread: '',
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
                <div key={el.id} className="star_box" onClick={() => handleSelectMeal(el)}>
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
        </Modal>
      )}
      {dateFilter && (
        <Modal close={setDateFilter}>
          <div className="filter_block_modal">
            <div className="div_btn_filter_menu">
              <div
                onClick={() => setDateState({ ...dateState, one: true, two: false })}
                className={`div_btn_filter ${dateState.one ? 'active' : ''}`}
              >
                <h3>Даты вылета</h3>
                <p style={{ fontSize: 18, fontWeight: 500 }}>
                  {formatDateWithoutYear(dateNightFrom)}
                  {` - ${formatDateWithoutYear(dateNightTo)}`}
                </p>
              </div>
              <div
                onClick={() => setDateState({ ...dateState, one: false, two: true })}
                className={`div_btn_filter ${dateState.two ? 'active' : ''}`}
              >
                <h3>На сколько</h3>
                <p style={{ fontSize: 18, fontWeight: 500 }}>
                  {' '}
                  {requests.budget[0]}{' '}
                  {requests.budget[1] !== requests.budget[0] && `- ${requests.budget[1]}`} ночей{' '}
                </p>
              </div>
            </div>
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
                  dateData={dateData}
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
                      onChange={(newBudget) => setRequests({ ...requests, budget: newBudget })}
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
                setDateFilter(false) || setDateState({ ...dateState, one: false, two: false })
              }
              className={`btn_close_block_modal active`}
            >
              Выбрать
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CityAndCountry
