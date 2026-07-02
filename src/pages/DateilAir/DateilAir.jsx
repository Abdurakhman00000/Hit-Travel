import React, { useEffect, useState } from 'react'
import './DateilAir.css'
import { useNavigate, useParams } from 'react-router-dom'
import { url } from '../../Api'
import Loader from '../../components/UI/Loader/Loader'
import Header from '../../components/Header/Header'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import FormDetailsAir from './form'
import Loading from '../../components/UI/Loading/Loading'
import { deepAction } from '../../store/actions/deep'
import details_icon7 from '../../img/detais_icon7.svg'
import DetailSigments from '../../components/UI/DetailSigments/DetailSigments'
import { RiLuggageDepositLine } from 'react-icons/ri'
import TimeGap from './TimeGap'
import { FaCheck } from 'react-icons/fa6'
import { MdLuggage } from 'react-icons/md'
import { TbReceiptRefund } from 'react-icons/tb'
import { LiaExchangeAltSolid } from 'react-icons/lia'

const DateilAir = ({ Alert }) => {
  const { id } = useParams()
  const [ticket, setTicket] = useState([])
  const [loading, setLoading] = useState(true)
  const [loader, setLoader] = useState(false)
  const { personal } = useSelector((state) => state.personal)
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    passages: [],
  })
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
  })
  const [valid, setValid] = useState(false)
  const [status, setStatus] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isCheckedTwo, setIsCheckedTwo] = useState(false)
  const { countData } = useSelector((state) => state.count)
  const [count, setCount] = useState(0)
  const [start, setStart] = useState(false)
  const [modalConditions, setModalConditions] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [load, setLoad] = useState(false)
  const [agree, setAgree] = useState([])
  const { conditions } = useSelector((state) => state.conditions)

  const getAgree = async () => {
    setLoad(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(url + `/avia/rules/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      setAgree(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoad(false)
    }
  }

  const rulesText = agree?.rules?.[Object.keys(agree.rules)[0]]?.[0]?.text

  useEffect(() => {
    setLoading(true)
    axios
      .get(url + `/avia/detail/${id}`)
      .then((response) => {
        if (
          response.data.message ==
          'Перепоиск не дал результатов. Пожалуйста, создайте бронирование повторно'
        ) {
          Alert('Перепоиск не дал результатов. Пожалуйста, создайте бронирование повторно', 'error')
          navigate(-1)
        }
        setTicket(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    dispatch(deepAction([]))
  }, [])

  useEffect(() => {
    let newCount = []
    countData.forEach((el, index) => {
      newCount = newCount.concat(
        Array.from(
          { length: el.quantity },
          (_, i) => countData.slice(0, index).reduce((acc, curr) => acc + curr.quantity, 0) + i + 1,
        ),
      )
    })
    setCount(newCount)
  }, [countData])

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const handleCheckboxChangeTwo = () => {
    setIsCheckedTwo(!isCheckedTwo)
  }

  useEffect(() => {
    setUser({
      ...user,
      first_name: personal.first_name,
      last_name: personal.last_name,
      email: personal.email,
      phone: personal.phone,
    })
  }, [])

  console.log(personal.phone)

  const handleAddFormData = (formData) => {
    const passageIndex = user.passages.findIndex((passage) => passage.id === formData.id)

    if (passageIndex !== -1) {
      const updatedPassages = user.passages.map((passage, index) => {
        if (index === passageIndex) {
          return formData
        }
        return passage
      })

      setUser((prevUser) => ({
        ...prevUser,
        passages: updatedPassages,
      }))
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        passages: [...prevUser.passages, formData],
      }))
    }
  }

  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const requestData = {
    tid: ticket?.flight?.id,
    lang: 'ru',
    client_phone: user.phone,
    payer_name: user.first_name,
    client_email: user.email,
    is_health_declaration_checked: 0,
    passengers: user.passages,
  }

  const passengersParams = requestData.passengers
    .map((passenger, index) => {
      const { id, ...passengerData } = passenger
      const passengerParams = Object.keys(passengerData)
        .map((key) => `passengers[${index}][${key}]=${encodeURIComponent(passengerData[key])}`)
        .join('&')
      return passengerParams
    })
    .join('&')

  const SFend = async () => {
    console.log(user.phone, 'beka')

    const token = localStorage.getItem('token')
    if (token) {
      if (isCheckedTwo) {
        if (status) {
          const allFieldsFilled = requestData.passengers.every((passenger, passengerIndex) => {
            const fieldsFilled = Object.keys(passenger).every((key) => {
              if (key === 'id' || key === 'send_email' || key === 'middlename') return true
              const isFieldFilled = !!passenger[key]
              return isFieldFilled
            })
            return fieldsFilled
          })

          if (allFieldsFilled) {
            setStart(false)
            setLoader(true)
            const url_book = `${url}/avia/book/?&tid=${requestData.tid}&lang=${
              requestData.lang
            }&client_phone=${requestData.client_phone}&payer_name=${
              requestData.payer_name
            }&client_email=${requestData.client_email}&is_health_declaration_checked=${
              requestData.is_health_declaration_checked
            }${passengersParams && `&${passengersParams}`}&count=${count.length}`
            try {
              const response = await axios.get(url_book, {
                headers: { Authorization: `Token ${token}` },
              })
              setLoader(false)
              if (response.data.message) {
                Alert(response.data.message, 'error')
              }
              if (response.data.response === true && response.data?.deeplink) {
                const datasing = {
                  amount: response.data?.amount,
                  currency: 'KGS',
                  status: null,
                  timeout: null,
                  datasis: response.data,
                  deeplink: response.data?.deeplink,
                }
                Alert('Успешно', 'success')
                dispatch(deepAction(datasing))
                navigate('/payment/')
              }
            } catch (error) {
              console.error('Booking error:', error)
              setLoader(false)
            }
          } else {
            setStart({
              id: Date.now(),
              star: true,
            })
            handleScroll()
            setValid(true)
          }
        } else {
          setStart({
            id: Date.now(),
            star: true,
          })
          setValid(true)
          handleScroll()
        }
      } else {
        Alert('Пожалуйста согласитесь с условиями', 'error')
      }
    } else {
      navigate('/login')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const hasCyrillic = /[а-яА-ЯёЁ]/.test(value)
    const filteredValue = value.replace(/[^a-zA-Z\s'-]/g, '')

    setUser((prev) => ({
      ...prev,
      [name]: filteredValue,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: hasCyrillic ? 'Пожалуйста, напишите на латинице' : '',
    }))
  }

  return (
    <div className="dateil_air">
      {loading ? (
        <div className="loading_div">
          <Loader />
        </div>
      ) : (
        <>
          <Header modal={modalConditions} handle={() => setModalConditions(false)}>
            {modalConditions ? <h1>Условия</h1> : <h1> Детали перелета</h1>}
          </Header>
          <div className="detail_air_comp">
            <div className="container">
              <p className="test">Проверьте маршрут и детали поездки, прежде чем продолжить</p>
              <div className="air_box">
                {ticket &&
                  ticket?.flight?.segments_direction.map((direction, directionIndex) => (
                    <div key={directionIndex}>
                      <div className="head_air">
                        <img className="image_center" src={details_icon7} alt="" />
                        <div>
                          <h2 className="title">
                            {directionIndex === 0
                              ? `Туда ${direction.length > 1 ? 'с пересадкой' : 'прямой'}`
                              : `Обратно ${direction.length > 1 ? 'с пересадкой' : 'прямой'}`}
                          </h2>
                        </div>
                      </div>
                      {direction.map((segmentIndex, index) => {
                        const item = ticket?.flight?.segments[segmentIndex]
                        const nextSegmentIndex = direction[index + 1]
                        const nextItem = ticket?.flight?.segments[nextSegmentIndex]

                        return (
                          <React.Fragment key={segmentIndex}>
                            <DetailSigments
                              code1={item.dep?.airport.code}
                              code2={item.arr?.airport.code}
                              from_time={item.dep?.time}
                              from_date={item.dep?.date}
                              from_city={item.dep.city.title}
                              from_country={item.dep.country.title}
                              aircraft={item?.aircraft?.title}
                              carrier={item?.carrier?.title}
                              to_time={item.arr?.time}
                              to_date={item.arr?.date}
                              to_city={item.arr.city.title}
                              to_country={item.arr.country.title}
                              hour={item?.duration?.flight?.hour}
                              minute={item?.duration?.flight?.minute}
                              reis={`${item?.carrier?.code}-${item?.flight_number}`}
                            />

                            {index < direction.length - 1 && nextItem && (
                              <TimeGap
                                fromDatetime={item.arr?.datetime}
                                fromCountry={item.arr?.country?.title}
                                toDatetime={nextItem?.dep?.datetime}
                                toCountry={nextItem?.dep?.country?.title}
                              />
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  ))}
              </div>
              {countData.map((el, index) =>
                Array.from({ length: el.quantity }, (_, i) => (
                  <FormDetailsAir
                    key={`${index}-${i}`}
                    user={user}
                    onAddFormData={handleAddFormData}
                    valid={valid}
                    loader={loader}
                    setStatus={setStatus}
                    gg={countData.slice(0, index).reduce((acc, curr) => acc + curr.quantity, 0) + i}
                    start={start}
                    personType={el.type}
                  />
                )),
              )}
              <div className="dateil_air_block">
                <h3>Покупатель</h3>
                <p>Отправим билет, сообщим об изменениях</p>
                <div className="input_box_air">
                  <label className="label_form">Фамилия</label>
                  <input
                    className="input_form"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Фамилия"
                  />
                  {errors.last_name && <p className="error_message">{errors.last_name}</p>}
                </div>
                <div className="input_box_air">
                  <label className="label_form">Имя</label>
                  <input
                    className="input_form"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Имя"
                  />
                  {errors.first_name && <p className="error_message">{errors.first_name}</p>}
                </div>
                <div className="input_box_air">
                  <label className="label_form">E-mail</label>
                  <input
                    className="input_form"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    type="text"
                    placeholder="E-mail"
                    disabled={true}
                  />
                </div>
                <div className="input_box_air">
                  <label className="label_form">Телефон</label>
                  <input
                    className="input_form"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    type="text"
                    placeholder="Телефон"
                    disabled={true}
                  />
                </div>
              </div>
              <h3 className="h3_title">Доступные тарифы</h3>
              <p className="p_text">Стоимость багажа при оплате в аэропорту может быть выше</p>
            </div>
            <div className="hidden">
              <div className="hidden_flex">
                {conditions.map((el, index) => (
                  <div className="clessis" key={el.id}>
                    <div
                      key={index}
                      onClick={() => {
                        if (id !== el.id) {
                          navigate(`/detail-air/${el.id}`)
                        }
                      }}
                      className={`dateil_air_block box ${id == el.id && 'active'} `}
                    >
                      <p className="bold">
                        {el?.price ? el.price : `+ ${el?.increase_price?.KGS}`} KGS
                      </p>
                      {el?.cbaggage > 0 ? (
                        <div className="flex">
                          <RiLuggageDepositLine size={24} color="var(--blue)" />{' '}
                          <p className="bolding">{el.cbaggage} кг руч. кладь</p>
                        </div>
                      ) : (
                        <div className="flex">
                          <div className="diagonal-strike">
                            <RiLuggageDepositLine size={24} color="#9da0a2" />{' '}
                          </div>
                          <p className="graying">руч. кладь</p>
                        </div>
                      )}
                      {el?.is_baggage === true ? (
                        <div className="flex">
                          <MdLuggage size={24} color="var(--blue)" />{' '}
                          <p className="bolding">
                            {el?.baggage !== Infinity && el?.baggage > 0 && `${el.baggage} кг`}
                            Багаж
                          </p>
                        </div>
                      ) : (
                        <div className="flex">
                          <div className="diagonal-strike">
                            <MdLuggage size={24} color="#9da0a2" />{' '}
                          </div>
                          <p className="graying">Багаж</p>
                        </div>
                      )}
                      {el?.is_refund === true ? (
                        <div className="flex">
                          <TbReceiptRefund size={24} color="var(--blue)" />{' '}
                          <p className="bolding">Возврат</p>
                        </div>
                      ) : (
                        <div className="flex">
                          <div className="diagonal-strike">
                            <TbReceiptRefund size={24} color="#9da0a2" />{' '}
                          </div>
                          <p className="graying">Возврат</p>
                        </div>
                      )}
                      {el?.is_change === true ? (
                        <div className="flex">
                          <LiaExchangeAltSolid size={24} color="var(--blue)" />{' '}
                          <p className="bolding">Обмен</p>
                        </div>
                      ) : (
                        <div className="flex">
                          <div className="diagonal-strike">
                            <LiaExchangeAltSolid size={24} color="#9da0a2" />{' '}
                          </div>
                          <p className="graying">Обмен</p>
                        </div>
                      )}
                      <div>
                        {id !== el.id ? (
                          <div className="btn_m"> Выбрать</div>
                        ) : (
                          <div className="btn_m active">
                            <FaCheck size={16} color="var(--blue)" />
                            <p
                              style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: 'var(--blue)',
                              }}
                            >
                              Выбрано
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: '0 16px',
              }}
            >
              <div className="dateil_air_block">
                <div className="between">
                  <p className="itog">Итог:</p>
                  <div className="column">
                    <p className="price">{ticket?.flight?.price?.KGS?.amount} KGS</p>
                  </div>
                </div>
                <div className="sogl">
                  <input
                    type="checkbox"
                    id="soglCheckbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <p style={{ flex: 1 }} className="text" onClick={handleCheckboxChange}>
                    Даю согласие на обработку персональных данных
                  </p>
                </div>
                <div className="sogl">
                  <input
                    type="checkbox"
                    id="soglCheckbox"
                    checked={isCheckedTwo}
                    onChange={handleCheckboxChangeTwo}
                  />
                  <p style={{ flex: 1 }} className="text" onClick={handleCheckboxChangeTwo}>
                    Я принимаю, условия договора IATA,
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: 'var(--blue)',
                        textDecorationLine: 'underline',
                      }}
                      onClick={() => {
                        getAgree()
                        setModalConditions(true)
                      }}
                    >
                      {' '}
                      Условия тарифа
                    </span>
                    и согласен, чтобы предоставленная мной информация обрабатывалась в соответствии
                    с законом КР О персональных данных.
                  </p>
                </div>
                <button disabled={loader} onClick={() => SFend()} className="button_form">
                  {loader ? <Loading color={'#fff'} /> : 'Продолжить'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {modalConditions && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flex: 1,
            width: '100%',
            height: '100vh',
            background: 'var(--white)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              marginTop: 60,
              paddingTop: 20,
              paddingLeft: 16,
              paddingRight: 16,
              paddingBottom: 200,
              overflowX: 'hidden',
            }}
          >
            {load ? (
              <div
                style={{
                  marginTop: 200,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Loading />
              </div>
            ) : (
              React.createElement('div', {
                dangerouslySetInnerHTML: {
                  __html: rulesText,
                },
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DateilAir
