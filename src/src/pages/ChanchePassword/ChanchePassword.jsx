import React, { useEffect, useState } from "react";
import "./ChanchePassword.css";
import Header from "../../components/Header/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { url } from "../../Api";
import Loading from "../../components/UI/Loading/Loading";

const ChanchePassword = ({ Alert }) => {
  const [visible, setVisible] = useState({
    visible1: false,
    visible2: false,
    visible3: false,
  });
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    }
  }, []);

  const headers = {
    Authorization: `Token ${local}`,
  };

  const ChangeFunc = async (e) => {
    e.preventDefault();
    if (
      password.new_password !== "" &&
      password.old_password !== "" &&
      password.confirm_password !== ""
    ) {
      if (password.new_password == password.confirm_password) {
        if (
          password.new_password.length >= 8 &&
          password.confirm_password.length >= 8
        ) {
          setLoading(true);
          try {
            const response = await axios.post(
              url + "/auth/new-password",
              {
                old_password: password.old_password,
                new_password: password.new_password,
                confirm_password: password.confirm_password,
              },
              { headers }
            );
            if (response.data.response === true) {
              Alert(response.data.message, "success");
              setPassword({
                ...password,
                old_password: "",
                new_password: "",
                confirm_password: "",
              });
            } else {
              Alert(response.data.message, "error");
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.log(error);
          }
        } else {
          Alert("Новый пароль должен быть не менее 8-ми символов", "error");
        }
      } else {
        Alert("Пароли не совпадают", "error");
      }
    } else {
      Alert("Заполните все поля!", "error");
    }
  };

  return (
    <div className="chanche_password">
      <Header>
        <h1>Изменить пароль</h1>
      </Header>
      <div className="container">
        <form onSubmit={ChangeFunc} className="form_password">
          <div className="input_box">
            <label className="label_form">Старый пароль</label>
            <input
              className="input_form"
              value={password.old_password}
              onChange={(e) =>
                setPassword({ ...password, old_password: e.target.value })
              }
              type={visible.visible1 ? "text" : "password"}
              placeholder="Старый пароль"
            />
            <span
              className="span-icon"
              onClick={() =>
                setVisible({ ...visible, visible1: !visible.visible1 })
              }
            >
              {visible.visible1 ? <FaEye /> : <FaEyeSlash />}{" "}
            </span>
          </div>
          <div className="input_box">
            <label className="label_form">Новый пароль</label>
            <input
              className="input_form"
              value={password.new_password}
              onChange={(e) =>
                setPassword({ ...password, new_password: e.target.value })
              }
              type={visible.visible2 ? "text" : "password"}
              placeholder="Новый пароль"
            />
            <span
              className="span-icon"
              onClick={() =>
                setVisible({ ...visible, visible2: !visible.visible2 })
              }
            >
              {visible.visible2 ? <FaEye /> : <FaEyeSlash />}{" "}
            </span>
          </div>
          <div className="input_box">
            <label className="label_form">Повторите пароль</label>
            <input
              className="input_form"
              value={password.confirm_password}
              onChange={(e) =>
                setPassword({ ...password, confirm_password: e.target.value })
              }
              type={visible.visible3 ? "text" : "password"}
              placeholder="Повторите пароль"
            />
            <span
              className="span-icon"
              onClick={() =>
                setVisible({ ...visible, visible3: !visible.visible3 })
              }
            >
              {visible.visible3 ? <FaEye /> : <FaEyeSlash />}{" "}
            </span>
          </div>
          <button disabled={loading} onSubmit={ChangeFunc} className="button_form">
            {loading ? <Loading color={"#fff"} /> : "Изменить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChanchePassword;
