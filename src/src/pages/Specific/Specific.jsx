import React, { useEffect, useState } from "react";
import "./Specific.css";
import { IoCameraOutline } from "react-icons/io5";
import Header from "../../components/Header/Header";
import axios from "axios";
import { url } from "../../Api";

const Specific = ({ Alert, personal, ChagePersonal, headers }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photo, setPhoto] = useState(false);
  const messages = true;

  useEffect(() => {
    setName(personal.first_name);
    setLastName(personal.last_name);
  }, []);

  const handleImageChange = (event) => {
    const imageFile = event.target.files && event.target.files[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("photo", imageFile);

      axios
        .post(url + "/profile/update-photo", formData, { headers })
        .then((response) => {
          if (response.data) {
            ChagePersonal();
          }
          Alert("Успешно сохранено!", "success");
        })
        .catch((error) => {
          console.log(error);
          Alert("Ошибка загрузки изображения", "error");
        });
    }
  };

  const NameChange = async (e) => {
    e.preventDefault();
    try {
      const newDataName = {
        first_name: name,
        last_name: lastName,
      };
      const response = await axios.post(
        url + `/profile/update-info`,
        newDataName,
        {
          headers,
        }
      );
      if (response.data.response == true) {
        Alert(response.data.message, "success");
        ChagePersonal();
      }
    } catch (error) {
      console.log(error);
      Alert("Ошибка", "error");
    }
  };

  return (
    <div className="specific">
      {photo && (
        <div onClick={() => setPhoto(false)} className="photo_big">
          <img src={personal.photo} alt="" />
        </div>
      )}
      <Header messages={messages}>
        <h1>Контактные данные</h1>
      </Header>
      <div className="container">
        <div className="nav_block">
          <div className="img_save">
            <img onClick={() => setPhoto(true)} src={personal.photo} alt="" />
            <form onSubmit={handleImageChange}>
              <label>
                <IoCameraOutline className="icon" size={30} />
                <input
                  className="input_form"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </form>
          </div>
        </div>
        <div className="input_save">
          <form onSubmit={NameChange}>
            <div className="input_box">
              <label className="label_form">Номер телефона</label>
              <input
                className="input_form not"
                disabled={true}
                value={personal.phone}
                type="text"
                placeholder="Телефон"
              />
            </div>
            <div className="input_box">
              <label className="label_form">E-mail</label>
              <input
                disabled={true}
                className="input_form not"
                value={personal.email}
                type="text"
                placeholder="E-mail"
              />
            </div>
            <div className="input_box">
              <label className="label_form">Имя</label>
              <input
                className="input_form"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Имя"
              />
            </div>
            <div className="input_box">
              <label className="label_form">Фамилия</label>
              <input
                className="input_form"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Фамилия"
              />
            </div>
            <button onClick={NameChange} className="button_form">
              Сохранить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Specific;
