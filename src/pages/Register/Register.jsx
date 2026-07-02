import React, { useEffect, useState } from "react";
import "./Register.css";
import Header from "../../components/Header/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Loading from "../../components/UI/Loading/Loading";
import { url } from "../../Api";
import { NavLink, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";

const Register = ({ Alert }) => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  // const [country, setCountry] = useState([])
  // const [open, setOpen] = useState(false)
  // const [countryCode, setCountryCode] = useState({
  //   flag: "",
  //   code: "",
  //   mask: ""
  // })
  const [inputData, setInputData] = useState({
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]); 

    if (inputData.password !== inputData.confirm_password) {
      setLoading(false);
      Alert("Пароли не совпадают", "error");
      return; 
    }

    const dataNew = {
      email: inputData.email,
      phone: value, 
      first_name: inputData.first_name,
      last_name: inputData.last_name,
      password: inputData.password,
      confirm_password: inputData.confirm_password,
    };

    try {
      const response = await axios.post(url + "/auth/register", dataNew);
      setLoading(false);

      
      if (response.data.response === true) {
        localStorage.setItem("phone", dataNew.phone);
        navigate("/activation");
      }
    } catch (error) {
      setLoading(false);

   
      console.log("Детали ошибки регистрации от Django:", error.response?.data);

      if (error.response && error.response.data) {
        const serverData = error.response.data;

      
        setError(serverData);

     
        if (serverData.message) {
          Alert(serverData.message, "error");
        }
      } else {
        Alert("Произошла сетевая ошибка. Проверьте подключение.", "error");
      }
    }
  };

  // useEffect(() => {
  //   axios.get("https://hit-travel.org/countries")
  //     .then((response) => {
  //       setCountry(response.data)
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }, [])

  // useEffect(() => {
  //   if (country && country.kg) {
  //     const data = country.kg
  //     setCountryCode({ ...countryCode, flag: data.flag, code: data.code, mask: data.mask })
  //   }
  // }, [country])

  return (
    <div className="register">
      <Header>
        <h1>Вход в профиль</h1>
      </Header>
      <div className="container">
        <form onSubmit={handleSubmit} className="register_from">
          <div className="input_box">
            <label className="label_form">Имя</label>
            <input
              className="input_form"
              type="text"
              value={inputData.first_name}
              onChange={(e) =>
                setInputData({ ...inputData, first_name: e.target.value })
              }
              name="first_name"
              placeholder="Имя"
            />
            {error.first_name && <p className="red">{error.first_name}</p>}
          </div>
          <div className="input_box">
            <label className="label_form">Фамилия</label>
            <input
              className="input_form"
              type="text"
              value={inputData.last_name}
              onChange={(e) =>
                setInputData({ ...inputData, last_name: e.target.value })
              }
              name="last_name"
              placeholder="Фамилия"
            />
            {error.last_name && <p className="red">{error.last_name}</p>}
          </div>
          <div className="input_box">
            <label className="label_form">Номер телефона</label>
            {/* <div onClick={() => setOpen(!open)} className="input_mask">
              <img src={countryCode.flag} alt="" />
              <p>{countryCode.code}</p>
            </div>
            <input
              style={{ paddingLeft: countryCode.code.length == 2 ? 53 : countryCode.code.length == 3 ? 63 : countryCode.code.length == 4 ? 70 : 55 }}
              className="input_form input_register"
              type="number"
              value={inputData.phone}
              onChange={(e) =>
                setInputData({ ...inputData, phone: e.target.value })
              }
              name="phone"
              placeholder={countryCode.mask}
            />
            {error.phone && <p className="red">{error.phone}</p>}
            {open && <div className="select">
              {country && country.countries && country.countries.map(el =>
                <div onClick={() => setCountryCode({ ...countryCode, flag: el.flag, code: el.code, mask: el.mask }) || setOpen(false)} className="option">
                  <img src={el.flag} alt="" />
                  <p>{el.code}</p>
                </div>
              )}
            </div>} */}
            <PhoneInput
              className="input_register"
              international
              countryCallingCodeEditable={false}
              defaultCountry="KG"
              flagUrl="./assets/img/country-flag-icons/3x2/{XX}.svg"
              value={value}
              onChange={setValue}
            />
          </div>
          <div className="input_box">
            <label className="label_form">E-mail</label>
            <input
              className="input_form"
              onChange={(e) =>
                setInputData({ ...inputData, email: e.target.value })
              }
              value={inputData.email}
              type="email"
              placeholder="E-mail"
            />
            {error.email && <p className="red">{error.email}</p>}
          </div>
          <div className="input_box">
            <label className="label_form">Пароль</label>
            <input
              className="input_form"
              onChange={(e) =>
                setInputData({ ...inputData, password: e.target.value })
              }
              value={inputData.password}
              type={visible ? "text" : "password"}
              placeholder="Пароль"
            />
            <span className="span-icon" onClick={() => setVisible(!visible)}>
              {" "}
              {visible ? <FaEye /> : <FaEyeSlash />}{" "}
            </span>
            {error.confirm_password && (
              <p className="red">{error.confirm_password}</p>
            )}
          </div>
          <div className="input_box hh">
            <label className="label_form">Повторите пароль</label>
            <input
              className="input_form"
              onChange={(e) =>
                setInputData({ ...inputData, confirm_password: e.target.value })
              }
              value={inputData.confirm_password}
              type={visible2 ? "text" : "password"}
              placeholder="Повторите пароль"
            />
            <span className="span-icon" onClick={() => setVisible2(!visible2)}>
              {" "}
              {visible2 ? <FaEye /> : <FaEyeSlash />}{" "}
            </span>
          </div>
          <p className="p_content">
            Нажимая на кнопку «Регистрация», Вы принимаете условия{" "}
            <a
              className="a_content"
              href="https://docs.google.com/document/d/13oK87PDT-KsJrR9TueQdnk9lFW_CUxaMOn6PT_FinOQ"
              target="blank"
            >
              Публичной оферты
            </a>{" "}
          </p>
          <div className="all-submit">
            <button
              disabled={loading}
              className="button_form"
              onSubmit={handleSubmit}
            >
              {loading ? <Loading color={"#fff"} /> : "Регистрация"}
            </button>
          </div>
          <p className="p_content">
            Уже есть аккаунт?{" "}
            <NavLink className="a_content" to="/login">
              Войти
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
