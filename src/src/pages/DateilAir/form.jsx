import React, { useEffect, useState } from 'react'
import './DateilAir.css'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FiAlertCircle } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const code_name = [
  { country: 'Кыргызстан', code: 'KG' },
  { country: 'Казахстан', code: 'KZ' },
  { country: 'Афганистан', code: 'AF' },
  { country: 'Азербайджан', code: 'AZ' },
  { country: 'Китай', code: 'CN' },
  { country: 'Индия', code: 'IN' },
  { country: 'Япония', code: 'JP' },
  { country: 'Корея (Республика Корея)', code: 'KR' },
  { country: 'Россия', code: 'RU' },
  { country: 'Турция', code: 'TR' },
  { country: 'Австрия', code: 'AT' },
  { country: 'Бельгия', code: 'BE' },
  { country: 'Франция', code: 'FR' },
  { country: 'Германия', code: 'DE' },
  { country: 'Италия', code: 'IT' },
  { country: 'Нидерланды', code: 'NL' },
  { country: 'Испания', code: 'ES' },
  { country: 'Швейцария', code: 'CH' },
]

const genderData = [
  { gen: 'Мужской', code: 'M' },
  { gen: 'Женский', code: 'F' },
]

const docTypeData = [
  { gen: 'Иностранный документ', code: 'A' },
  { gen: 'Паспорт РФ', code: 'C' },
  { gen: 'Свидетельство о рождении РФ', code: 'B' },
  { gen: 'Заграничный паспорт РФ', code: 'P' },
  { gen: 'Военный билет ', code: 'M' },
  { gen: 'Паспорт моряка', code: 'S' },
  { gen: 'Удостоверение личности офицера (устарело)', code: 'UDL' },
  { gen: 'Справка об утере паспорта (устарело)', code: 'SPU' },
  { gen: 'Свидетельство на возвращение в РФ (устарело)', code: 'CVV' },
  { gen: 'Дипломатический паспорт', code: 'DP' },
  { gen: 'Служебный паспорт', code: 'WP' },
  { gen: 'Удостоверение личности офицера', code: 'O' },
  { gen: 'Справка об утере паспорта', code: 'L' },
  { gen: 'Свидетельство на возвращение в РФ', code: 'R' },
  { gen: 'Не указан', code: 'I' },
]

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const formatDateTwo = (dateString) => {
  if (!dateString) {
    return ''
  }

  const dateParts = dateString.split('.')
  if (dateParts.length !== 3) {
    return ''
  }

  const day = dateParts[0].padStart(2, '0')
  const month = dateParts[1].padStart(2, '0')
  const year = dateParts[2]

  return `${year}-${month}-${day}`
}

const classifyDate = (dateString) => {
  if (typeof dateString !== 'string') {
    return 'invalid'
  }

  const dateParts = dateString.split('.')
  if (dateParts.length !== 3) {
    return 'invalid'
  }

  const [day, month, year] = dateParts
  const date = new Date(year, month - 1, day)
  const today = new Date()

  if (isNaN(date.getTime())) {
    return 'invalid'
  }

  const age = today.getFullYear() - date.getFullYear()

  if (age >= 18 && age < 65) {
    return 'adt'
  } else if (age >= 2 && age < 18) {
    return 'chd'
  } else if (age < 2) {
    return 'inf'
  }

  return 'invalid'
}

