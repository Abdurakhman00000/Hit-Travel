import React, { useState, useEffect } from "react";
import "./Activation.css";
import Header from "../../components/Header/Header";
import { url } from "../../Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/UI/Loading/Loading";

const Activation = ({ Alert }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("phone");
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const fetchData = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      Alert("Введите шестизначный код", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        url + "/auth/verify-phone",
        { code, phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setLoading(false);
      console.log(response.data);

      if (response.data.response === true) {
        localStorage.setItem("token", response.data.token);
        Alert(response.data.message || "Успешно!", "success");
        navigate("/dashboard");
      } else {
        Alert(response.data.message || "Ошибка верификации", "error");
      }
    } catch (error) {
      setLoading(false);
      console.error(error.response?.data);

      if (error.response && error.response.data) {
        const serverErrors = error.response.data;
        if (serverErrors.code) Alert(`Поле Код: ${serverErrors.code}`, "error");
        if (serverErrors.phone)
          Alert(`Поле Телефон: ${serverErrors.phone}`, "error");
      } else {
        Alert("Произошла сетевая ошибка. Проверьте подключение.", "error");
      }
    }
  };

  const Again = async () => {
    const savedPhone = localStorage.getItem("phone");

    if (!savedPhone) {
      Alert("Номер телефона не найден. Перезапустите регистрацию.", "error");
      return;
    }

    const cleanPhone = savedPhone.replace(/\D/g, "");

    try {
      const response = await axios.post(url + "/auth/re-send", {
        phone: cleanPhone,
      });

      if (response.data.response === true) {
        Alert(response.data.message || "Код отправлен повторно", "success");
      } else {
        Alert(response.data.message || "Не удалось отправить код", "error");
      }
    } catch (error) {
      console.error(error.response?.data);

      if (error.response && error.response.data) {
        const serverData = error.response.data;
        if (serverData.message) {
          Alert(serverData.message, "error");
        }
      } else {
        Alert(
          "Не удалось связаться с сервером для повторной отправки",
          "error",
        );
      }
    }
  };

  return (
    <div>
      <Header>
        <h1>Вход в профиль</h1>
      </Header>
      <div className="container">
        <div className="activation">
          <p>
            Введите регистрационный код, высланный на указанный номер телефона
          </p>
          <form onSubmit={fetchData}>
            <input
              style={{ textAlign: "center" }}
              className="input_form input_full_border"
              value={code}
              type="number"
              placeholder="Введите код"
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              style={{ marginTop: 20 }}
              disabled={loading}
              type="submit"
              className="button_form"
            >
              {loading ? <Loading color={"#fff"} /> : "Подвердить"}
            </button>
          </form>
          <p onClick={Again} className="re_send">
            Отправить снова
          </p>
        </div>
      </div>
    </div>
  );
};

export default Activation;
