import React, { useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import { url } from "../../Api";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../../components/UI/Loading/Loading";
import "./Login.css";

const Login = ({ Alert }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorLogin([]); // Очищаем прошлые ошибки перед новым запросом

    try {
      // Отправляем строго email и password, как требует ваш бэкенд
      const response = await axios.post(url + "/auth/login", {
        email: email,
        password: password,
      });

      setLoading(false);

      // Обработка успешного входа (Статус 200 OK)
      if (response.data.response === true) {
        localStorage.setItem("email", email);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false);

      // Выводим точный JSON-ответ от Django в консоль браузера
      console.log("Детали ошибки от Django:", error.response?.data);

      if (error.response && error.response.data) {
        const serverData = error.response.data;

        // 1. Если аккаунт не подтвержден (Ваш бэкенд возвращает статус 400 и isactivated: false)
        if (serverData.isactivated === false) {
          Alert(serverData.message, "error");
          navigate("/activation");
          return;
        }

        // 2. Если пришли системные ошибки валидации полей от LoginSerializer
        setErrorLogin(serverData);

        // 3. Если пришла общая текстовая ошибка (например, неверный пароль или email)
        if (serverData.message) {
          Alert(serverData.message, "error");
        }
      } else {
        Alert("Произошла ошибка сети. Проверьте подключение.", "error");
      }
    }
  };

  return (
    <div className="login">
      <Header>
        <h1>Войти</h1>
      </Header>
      <div className="container">
        <div className="login_from">
          <form onSubmit={handleSubmit}>
            <div className="input_box">
              <label className="label_form">E-mail</label>
              <input
                className="input_form"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
              />
              {errorLogin.email && <p className="red">{errorLogin.email}</p>}
            </div>
            <div className="input_box d">
              <label className="label_form">Пароль</label>
              <input
                className="input_form"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={visible ? "text" : "password"}
                placeholder="Пароль"
              />
              <span className="span-icon" onClick={() => setVisible(!visible)}>
                {visible ? <FaEye /> : <FaEyeSlash />}{" "}
              </span>
              {errorLogin.password && (
                <p className="red">{errorLogin.password}</p>
              )}
            </div>
            <NavLink className="forgot" to="/forgot-password">
              Забыли пароль?
            </NavLink>
            <button type="submit" className="button_form">
              {loading ? <Loading color={"#fff"} /> : "Войти"}
            </button>
            <p className="p_content">
              Ещё нет аккаунта?{" "}
              <NavLink className="a_content" to="/register">
                Зарегистрироваться
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
