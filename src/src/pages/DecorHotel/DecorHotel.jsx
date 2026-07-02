import React, { useEffect, useState } from "react";
import "./DecorHotel.css";
import Header from "../../components/Header/Header";
import axios from "axios";
import { url } from "../../Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/UI/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { PiCoffee } from "react-icons/pi";
import { IoPricetagsOutline } from "react-icons/io5";
import { deepAction } from "../../store/actions/deep";
import FormDetails from "../Decor/eraervg";
import { formatDateWithoutYear } from "../../components/utils/FormatDateWithoutYear";

const DecorHotel = ({ Alert, count, requests, dateNightFrom }) => {
  const { code } = useParams();
  console.log(requests, dateNightFrom);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [valueDecor, setValueDecor] = useState({
    first_name: "",
    phone: "",
    email: "",
    travels: [],
  });
  const [local, setLocal] = useState("");
  const { personal } = useSelector((state) => state.personal);
  const navigate = useNavigate();
  const location = useLocation();
  const { reisData } = useSelector((state) => state.reis);
  const { price } = useSelector((state) => state.price);
  const [next, setNext] = useState(false);
  const dispatch = useDispatch();
  const [formDataList, updateFormDataList] = useState([]);

console.log(price);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    }
  }, [location]);

  const headers = {
    Authorization: `Token ${local}`,
  };

  useEffect(() => {
    setValueDecor({
      ...valueDecor,
      first_name: personal.first_name,
      phone: personal.phone,
      email: personal.email,
      travels: formDataList,
    });
  }, [formDataList]);

  useEffect(() => {
    dispatch(deepAction([]));
  }, []);

  const hundleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataNew = {
        hotelid: code,
        first_name: valueDecor.first_name,
        phone: valueDecor.phone,
        email: valueDecor.email,
        price: price.price,
        currency:
          price.currency === "EUR" ? 1 : price.currency === "USD" ? 2 : null,
        travelers: valueDecor.travels,
      };
      const response = await axios.post(url + "/hotel/", dataNew, {
        headers,
      });
      if (response.data.response === true) {
        const datasing = {
          amount: response.data?.amount,
          currency: "KGS",
          status: null,
          timeout: null,
          datasis: response.data,
          deeplink: response.data?.deeplink,
        };
        dispatch(deepAction(datasing));
        navigate("/payment");
      } else {
        setError(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FuncData = (newFormData) => {
    const isExistingForm = formDataList.some(
      (formData) => formData.id === newFormData.id
    );
    if (isExistingForm) {
      updateFormDataList((prevList) =>
        prevList.filter((formData) => formData.id !== newFormData.id)
      );
    }

    updateFormDataList((prevList) => [...prevList, newFormData]);
  };

  const data_tourist = count.count1 + count.count2;

  return (
    <div className="decor_hotel">
      <Header>
        <h1>Оформление отеля</h1>
      </Header>
      <div className="container">
        <div className="hotel">
          <div className="tour_block">
            <div className="block">
              <div>
                <img
                  className="image"
                  src={reisData?.images?.image[0]}
                  alt=""
                />
              </div>
              <div className="flex">
                <dir>
                  <h2>{reisData.name}</h2>
                  <p className="text_p">Отель</p>
                </dir>
                <div className="icons_flex">
                  {Array.from({ length: reisData.stars }, (_, starIndex) => (
                    <span key={starIndex}>
                      <FaStar className="icon" size={15} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {reisData.description && (
              <>
                <div className="hr"></div>
                <div>
                  <p
                    className="description"
                    style={{ overflow: "hidden", height: next ? "auto" : 28 }}
                  >
                    <div className="filt_grid">
                      <div className="filt_box">
                        <p>Дата прибывания</p>
                        <h1> {formatDateWithoutYear(dateNightFrom)}</h1>
                      </div>
                      <div className="filt_box prew">
                        <p>На сколько</p>
                        <h1>
                          {" "}
                          {requests.budget[0]}{" "}
                          {requests.budget[1] !== requests.budget[0] &&
                            `- ${requests.budget[1]}`}{" "}
                          ночей{" "}
                        </h1>
                      </div>
                    </div>
                  </p>
                  <p onClick={() => setNext(!next)} className="next">
                    Подробнее{" "}
                    {next ? (
                      <MdKeyboardArrowUp className="icon_next" size={20} />
                    ) : (
                      <MdKeyboardArrowDown className="icon_next" size={20} />
                    )}{" "}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="tour_block">
            {reisData.meallist && (
              <>
                <div className="blocks">
                  <PiCoffee className="icons" size={23} />
                  <div>
                    <h3 className="services">
                      {React.createElement("div", {
                        dangerouslySetInnerHTML: {
                          __html: reisData.meallist,
                        },
                      })}
                    </h3>
                    <p className="text">питание</p>
                  </div>
                </div>
                <div className="hr"></div>
              </>
            )}
            <div className="blocks">
              <IoPricetagsOutline className="icons" size={23} />
              <div>
                <h3>
                  {price?.price} {price?.currency}
                </h3>
                <p className="text">цена</p>
              </div>
            </div>
          </div>
          <div>{dateNightFrom}</div>
        </div>
        <form onSubmit={hundleSubmit} className="formm">
          <div className="input_box">
            <label className="label_form">Имя</label>
            <input
              className="input_form"
              value={valueDecor.first_name}
              onChange={(e) =>
                setValueDecor({ ...valueDecor, first_name: e.target.value })
              }
              disabled={true}
              type="text"
              placeholder="Ваше имя"
              name="phone"
            />
            {error.first_name && <p className="red">{error.first_name}</p>}
          </div>
          <div className="input_box">
            <label className="label_form">Телефон</label>
            <input
              className="input_form"
              value={valueDecor.phone}
              onChange={(e) =>
                setValueDecor({ ...valueDecor, phone: e.target.value })
              }
              disabled={true}
              type="text"
              placeholder="Телефон"
              name="phone"
            />
            {error.phone && <p className="red">{error.phone}</p>}
          </div>
          <div className="input_box">
            <label className="label_form">E-Mail</label>
            <input
              className="input_form"
              value={valueDecor.email}
              onChange={(e) =>
                setValueDecor({ ...valueDecor, email: e.target.value })
              }
              disabled={true}
              type="email"
              placeholder="Электронная почта"
              name="phone"
            />
            {error.email && <p className="red">{error.email}</p>}
          </div>
          {data_tourist >= 1 ? (
            <div className="box_save">
              {Array.from({
                length: data_tourist,
              }).map((el, id) => (
                <FormDetails
                  key={id}
                  Alert={Alert}
                  gg={id}
                  FuncData={FuncData}
                />
              ))}
            </div>
          ) : (
            ""
          )}
          <button
            style={{
              marginTop: 20,
            }}
            disabled={loading}
            onSubmit={hundleSubmit}
            className="button_form"
          >
            {loading ? <Loading color={"#fff"} /> : "Подтвердить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DecorHotel;
