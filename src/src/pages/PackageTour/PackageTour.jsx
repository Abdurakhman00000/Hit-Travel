import React, { useEffect, useState } from "react";
import "./PackageTour.css";
import Header from "../../components/Header/Header";
import hit_logo from "../../img/hit-logo.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../Api";
import Loader from "../../components/UI/Loader/Loader";
import Segments from "../../components/UI/Segments/Segments";
import Travelers from "./Travelers";
import { BiSupport } from "react-icons/bi";
import { jsPDF } from "jspdf";
import { renderAsync } from "docx-preview";

const PackegeTour = () => {
  const { id } = useParams();
  const [myTour, setMyTour] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = localStorage.getItem("token");

    const headers = {
      Authorization: `Token ${local}`,
    };

    axios
      .get(url + `/profile/manual-requests/${id}`, { headers })
      .then((response) => {
        setLoading(false);
        setMyTour(response.data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [id]);
  console.log(myTour);

  const formatDates = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      if (!token) {
        console.error("Токен отсутствует. Пожалуйста, выполните вход.");
        alert("Токен отсутствует. Пожалуйста, выполните вход.");
        return;
      }
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      if (!response.data || response.data.size === 0) {
        throw new Error("Файл пустой или отсутствует.");
      }

      const suggestedFileName = fileName || fileUrl.split("/").pop() || "file";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = suggestedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Файл успешно скачан:", suggestedFileName);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
      alert(
        "Не удалось скачать файл. Проверьте URL, токен или подключение к интернету."
      );
    }
  };

  return (
    <div className="detail_my_tour">
      <Header>
        <h1>Пакетный тур</h1>
      </Header>
      {loading ? (
        <div className="loading_div">
          <Loader />
        </div>
      ) : (
        <div className="container">
          <img
            style={{
              margin: "20px auto",
              width: "30%",
              display: "flex",
              justifyContent: "center",
            }}
            src={hit_logo}
            alt=""
          />
          <p
            style={{
              marginTop: 25,
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Номер заявки: {myTour.id_internal}
          </p>

          <div className="meneger_div">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BiSupport size={32} color="var(--blue)" />
            </div>
            <div>
              <h1 className="title_my">
                {myTour?.manager_surname} {myTour?.manager_name}{" "}
                {myTour?.manager_sname}
              </h1>
              <p className="text_p">Ваш персональный менеджер</p>
            </div>
          </div>

          <div className="bay_user">
            <h2>Компания</h2>
            <div className="tour_block gridden">
              <div className="grid">
                <p className="label">Название</p>
                <p className="bold">{myTour?.company_name}</p>
              </div>
              <div className="grid">
                <p className="label">Офис</p>
                <p className="bold">{myTour?.office_name}</p>
              </div>
            </div>
          </div>

          <div className="bay_user">
            <h2>Статус</h2>
            <div className="tour_block gridden">
              <div className="grid">
                <p className="label">Статус</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    style={{
                      borderRadius: 3,
                      background: myTour.status_color,
                      padding: "3px 16px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: "500",
                        color: "var(--white)",
                      }}
                    >
                      {myTour.status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid">
                <p className="label">Статус платежа</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    style={{
                      borderRadius: 3,
                      border: "1px solid var(--gray)",
                      padding: "3px 16px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {myTour.status_pay_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bay_user">
            <h2>Покупатель</h2>
            <div className="tour_block gridden">
              <h1 className="title_my">
                {myTour?.client_name} {myTour?.client_surname}{" "}
              </h1>
              {myTour?.client_phone_mobile && (
                <div className="grid">
                  <p className="label">Телефон</p>
                  <p className="bold">{myTour?.client_phone_mobile}</p>
                </div>
              )}
              {myTour?.client_email && (
                <div className="grid">
                  <p className="label">E-mail</p>
                  <p className="bold">{myTour?.client_email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bay_user">
            <h2>Услуги</h2>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {myTour.services.map((el, index) => (
                <div key={index} className="tour_block gridden mer">
                  <h1 className="title_my">{el.service_type}</h1>
                  {el.date_begin && el.date_end && (
                    <div className="grid">
                      <p className="label">Дата</p>
                      <p className="bold">
                        {formatDates(el.date_begin)} -{" "}
                        {formatDates(el.date_end)}
                      </p>
                    </div>
                  )}
                  {el.hotel && (
                    <div className="grid">
                      <p className="label">Название отеля</p>
                      <p className="bold">{el.hotel} </p>
                    </div>
                  )}
                  {el.description && (
                    <div className="grid">
                      <p className="label">Вылет</p>
                      <p className="bold">{el.description}</p>
                    </div>
                  )}
                  {el.country && (
                    <div className="grid">
                      <p className="label">Страна</p>
                      <p className="bold">{el.country}</p>
                    </div>
                  )}
                  {el.сity && (
                    <div className="grid">
                      <p className="label">Город</p>
                      <p className="bold">{el.сity}</p>
                    </div>
                  )}
                  {el.service_type === "Страховка" && (
                    <div className="grid">
                      <p className="label">Период страхования</p>
                      <p className="bold">
                        {formatDates(el.date_begin)} -{" "}
                        {formatDates(el.date_end)}
                      </p>
                    </div>
                  )}
                  {el.course && (
                    <div className="grid">
                      <p className="label">Путь</p>
                      <p className="bold">{el.course}</p>
                    </div>
                  )}
                  {el.hotel_type && (
                    <div className="grid">
                      <p className="label">Категория номера</p>
                      <p className="bold">{el.hotel_type}</p>
                    </div>
                  )}
                  {el.hotel_place && (
                    <div className="grid">
                      <p className="label">Тип размещения</p>
                      <p className="bold">{el.hotel_place}</p>
                    </div>
                  )}
                  {el.nutrition && (
                    <div className="grid">
                      <p className="label">Тип питания</p>
                      <p className="bold">{el.nutrition}</p>
                    </div>
                  )}
                  {el.tourists_count && (
                    <div className="grid">
                      <p className="label">Кол-во пассажиров</p>
                      <p className="bold">
                        {el.tourists_count} / {el.tourists_child_count} /
                        {el.tourists_baby_count}{" "}
                      </p>
                    </div>
                  )}
                  {el?.flights && el?.flights?.length > 0 && (
                    <div className="bay_user">
                      <h2>Перелет</h2>
                      <div
                        style={{
                          padding: 0,
                          paddingBottom: 16,
                        }}
                        className="tour_block"
                      >
                        {el.flights.map((el, index) => (
                          <div style={{ marginTop: 16 }} key={index}>
                            <Segments
                              from_time={el.time_begin}
                              from_date={el.date_begin}
                              from_city={el.course_begin}
                              from_country={el.code_begin}
                              to_time={el.time_end}
                              to_date={el.date_end}
                              to_city={el.course_end}
                              to_country={el.code_end}
                              hour={""}
                              minute={""}
                              carrier={""}
                              aircraft={""}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {myTour?.files && myTour.files.length > 0 && (
            <div className="bay_user">
              <h2>Файлы</h2>
              <div
                className="tour_block gridden "
                style={{
                  height: "150px",
                  overflowY: "auto",
                  width: "100%",
                  border: "1px solid #ccc",
                }}
              >
                {myTour.files.map((file, index) => (
                  <div
                    key={index}
                    className=""
                    style={{ display: "flex", gap: "30px" }}
                  >
                    <button
                      onClick={() => handleDownload(file.url, file.filename)}
                      style={{
                        padding: "8px 8px",
                        backgroundColor: "var(--blue)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Скачать
                    </button>
                    <p className="label">{file.filename}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {myTour?.tourists && (
            <div className="bay_user">
              <h2>Путешественники</h2>
              {myTour?.tourists.map((el, id) => (
                <Travelers key={id} data={el} index={id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PackegeTour;
