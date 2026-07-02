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
    }
    if (code.length === 6) {
      
      setLoading(true);
      try {
        // const response = await axios.post(url + "/auth/verify-phone", {
        //   code,
        //   phone: phone,
        // }
      // );
const response = await axios.post(
  url + "/auth/verify-phone",
  { code, phone },
  {
    headers: {
      "Content-Type": "application/json",
      // 'X-CSRFToken': 'тут-токен если нужен, чаще нужен в Django'
    },
  }
);
console.log(response.data);
        
        if (response.data.response === true) {
          console.log(response.data.code)
          localStorage.setItem("phone", response.data.phone);
          localStorage.setItem("token", response.data.token);
          Alert(response.data.message, "success");
          navigate("/dashboard");
        } else {
          Alert(response.data.response, "error");
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const Again = async () => {
    const phone = localStorage.getItem("phone");
    try {
      const response = await axios.post(url + "/auth/re-send", {
        phone: phone,
      });
      if (response.data.response == true) {
        Alert(response.data.message, "success");
      } else {
        Alert(response.data.message, "error");
      }
    } catch (error) {
      console.error(error);
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
              onSubmit={fetchData}
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


