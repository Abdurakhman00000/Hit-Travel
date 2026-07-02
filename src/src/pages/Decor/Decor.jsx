import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiAlertCircle } from 'react-icons/fi'
import './Decor.css'
import FormDetails from './eraervg'
import { url } from '../../Api'
import Header from '../../components/Header/Header'
import axios from 'axios'
import Loading from '../../components/UI/Loading/Loading'
import Loader from '../../components/UI/Loader/Loader'
import { deepAction } from '../../store/actions/deep'
import { FaUserPlus } from 'react-icons/fa6'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Decor = ({ Alert }) => {
  const { tourid, busid, buspage } = useParams()
  const [blue, setBlue] = useState(true)
  const [red, setRed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [valueDecor, setValueDecor] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    gender: busid ? 'Муж' : 'м',
    country: '',
    inn: '',
    passport_id: '',
    city: '',
    date: '',
    citizenship: '',
    bonuses: 0,
    validity: '',
    date_of_issue: '',
    issued_by: '',
    travels: [],
  })
  const phone = true
  const [local, setLocal] = useState('')
  const { dataFilter } = useSelector((state) => state.filter)
  const [gup, setGup] = useState([])
  const [formDataList, updateFormDataList] = useState([])
  const [count, setCount] = useState(0)
  const navigate = useNavigate()
  const { personal } = useSelector((state) => state.personal)
  const { tourData } = useSelector((state) => state.tour)
  const { decor } = useSelector((state) => state.decor)
  const { bus } = useSelector((state) => state.bus)
  const [dataDecor, setDataDecor] = useState([])
  const [errors, setErrors] = useState({
    last_name: '',
    first_name: '',
  })
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setLocal(token)
    }
  }, [])

  const headers = {
    Authorization: `Token ${local}`,
  }

  useEffect(() => {
    if (local && personal && personal.first_name) {
      setValueDecor({
        ...valueDecor,
        first_name: personal.first_name,
        last_name: personal.last_name,
        phone: personal.phone,
        email: personal.email,
        country: personal.county,
        inn: personal.inn,
        date: personal.dateofborn,
        passport_id: personal.passport_id,
        date_of_issue: personal.date_of_issue,
        issued_by: personal.issued_by,
        validity: personal.validity,
        city: personal.city,
      })
    }
  }, [local, personal])

  useEffect(() => {
    setValueDecor({ ...valueDecor, travels: formDataList })
  }, [formDataList])

  const price_bonus =
    (dataDecor &&
      dataDecor.tour &&
      dataDecor.tour.operatorprice &&
      dataDecor.tour.operatorprice / 100) * 3

  useEffect(() => {
    if (valueDecor.bonuses > price_bonus) {
      Alert(`Вы можете использовать только 3% от стоимости`, 'error')
      setValueDecor({ ...valueDecor, bonuses: '' })
    }
  }, [valueDecor])

  useEffect(() => {
    dispatch(deepAction([]))
  }, [])

  useEffect(() => {
    if (buspage) {
      setDataDecor(bus)
    } else {
      if (tourData && tourData.tour && tourData.tour.adults) {
        setDataDecor(tourData)
      } else {
        setDataDecor(decor)
      }
    }
  }, [tourData, decor])

  const Decor = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (personal.bonuses >= valueDecor.bonuses) {
      if (valueDecor.inn?.length >= 12) {
        try {
          const newDataName = {
            first_name: valueDecor.first_name,
            last_name: valueDecor.last_name,
            inn: valueDecor.inn,
            phone: valueDecor.phone,
            email: valueDecor.email,
            gender: valueDecor.gender,
            passport_id: valueDecor.passport_id,
            dateofborn: valueDecor.date,
            city: valueDecor.city,
            country: valueDecor.country,
            bonuses: valueDecor.bonuses,
            validity: valueDecor.validity,
            date_of_issue: valueDecor.date_of_issue,
            issued_by: valueDecor.issued_by,
            currency:
              dataDecor?.tour?.operatorcurrency === 'USD'
                ? 2
                : dataDecor?.tour?.operatorcurrency === 'EUR'
                ? 1
                : '',
            price: dataDecor && dataDecor.tour && dataDecor.tour.operatorprice,
            tourid: tourid,
            operatorlink: dataDecor && dataDecor.tour && dataDecor.tour.operatorlink,
            travelers: valueDecor.travels,
            tour: busid,
          }

          const request = buspage ? `/bus-tour/request` : `/tour/request`

          const response = await axios.post(url + request, newDataName, {
            headers,
          })

          setGup(response.data)

          if (response.data.response === true) {
            if (busid) {
              Alert(response.data.message, 'success')
              navigate('/dashboard/history')
            } else {
              Alert(response.data.message, 'success')
              const datasing = {
                amount: response.data?.amount,
                currency: 'KGS',
                status: null,
                timeout: null,
                datasis: response.data,
                deeplink: response.data?.deeplink,
              }
              dispatch(deepAction(datasing))
              navigate('/payment')
            }
          } else if (response.data.response === false) {
            Alert('Тур оформлен', 'error')
          } else {
            Alert('Заполните все поля', 'error')
          }
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.error('Ошибка запроса:', error)
          Alert('Ошибка', 'error')
        }
      } else {
        setLoading(false)
        setGup({
          inn: 'Допустимое кол-во символов - 12-14',
        })
      }
    } else {
      setLoading(false)
      Alert('У вас не хватает бонусов', 'error')
    }
  }

  const data_tourist = eval(
    `${dataDecor && dataDecor.tour && dataDecor.tour.operatorprice && dataDecor.tour.adults} + ${
      dataDecor && dataDecor.tour && dataDecor.tour.operatorprice && dataDecor.tour.child
    }`,
  )

  const FuncData = (newFormData) => {
    const isExistingForm = formDataList.some((formData) => formData.id === newFormData.id)

    if (isExistingForm) {
      updateFormDataList((prevList) =>
        prevList.filter((formData) => formData.id !== newFormData.id),
      )
    }

    updateFormDataList((prevList) => [...prevList, newFormData])
  }

  const handleChange = (event) => {
    const selectedValue = event.target.value
    const updatedValue = selectedValue.replace('Киргизия', 'Кыргызстан')
    setValueDecor({ ...valueDecor, country: updatedValue })
  }

  const load = buspage
    ? buspage
    : dataDecor && dataDecor.tour && dataDecor.tour.price && dataDecor.tour.price

  const handleInputChange = (e) => {
    const newValue = e.target.value
    if (newValue === '' || Number(newValue) >= 0) {
      setValueDecor({
        ...valueDecor,
        bonuses: newValue,
      })
    }
  }
  const handleLatinOnly = (e) => {
    const { name, value } = e.target
    const hasCyrillic = /[а-яё]/i.test(value)
    const filteredValue = value.replace(/[^a-zA-Z\s'-]/g, '')

    setValueDecor((prev) => ({
      ...prev,
      [name]: filteredValue,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: hasCyrillic ? 'Введите только латинские буквы' : '',
    }))
  }

  const handleClickToast = () => {
    console.log('njnj')

    toast.success(
      <div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Серия и номер паспорта.</div>
        <div style={{ fontSize: '14px', marginTop: '10px' }}>
          Укажите серию и номер паспорта, например ID0000000 или AN0000000, при этом без пробелов и
          знаков припенания.
        </div>
      </div>,
      {
        style: {
          backgroundColor: 'blue',
          color: '#fff',
        },
      },
    )
  }
  return (
    <div className="decor">
      <Header phone={phone}>
        <h1>Оформление</h1>
      </Header>
      {load ? (
        <>
          <div className="container">
            <h1>Данные покупателя</h1>
            <div className="form_decor">
              <div>
                <div className="decor_div">
                  <label className="label_form">Телефон</label>
                  <input
                    className="input_form disabled"
                    value={valueDecor.phone}
                    onChange={(e) => setValueDecor({ ...valueDecor, phone: e.target.value })}
                    disabled={true}
                    type="text"
                    placeholder="Телефон"
                    name="phone"
                  />
                  {gup.phone && <p className="red">{gup.phone}</p>}
                </div>
                <div className="decor_div">
                  <label className="label_form">E-mail</label>
                  <input
                    value={valueDecor.email}
                    onChange={(e) => setValueDecor({ ...valueDecor, email: e.target.value })}
                    disabled={true}
                    className="input_form disabled"
                    type="text"
                    placeholder="E-mail"
                    name="email"
                  />
                  {gup.email && <p className="red">{gup.email}</p>}
                </div>
                <p className="info">
                  Информирование о заказе будет отправляться на эти телефон и почту.
                </p>
                <div className="decor_div">
                  <label className="label_form">Фамилия</label>
                  <input
                    className="input_form"
                    value={valueDecor.last_name}
                    onChange={handleLatinOnly}
                    type="text"
                    placeholder="Фамилия"
                    name="last_name"
                  />
                  {errors.last_name && <p className="red">{errors.last_name}</p>}
                  {gup.last_name && <p className="red">{gup.last_name}</p>}
                </div>
                <div className="decor_div">
                  <label className="label_form">Имя</label>
                  <input
                    className="input_form"
                    value={valueDecor.first_name}
                    onChange={handleLatinOnly}
                    type="text"
                    placeholder="Имя"
                    name="first_name"
                  />
                  {errors.first_name && <p className="red">{errors.first_name}</p>}
                  {gup.first_name && <p className="red">{gup.first_name}</p>}
                </div>
                <div className="decor_div">
                  <label className="label_form">Дата рождения</label>
                  <input
                    className="input_form"
                    value={valueDecor.date}
                    onChange={(e) => setValueDecor({ ...valueDecor, date: e.target.value })}
                    type="date"
                    name="date"
                  />
                  {gup.dateofborn && (
                    <p className="red">
                      {gup.dateofborn ==
                        'Неправильный формат date. Используйте один из этих форматов: YYYY-MM-DD.' &&
                        'Обязательное поле.'}
                    </p>
                  )}
                </div>
                <div className="decor_div">
                  <label className="label_form">Номер паспорта</label>
                  <input
                    className="input_form"
                    value={valueDecor.passport_id}
                    onChange={(e) =>
                      setValueDecor({
                        ...valueDecor,
                        passport_id: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="Серия и номер документа"
                    name="ID"
                  />
                  <div className="input_icon" onClick={handleClickToast}>
                    <FiAlertCircle />
                  </div>
                  {gup.passport_id && <p className="red">{gup.passport_id}</p>}
                </div>
                <div>
                  <div>
                    <label className="label_form">Пол</label>
                    <div className="pol">
                      <div
                        onClick={() =>
                          setBlue(true) ||
                          setRed(false) ||
                          setValueDecor({
                            ...valueDecor,
                            gender: busid ? 'Муж' : 'м',
                          })
                        }
                        className={blue ? 'blue active' : 'blue'}
                      >
                        Муж
                      </div>
                      <div
                        onClick={() =>
                          setBlue(false) ||
                          setRed(true) ||
                          setValueDecor({
                            ...valueDecor,
                            gender: busid ? 'Жен' : 'ж',
                          })
                        }
                        className={red ? 'redd active' : 'redd'}
                      >
                        Жен
                      </div>
                    </div>
                  </div>
                </div>
                <div className="decor_div">
                  <label className="label_form">Город</label>
                  <input
                    className="input_form"
                    value={valueDecor.city}
                    onChange={(e) => setValueDecor({ ...valueDecor, city: e.target.value })}
                    type="text"
                    placeholder="Город"
                    name="Город"
                  />
                  {gup.city && <p className="red">{gup.city}</p>}
                </div>
                <div className="decor_div">
                  <label className="label_form">Гражданство</label>
                  <select
                    className="input_select"
                    onChange={handleChange}
                    value={valueDecor.country}
                  >
                    {dataFilter.countries.country.map((el, id) => (
                      <option key={id} value={el.name.replace('Киргизия', 'Кыргызстан')}>
                        {el.name.replace('Киргизия', 'Кыргызстан')}
                      </option>
                    ))}
                  </select>
                  {gup.country && <p className="red">{gup.country}</p>}
                </div>
                <div className="decor_div">
                  <label className="label_form">Дата выдачи</label>
                  <input
                    className="input_form"
                    value={valueDecor.date_of_issue}
                    onChange={(e) =>
                      setValueDecor({
                        ...valueDecor,
                        date_of_issue: e.target.value,
                      })
                    }
                    type="date"
                    name="Дата выдачи"
                  />
                  {gup.date_of_issue && (
                    <p className="red">
                      {gup.date_of_issue ==
                        'Неправильный формат date. Используйте один из этих форматов: YYYY-MM-DD.' &&
                        'Обязательное поле.'}
                    </p>
                  )}
                </div>
                <div className="decor_div">
                  <label className="label_form">Кем выдан</label>
                  <input
                    className="input_form"
                    value={valueDecor.issued_by}
                    onChange={(e) =>
                      setValueDecor({
                        ...valueDecor,
                        issued_by: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="МКК 123456"
                    name="Кем выдан"
                  />
                  {gup.issued_by && <p className="red">{gup.issued_by}</p>}
                </div>
                <div className="decor_div">
                  <label className="label_form">Срок действия</label>
                  <input
                    className="input_form"
                    value={valueDecor.validity}
                    onChange={(e) =>
                      setValueDecor({
                        ...valueDecor,
                        validity: e.target.value,
                      })
                    }
                    type="date"
                    name="Срок действия"
                  />
                  {gup.validity && (
                    <p className="red">
                      {gup.validity ==
                        'Неправильный формат date. Используйте один из этих форматов: YYYY-MM-DD.' &&
                        'Обязательное поле.'}
                    </p>
                  )}
                </div>
                <div className="decor_div_inn">
                  <label className="label_form">ИНН</label>
                  <input
                    className={`input_form `}
                    value={valueDecor.inn}
                    onChange={(e) => {
                      const inputInn = e.target.value.replace(/\D/g, '')
                      if (inputInn.length <= 14) {
                        setValueDecor({ ...valueDecor, inn: inputInn })
                      }
                    }}
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    name="ИНН"
                    maxLength="14"
                  />
                  {gup.inn && <p className="red">{gup.inn}</p>}
                </div>
              </div>
              <div className="add_tourist">
                {busid ? (
                  <div className="box_save">
                    <div
                      onClick={() => (count > 7 ? '' : setCount(count + 1))}
                      className="add_count"
                    >
                      <h1>Добавить Туриста</h1>
                      <FaUserPlus color="var(--blue)" size={24} />
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {Array.from({
                  length: count,
                }).map((el, id) => (
                  <FormDetails key={id} Alert={Alert} gg={id} FuncData={FuncData} />
                ))}
              </div>
              {data_tourist >= 1 ? (
                <div className="box_save">
                  {Array.from({
                    length: data_tourist,
                  }).map((el, id) => (
                    <FormDetails key={id} Alert={Alert} gg={id} FuncData={FuncData} />
                  ))}
                </div>
              ) : (
                ''
              )}
              <div className="tour_block">
                <div className="block_price_head">
                  <h3>Итого</h3>
                  <h1>
                    {dataDecor.tour ? dataDecor.tour.operatorprice : dataDecor.price}{' '}
                    {dataDecor.tour ? dataDecor.tour.operatorcurrency : ''}
                  </h1>
                </div>
                <div className="hr"></div>
                <div className="block_price_bonus">
                  <h2>
                    Ваши бонусы <b>{personal.bonuses}</b>{' '}
                  </h2>
                  <input
                    className="input_form full_border"
                    value={valueDecor.bonuses}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="Введите сколько бонусов вы хотите снять"
                  />
                  <p className="green">Можно использовать только 3% от стоимости</p>
                </div>
              </div>
              <button disabled={loading} onClick={Decor} className="button_form m">
                {loading ? <Loading color={'#fff'} /> : 'Продолжить'}
              </button>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000} // Автозакрытие через 5 секунд
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </>
      ) : (
        <div className="loading_div">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Decor
