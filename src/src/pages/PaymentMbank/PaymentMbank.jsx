import React, { useEffect, useState } from "react";
import "./PaymentMbank.css";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import image from "../../img/mbank.webp";
import { InputMask } from "primereact/inputmask";
import Loading from "../../components/UI/Loading/Loading";
import { PiWarningCircleFill } from "react-icons/pi";
import axios from "axios";
import { url } from "../../Api";
import { MdPhone } from "react-icons/md";

const PaymentMbank = () => {
  const { info } = useParams();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendInfo = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    localStorage.setItem("phone", value);
    try {
      if (value !== "") {
        const data = {
          info,
          phone: value,
        };
        const response = await axios.post(url + "", data, {
          headers: { Authorization: `Token ${token}` },
        });
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch (error) {
      navigate("/payment-code/code");
      console.log(error);
    }
  };

  useEffect(() => {
    if (value !== "") {
      setError(false);
    }
  }, [value]);

  const price = 400;

  const currency = "KGS";

  return (
    <div className="payment_mbank">
      <Header>
        <h1>MBank</h1>
      </Header>
      <div className="container">
        <div className="center">
          <img className="image_payment" src={image} alt="" />
        </div>
        <h2>Оплата через MBank</h2>
        <div className="input_box">
          <label className="label_form">
            Введите номер телефона аккаунта MBank
          </label>
          <div className="relative_pay">
            <span className="absolute_pay">
              <MdPhone color="var(--blue)" size={20} />
            </span>
            <InputMask
              className={`input_form pay ${error && "error"}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              mask="999  999 99 99 99"
              placeholder="XXX  XXX-XX-XX-XX"
            />
          </div>
          {error && <p className="red">Поле не может быть пустым</p>}
        </div>
        <div className="warning">
          <PiWarningCircleFill className="icon" size={34} />
          <p>Вам придет SMS с кодом для подтверждения действия</p>
        </div>
        <p className="sum">
          Сумма пополнения:{" "}
          <p className="strong">
            {price} {currency}
          </p>
        </p>
        <button disabled={loading} onClick={sendInfo} className="button_form">
          {loading ? <Loading color={"#fff"} /> : "Продолжить"}
        </button>
      </div>
    </div>
  );
};

export default PaymentMbank;