const FormDetailsAir = ({ personType, start, user, onAddFormData, valid, setStatus, gg }) => {
  const [validationErrors, setValidationErrors] = useState({
    firstname: '',
    lastname: '',
    middlename: '', // Сделаем это поле необязательным
    age: '',
    birthdate: '',
    docnum: '',
    docexp: '',
    gender: '',
    citizen: '',
    doctype: '',
  })
  const [valueDecorTourist, setValueDecorTourist] = useState({
    id: gg,
    firstname: '',
    lastname: '',
    middlename: '', // Сделаем это поле необязательным
    age: '',
    birthdate: '',
    docnum: '',
    docexp: '',
    gender: 'M',
    citizen: 'KG',
    phone: '',
    email: '',
    send_email: 0,
    doctype: 'A',
  })
  const [open, setOpen] = useState(true)
  const [checkinng, setChecking] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let isFormValid = true
      const inputForms = document.querySelectorAll('.input_form')
      inputForms.forEach((input) => {
        const name = input.getAttribute('name')
        if (
          (open && validationErrors[name]) ||
          (!open && valid && !input.value && name !== 'middlename')
        ) {
          input.classList.add('error')
          isFormValid = false
        } else {
          input.classList.remove('error')
        }
      })

      const allFieldsFilled = Object.entries(valueDecorTourist).every(
        ([key, value]) => (value !== null && value !== '') || key === 'middlename',
      )
      const classifiedAge = classifyDate(valueDecorTourist.birthdate)

      console.log(allFieldsFilled, !checkinng, personType === classifiedAge)

      if (allFieldsFilled) {
        if (!checkinng) {
          if (personType == classifiedAge) {
            setStatus(isFormValid)
            onAddFormData(valueDecorTourist)
          } else {
            setStatus(false)
          }
        } else {
          setStatus(false)
        }
      } else {
        setStatus(false)
      }
    }, 0)

    return () => clearTimeout(timeout)
  }, [start, open, valueDecorTourist, validationErrors, valid])

  useEffect(() => {
    setValueDecorTourist({
      ...valueDecorTourist,
      phone: user.phone,
      email: user.email,
    })
  }, [])

  useEffect(() => {
    const allFieldsFilled = Object.entries(valueDecorTourist).every(
      ([key, value]) => (value !== null && value !== '') || key === 'middlename',
    )

    if (!allFieldsFilled && start.star) {
      setOpen(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })

      setTimeout(() => {
        const inputForms = document.querySelectorAll('.input_form')
        inputForms.forEach((input) => {
          if (!input.value && input.getAttribute('name') !== 'middlename') {
            input.classList.add('error')
          } else {
            input.classList.remove('error')
          }
        })
      }, 100)
    }
  }, [start])

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   const newValue =
  //     name === "birthdate" || name === "docexp" ? formatDate(value) : value;

  //   setValueDecorTourist((prevValue) => ({
  //     ...prevValue,
  //     [name]: newValue,
  //   }));

  //   setValidationErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: name !== "middlename" && newValue === "",
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target

    let newValue = value

    const hasCyrillic = /[а-яА-ЯёЁ]/.test(value)

    if (['lastname', 'firstname', 'middlename'].includes(name)) {
      newValue = value.replace(/[^a-zA-Z\s'-]/g, '')
    } else if (name === 'birthdate' || name === 'docexp') {
      newValue = formatDate(value)
    }

    setValueDecorTourist((prevValue) => ({
      ...prevValue,
      [name]: newValue,
    }))

    setValidationErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors }

      if (['lastname', 'firstname', 'middlename'].includes(name)) {
        if (hasCyrillic) {
          updatedErrors[name] = 'Пожалуйста, напишите на латинице'
        } else if (name !== 'middlename' && newValue.trim() === '') {
          updatedErrors[name] = 'Поле обязательно для заполнения'
        } else {
          updatedErrors[name] = ''
        }
      } else {
        updatedErrors[name] =
          name !== 'middlename' && newValue.trim() === '' ? 'Поле обязательно для заполнения' : ''
      }

      return updatedErrors
    })
  }

  const handleBirthdateChange = (e) => {
    const { value } = e.target
    const selectedDate = new Date(value)
    const today = new Date()

    if (selectedDate.getTime() > today.getTime()) {
      setValueDecorTourist((prevValue) => ({
        ...prevValue,
        birthdate: '',
      }))
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        birthdate: 'error',
      }))
    } else {
      setValueDecorTourist((prevValue) => ({
        ...prevValue,
        birthdate: formatDate(value),
      }))
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        birthdate: '',
      }))
    }
  }

  useEffect(() => {
    if (checkinng) {
      const classifiedAge = classifyDate(valueDecorTourist.birthdate)

      if (personType !== classifiedAge) {
        setOpen(true)
        setValidationErrors({ ...validationErrors, birthdate: 'error' })
      } else {
        setChecking(false)
        setValidationErrors({ ...validationErrors, birthdate: '' })
      }
    }
  }, [start, valueDecorTourist.birthdate, personType])

  function check() {
    setChecking(true)
  }

  useEffect(() => {
    if (valueDecorTourist.birthdate) {
      setValueDecorTourist({
        ...valueDecorTourist,
        age: classifyDate(valueDecorTourist.birthdate),
      })
    }
  }, [valueDecorTourist.birthdate])

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
    <div className="dateil_air_block">
      <div onClick={() => setOpen(!open)} className="between" style={{ alignItems: 'center' }}>
        <div>
          <h3>Пассажир {gg + 1}</h3>
          <p>
            {personType === 'adt'
              ? 'Взрослый, старше 12 лет'
              : personType === 'chd'
              ? 'Ребенок, от 2 до 12 лет'
              : personType === 'inf'
              ? 'Младенец, до 2 лет'
              : ''}
          </p>
        </div>
        <div>
          {open ? (
            <IoIosArrowDown color="var(--blue)" size={24} />
          ) : (
            <IoIosArrowUp color="var(--blue)" size={24} />
          )}
        </div>
      </div>
      {open && (
        <div className="height">
          <div className="two">
            <div className="top_blue"></div>
            <div className="input_box_air">
              <label className="label_form">Фамилия по загранпаспорту</label>
              <input
                className={`input_form ${validationErrors.lastname && 'error'}`}
                value={valueDecorTourist.lastname}
                onChange={handleInputChange}
                type="text"
                placeholder="Фамилия"
                name="lastname"
              />
              {validationErrors.lastname && (
                <p className="error_message">{validationErrors.lastname}</p>
              )}
            </div>
            <div className="input_box_air">
              <label className="label_form">Имя по загранпаспорту</label>
              <input
                className={`input_form ${validationErrors.firstname && 'error'}`}
                value={valueDecorTourist.firstname}
                onChange={handleInputChange}
                type="text"
                placeholder="Имя"
                name="firstname"
              />
              {validationErrors.firstname && (
                <p className="error_message">{validationErrors.firstname}</p>
              )}
            </div>
            <div className="input_box_air">
              <label className="label_form">Отчество по загранпаспорту</label>
              <input
                className={`input_form ${validationErrors.middlename && 'error'}`}
                value={valueDecorTourist.middlename}
                onChange={handleInputChange}
                type="text"
                placeholder="При наличии отчества в загранпаспорте"
                name="middlename"
              />
              {validationErrors.middlename && (
                <p className="error_message">{validationErrors.middlename}</p>
              )}
            </div>
            <div onClick={check} className="input_box_air">
              <label className="label_form">Дата рождения</label>
              <input
                className={`input_form ${validationErrors.birthdate ? 'error' : ''}`}
                value={formatDateTwo(valueDecorTourist.birthdate)}
                onChange={handleBirthdateChange}
                type="date"
                placeholder="Дата рождения"
                name="birthdate"
              />
            </div>
            <div className="input_box_air">
              <label className="label_form">Пол</label>
              <select
                className={`input_form ${validationErrors.gender && 'error'}`}
                value={valueDecorTourist.gender}
                onChange={handleInputChange}
                type="text"
                placeholder="Пол"
                name="gender"
              >
                {genderData.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.gen}
                  </option>
                ))}
              </select>
            </div>
            <div className="input_box_air">
              <label className="label_form">Номер паспорта</label>
              <input
                className={`input_form ${validationErrors.docnum && 'error'}`}
                value={valueDecorTourist.docnum}
                onChange={handleInputChange}
                type="text"
                placeholder="Серия и номер документа"
                name="docnum"
              />
              <div className="input_icon" onClick={handleClickToast}>
                <FiAlertCircle />
              </div>
            </div>
            <div className="input_box_air">
              <label className="label_form">Срок действия</label>
              <input
                className={`input_form ${validationErrors.docexp && 'error'}`}
                value={formatDateTwo(valueDecorTourist.docexp)}
                onChange={handleInputChange}
                type="date"
                placeholder="Срок действия"
                name="docexp"
              />
            </div>
            <div className="input_box_air">
              <label className="label_form">Страна выдачи</label>
              <select
                className={`input_form ${validationErrors.citizen && 'error'}`}
                value={valueDecorTourist.citizen}
                onChange={handleInputChange}
                type="text"
                placeholder="Страна выдачи"
                name="citizen"
              >
                {code_name.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="input_box_air">
              <label className="label_form">Тип документа</label>
              <select
                className={`input_form ${validationErrors.doctype && 'error'}`}
                value={valueDecorTourist.doctype}
                onChange={handleInputChange}
                type="text"
                placeholder="Пол"
                name="doctype"
              >
                {docTypeData.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.gen}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
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
  )
}

export default FormDetailsAir
