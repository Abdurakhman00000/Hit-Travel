import React, { useState } from "react";
import "./Forgot.css";
import Header from "../../components/Header/Header";
import Loading from "../../components/UI/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { url } from "../../Api";
import axios from "axios";

const Forgot = ({ Alert }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(url + "/auth/password-reset/request", {
        email,
      });
      if (response.data.response === true) {
        Alert(response.data.message, "success");
        navigate("/login");
      } else {
        if (response.data.message) {
          Alert(response.data.message, "error");
        }
        setError(response.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  return (
    <div className="forgot">
      <Header>
        <h1>Сбросить пороль</h1>
      </Header>
      <div className="container">
        <form onSubmit={handleSubmit} className="form_forgot">
          <p>Укажите ваш Email, который использовался при регистрации</p>
          <div className="input_box">
            <label className="label_form">E-mail</label>
            <input
              className="input_form"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="E-mail"
            />
            {error.email && <p className="red">{error.email}</p>}
          </div>
          <button onSubmit={handleSubmit} className="button_form">
            {loading ? <Loading color={"#fff"} /> : "Отправить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
