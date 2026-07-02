import React, { useEffect, useState } from 'react'
import './Air.css'
import locationICon from '../../img/ic_Exchange.svg'
import { useNavigate } from 'react-router-dom'
import { formatDateWithoutYear } from '../utils/FormatDateWithoutYear'
import Modal from '../UI/Modal/Modal'
import { useDispatch } from 'react-redux'
import { IoSearch } from 'react-icons/io5'
import DateComponent from '../UI/DatePicker/Date'
import { IoAirplaneSharp } from 'react-icons/io5'
import { countAction } from '../../store/actions/count'
import { airParamsAction } from '../../store/actions/airParamsAction'
import Loading from '../UI/Loading/Loading'
import { FaCheck } from 'react-icons/fa'
import { aviaDateAction, aviaStartAction } from '../../store/actions/aviaDateAction'
import axios from 'axios'
import calendarIcon from '../../img/ic_calendar (1).svg'

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const bishkek = {
  id: 80,
  name: 'Бишкек',
  code_name: 'FRU',
}

const mow = {
  id: 4,
  name: 'Москва',
  code_name: 'MOW',
}

const Air = ({ Alert, ht }) => {
  const navigate = useNavigate()
  const [dateFilter, setDateFilter] = useState(false)
  const [dateNightFrom, setDateNightFrom] = useState(getTodayDate())
  const [dateNightTo, setDateNightTo] = useState(getTodayDate())
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [value, setValue] = useState('')
  const [modalFrom, setModalFrom] = useState(false)
  const [modalTo, setModalTo] = useState(false)
  const [from, setFrom] = useState(bishkek)
  const [to, setTo] = useState(mow)
  const [classes, setClasses] = useState([
    {
      code: 'a',
      value: 'Все классы',
    },
    {
      code: 'e',
      value: 'Эконом',
    },
    {
      code: 'b',
      value: 'Бизнес',
    },
    {
      code: 'f',
      value: 'Первый класс',
    },
    {
      code: 'w',
      value: 'Комфорт',
    },
  ])
  const [classesValue, setClassesValue] = useState({
    code: 'e',
    value: 'Эконом',
  })
  const [modalClasses, setModalClasses] = useState(false)
  const [userModal, setUserModal] = useState(false)
  const [persons, setPersons] = useState([
    { type: 'adt', quantity: 1 },
    { type: 'chd', quantity: 0 },
    { type: 'inf', quantity: 0 },
  ])
  const dispatch = useDispatch()
  const [searchData, setSearchData] = useState([])
  const [loading_param, serLoading_param] = useState(false)
  const [changeCountry, setChangeCountry] = useState(false)
  const [changeCountry1, setChangeCountry1] = useState(false)

  const queryString = persons.map((person) => `${person.type}=${person.quantity}`).join('&')

  const totalUsers = persons.reduce((total, person) => total + person.quantity, 0)

  const changeCountryClick = () => {
    setChangeCountry(!changeCountry)
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const updateUserQuantity = (type, value) => {
    setPersons((prevPersons) =>
      prevPersons.map((person) => {
        if (person.type === type) {
          return { ...person, quantity: value }
        }
        return person
      }),
    )
  }

  useEffect(() => {
    dispatch(countAction(persons))
  }, [persons, dispatch])

  // const filteredDatasCountry = useMemo(() => {
  //   if (searchData.cities) {
  //     return searchData.cities.filter((obj) => {
  //       const cityName = obj.cityName.toLowerCase();
  //       const countryName = obj.countryName.toLowerCase();
  //       const searchValue = value.toLowerCase();

  //       return (
  //         cityName.includes(searchValue) || countryName.includes(searchValue)
  //       );
  //     });
  //   }
  // }, [searchData, value]);

  // console.log(
  //   filteredDatasCountry && filteredDatasCountry.map((el) => el.airports)
  // );

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    return `${day}.${month}.${year}`
  }

  function Redirect() {
    dispatch(aviaDateAction(dateNightFrom))
    dispatch(aviaStartAction(rangeStart))
    if (from.code_name !== to.code_name) {
      if (to.code_name) {
        if (dateNightTo === '') {
          const get = `${queryString}&class=${classesValue.code}&segments[0][from]=${from.code_name}&segments[0][to]=${to.code_name}`
          navigate(`/air-tickets/${get}`)
        } else {
          const get = `${queryString}&class=${classesValue.code}&segments[0][from]=${
            from.code_name
          }&segments[0][to]=${to.code_name}&segments[1][from]=${to.code_name}&segments[1][to]=${
            from.code_name
          }&segments[0][date]=${formatDate(dateNightFrom)}&segments[1][date]=${formatDate(
            dateNightTo,
          )}`
          navigate(`/air-tickets/${get}`)
        }
      } else {
        Alert('Выберите направление', 'error')
      }
    } else {
      Alert('Города не могут быть похожими', 'error')
    }
  }

  useEffect(() => {
    if (from?.code_name && !changeCountry) {
      // setTo({ name: "Выберите направление" });
      dispatch(airParamsAction(from.code_name))
    }
  }, [from])

  useEffect(() => {
    const getSearch = async () => {
      serLoading_param(true)
      try {
        const response = await axios(`https://hit-travel.org/avia/params/v2/${value}`)
        setSearchData(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        serLoading_param(false)
      }
    }
    getSearch()
  }, [value])

  useEffect(() => {
    if (modalFrom) {
      dispatch(airParamsAction(''))
    }
  }, [modalFrom])

  return (
    <div className="air">
      <div className={ht ? 'htkz' : ' htkz closed'}>
        <div className="container">
          <div className="search_block">
            <div>
              <p>Откуда</p>
              <h1 onClick={() => setModalFrom(true)}>{from?.name}</h1>
              <div className="br"></div>
              <p>Куда</p>
              <h1 onClick={() => setModalTo(true)}>{to?.name}</h1>
            </div>
            <div className="imageIcon" onClick={changeCountryClick}>
              {/* <img src={locationICon} alt="" /> */}
              <img src={locationICon} alt="" />
            </div>
          </div>
          <div className="filt_new">
            <div className="filt_grid">
              <div onClick={() => setDateFilter(true)} className="filt_box">
                {/* <p>Туда {dateNightTo !== "" && "- Обратно"}</p>
                <h1>
                  {formatDateWithoutYear(dateNightFrom)}
                  {dateNightTo === ""
                    ? ""
                    : `- ${formatDateWithoutYear(dateNightTo)}`}
                </h1> */}
                <p>Дата вылета</p>
                <div className="flexCalendar">
                  {' '}
                  <div className="whenCalendar">
                    <img src={calendarIcon} alt="" />
                    <div>
                      <h1 style={{ marginBottom: '5px' }}>Когда</h1>
                      {formatDateWithoutYear(dateNightFrom)}
                    </div>
                  </div>
                  <div className="whenCalendar">
                    <img src={calendarIcon} alt="" />
                    <div>
                      <h1 style={{ marginBottom: '5px' }}> Обратно</h1>
                      {formatDateWithoutYear(dateNightTo)}{' '}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div
                onClick={() => setModalClasses(true)}
                className="filt_box prew"
                style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
              >
                <p>Класс</p>
                <h1>{classesValue.value}</h1>
              </div> */}
            </div>
            <div className="filt_one">
              <div onClick={() => setUserModal(true)} className="filt_box">
                <p>Кто летит</p>
                <h1>
                  {totalUsers}{' '}
                  {totalUsers === 1 ? 'пассажир' : totalUsers < 5 ? 'пассажира' : 'пассажиров'}
                </h1>
              </div>
                   <div
                onClick={() => setModalClasses(true)}
                className="filt_box prew"
                // style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
              >
                <p>Класс</p>
                <h1>{classesValue.value}</h1>
              </div>
            </div>
          </div>
          <button onClick={Redirect} className="button_form">
            Найти билеты
          </button>
        </div>
      </div>
      {dateFilter && (
        <Modal close={setDateFilter}>
          <div className="filter_block_modal">
            <div className="div_btn_filter_menu">
              <div className="div_btn_filter active">
                <h3>Туда</h3>
                <p style={{ fontSize: 18, fontWeight: 500 }}>
                  {formatDateWithoutYear(dateNightFrom)}
                </p>
              </div>
              <div className="div_btn_filter active">
                <h3>Обратно</h3>
                <p style={{ fontSize: 18, fontWeight: 500 }}>
                  {dateNightTo === '' ? '- -' : formatDateWithoutYear(dateNightTo)}
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
            <button onClick={() => setDateFilter(false)} className={`btn_close_block_modal active`}>
              Выбрать
            </button>
          </div>
        </Modal>
      )}
      {modalFrom && (
        <Modal close={setModalFrom}>
          <div className="relative">
            <IoSearch color="var(--blue)" className="icon" size={20} />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder="Поиск"
            />
          </div>
          {loading_param ? (
            <div className="loading_div">
              <Loading />
            </div>
          ) : (
            <div className="map_mest_travel">
              <div className="map_mest_travel">
                {searchData?.cities &&
                  searchData.cities.map((el, index) => (
                    <div key={index} className="air_block">
                      <div
                        onClick={() =>
                          setFrom({
                            ...from,
                            name: el.cityName,
                            code_name: el.cityIataCode,
                          }) ||
                          setModalFrom(false) ||
                          setValue('')
                        }
                        key={el.id}
                        className="mest cursor"
                      >
                        {/* <div className="icons">
                        {el?.img ? (
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
                        ) : (
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              marginRight: 10,
                              objectFit: "cover",
                              objectPosition: "center",
                              background: "#ccc",
                            }}
                          ></div>
                        )}
                      </div> */}
                        <div>
                          <p>{el.countryName}</p>
                        </div>
                      </div>
                      <div className="air_top">
                        <div
                          onClick={() =>
                            setFrom({
                              ...from,
                              name: el.cityName,
                              code_name: el.cityIataCode,
                            }) ||
                            setModalFrom(false) ||
                            setValue('')
                          }
                          className="air_cities"
                        >
                          <div className="air_between">
                            <p className="name">{el.cityName}</p>
                            <p className="code">{el.cityIataCode}</p>
                          </div>
                          {el.airports &&
                            el.airports.map((elem) => (
                              <div
                                onClick={() =>
                                  setFrom({
                                    ...from,
                                    name: el.airportName,
                                    code_name: el.airportIataCode,
                                  }) ||
                                  setModalFrom(false) ||
                                  setValue('')
                                }
                                className="air_save"
                              >
                                <IoAirplaneSharp color="var(--blue)" size={20} />
                                <div
                                  style={{
                                    height: 35,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <p className="name">{elem.airportName}</p>
                                  <p className="code">{elem.airportIataCode}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Modal>
      )}
      {modalTo && (
        <Modal close={setModalTo}>
          <div className="relative">
            <IoSearch color="var(--blue)" className="icon" size={20} />
            <input
              className="input_form"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder="Поиск"
            />
          </div>
          {loading_param ? (
            <div className="loading_div">
              <Loading />
            </div>
          ) : (
            <div className="map_mest_travel">
              {searchData?.cities &&
                searchData.cities.map((el, index) => (
                  <div key={index} className="air_block">
                    <div
                      onClick={() =>
                        setTo({
                          ...to,
                          name: el.cityName,
                          code_name: el.cityIataCode,
                        }) ||
                        setModalTo(false) ||
                        setValue('')
                      }
                      key={el.id}
                      className="mest cursor"
                    >
                      {/* <div className="icons">
                        {el?.img ? (
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
                        ) : (
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              marginRight: 10,
                              objectFit: "cover",
                              objectPosition: "center",
                              background: "#ccc",
                            }}
                          ></div>
                        )}
                      </div> */}
                      <div>
                        <p>{el.countryName}</p>
                      </div>
                    </div>
                    <div className="air_top">
                      <div
                        onClick={() =>
                          setTo({
                            ...to,
                            name: el.cityName,
                            code_name: el.cityIataCode,
                          }) ||
                          setModalTo(false) ||
                          setValue('')
                        }
                        className="air_cities"
                      >
                        <div className="air_between">
                          <p className="name">{el.cityName}</p>
                          <p className="code">{el.cityIataCode}</p>
                        </div>
                        {el.airports &&
                          el.airports.map((elem) => (
                            <div className="air_save">
                              <IoAirplaneSharp color="var(--blue)" size={20} />
                              <div
                                style={{
                                  height: 35,
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <p className="name">{elem.airportName}</p>
                                <p className="code">{elem.airportIataCode}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Modal>
      )}
      {userModal && (
        <Modal close={setUserModal}>
          <div className="user_tour">
            <h1 className="head">Кто летит</h1>
            <p
              style={{
                marginTop: 3,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 400,
                color: 'gray',
                marginBottom: 30,
              }}
            >
              {totalUsers}{' '}
              {totalUsers === 1 ? 'пассажир' : totalUsers < 5 ? 'пассажира' : 'пассажиров'}
            </p>
            {persons.map(({ type, quantity }) => (
              <div className="user_box_tour" key={type}>
                <div>
                  <h1>{type === 'adt' ? 'Взрослые' : null}</h1>
                  <h1>{type === 'chd' ? 'Дети' : null}</h1>
                  <h1>{type === 'inf' ? 'Младенцы' : null}</h1>
                  <h1>{type === 'src' ? 'Пожилые' : null}</h1>
                  <h1>{type === 'yth' ? 'Студенты' : null}</h1>
                  <p>
                    {type === 'adt' && 'Старше 12 лет'}
                    {type === 'chd' && 'От 2 до 12 лет'}
                    {type === 'inf' && 'До 2 лет, без места'}
                    {type === 'src' && 'От 65 лет'}
                    {type === 'yth' && 'От 18 лет, до 25 лет'}
                  </p>
                </div>
                <div className="btns">
                  <button
                    onClick={() =>
                      updateUserQuantity(
                        type,
                        type === 'adt'
                          ? quantity > 1
                            ? quantity - 1
                            : 1
                          : quantity > 0
                          ? quantity - 1
                          : 0,
                      )
                    }
                    className="btn"
                  >
                    -
                  </button>
                  <h1>{quantity}</h1>
                  <button
                    onClick={() => (quantity >= 5 ? '' : updateUserQuantity(type, quantity + 1))}
                    className="btn"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setUserModal(false)} className="btn_close_block_modal active">
            Готово
          </button>
        </Modal>
      )}
      {modalClasses && (
        <Modal close={setModalClasses}>
          <div className="modal_classes">
            {classes.map((item) => (
              <div
                onClick={() => {
                  setClassesValue(item)
                  setModalClasses(false)
                }}
                className="type_box"
              >
                <h1>{item.value}</h1>
                {item.code === classesValue.code && <FaCheck size={24} color="#25d366" />}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Air
