import React, { useEffect, useState } from "react";
import "../DetailMyTour/DetailMyTour.css";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlane, FaStar } from "react-icons/fa";
import { url } from "../../Api";
import details_icon7 from "../../img/detais_icon7.svg";
import line from "../../img/Line.svg";
import Loader from "../../components/UI/Loader/Loader";
import Travelers from "./Travelers";
import { useDispatch } from "react-redux";
import { deepAction } from "../../store/actions/deep";

const DetailMyHotel = () => {
  const { id } = useParams();
  const [myHotel, setMyHotel] = useState();
  const [laoding, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const local = localStorage.getItem("token");

    const headers = {
      Authorization: `Token ${local}`,
    };

    axios
      .get(url + `/hotel/${id}`, { headers })
      .then((responce) => {
        setLoading(false);
        setMyHotel(responce.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const online = () => {
    const datasing = {
      amount: myHotel?.amount,
      currency: "KGS",
      status: null,
      timeout: null,
      datasis: {
        transaction_id: myHotel.transaction_id,
        payler_url: myHotel.payler_url,
      },
      deeplink: myHotel?.deeplink,
    };
    dispatch(deepAction(datasing));
    navigate("/payment");
  };

  return (
    <div className="detail_my_tour">
      <Header>
        <h1>Мой тур</h1>
      </Header>
      {laoding ? (
        <div className="loading_div">
          <Loader />
        </div>
      ) : (
        <div className="container">
          <div className="my_box">
            <p className="text_p">№ {myHotel?.id}</p>
            <p
              onClick={() => navigate(`/reis/${myHotel?.hotelid}`)}
              style={{ color: "var(--blue)" }}
              className="text_p"
            >
              Детали отеля
            </p>
          </div>
          <div className="my_contant">
            <img
              src={"https:" + myHotel?.data?.hotel?.images?.image[0]}
              alt=""
            />
            <div className="stars_div">
              {Array.from(
                { length: myHotel?.data?.hotel?.stars },
                (_, starIndex) => (
                  <span key={starIndex}>
                    <FaStar className="icon" size={20} />
                  </span>
                )
              )}
            </div>
            <h1 className="title_my">{myHotel?.data?.hotel?.name}</h1>
            <p style={{ textAlign: "center" }} className="text_p">
              {myHotel?.data?.hotel?.country}, {myHotel?.data?.hotel?.region}
            </p>
          </div>
          {/* <div className="bun_flex">
            <p className="price">
              16 972 <u>c</u>{" "}
            </p>
            <p className="text_p">
              Кешбек <IoIosArrowForward color="var(--black)" size={10} />{" "}
            </p>
          </div> */}
          <div className="bun">
            {/* <p className="bold">Необходимо предоплата</p> */}
            <p className="text_p text-center">
              Необходимо внесите предоплату, чтобы мы забранировали текущий
              отель
            </p>
            <div className="tour-price-wrap">
              <div className="flex">
                <h3>Стоимость отеля</h3>
                <h3>{myHotel?.price.toFixed(2)} KGS</h3>
              </div>
              <div className="flex">
                <h3>Оплачено</h3>
                <h3>{myHotel?.paid} KGS</h3>
              </div>
              <div className="flex">
                <h3>К оплате</h3>
                <h3 style={{ fontSize: 20 }} className="price">
                  {myHotel?.amount.toFixed(2)} KGS
                </h3>
              </div>
              <button onClick={online} className="button_form">
                Оплатить онлайн
              </button>
            </div>
            {/* <button className="button_form">
              <p className="text_p">Внести предоплату</p>
              <div style={{ display: "flex", gap: 5 }}>
                {myHotel?.tour?.price} {myHotel?.tour?.currency}
              </div>
            </button>
            <a href="">Что входит в турпакет?</a> */}
          </div>
          {myHotel?.manager && (
            <div className="meneger_div">
              <img src={myHotel?.manager_photo} alt="" />
              <div>
                <h1 className="title_my">{myHotel?.manager}</h1>
                <p className="text_p">Ваш персональный менеджер в этом туре</p>
                <div className="div_flex">
                  <div className="link">
                    <a href={myHotel?.manager_whatsapp} target="blank">
                      Whatsapp
                    </a>
                  </div>
                  <div className="link_br"></div>
                  <div className="link">
                    <a href={"tel:" + myHotel?.manager_phone} target="blank">
                      Позвонить
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bay_user">
            <h2>Покупатель</h2>
            <div className="tour_block gridden">
              <div className="grid">
                <h1 className="title_my">
                  {" "}
                  {myHotel?.user?.last_name} {myHotel?.user?.first_name}{" "}
                </h1>
                <div>
                  {/* <div
                    className={`div_btn ${
                      myHotel?.user?.gender === "Женщина" ? "red" : "blue"
                    }`}
                  >
                    {myHotel?.user?.gender}
                  </div> */}
                </div>
              </div>
              <div className="grid">
                <p className="label">Телефон</p>
                <p className="bold">{myHotel?.user?.phone}</p>
              </div>
              <div className="grid">
                <p className="label">E-mail</p>
                <p className="bold">{myHotel?.user?.email}</p>
              </div>
              <div className="grid">
                <p className="label">Гражданство</p>
                <p className="bold">{myHotel?.user?.county}</p>
              </div>
              <div className="grid">
                <p className="label">Паспорт</p>
                <p className="bold">{myHotel?.user?.passport_id}</p>
              </div>
            </div>
          </div>
          {/* {myHotel?.travelers[0] && (
            <div className="bay_user">
              <h2>Путешественники</h2>
              {myHotel?.travelers.map((el, id) => (
                <Travelers key={id} data={el} />
              ))}
            </div>
          )} */}
          {/* {myHotel?.flights && (
            <div className="bay_user">
              <h2>Перелет</h2>
              {myHotel?.flights?.iserror ? (
                ""
              ) : (
                <div className="tour_block">
                  <div className="tour_block_box">
                    <FaPlane color="var(--blue)" size={25} />
                    <h2>Перелет</h2>
                  </div>
                  <div className="hr_up"></div>
                  <div className="reis_div">
                    <img
                      className="fly"
                      src={myHotel?.flights[0]?.forward[0]?.company?.thumb}
                      alt=""
                    />
                    <p className="center"></p>
                    <div className="gold">
                      {myHotel?.flights[0].forward[0].number}
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>
                        {myHotel?.flights[0].forward[0].departure.port.id}
                      </h2>
                      <p>
                        {
                          myHotel?.flights[0].forward[0].departure.port
                            .shortName
                        }
                      </p>
                    </div>
                    <div className="air">
                      <img src={line} alt="" />
                      <img
                        className="image_center"
                        src={details_icon7}
                        alt=""
                      />
                      <img src={line} alt="" />
                    </div>
                    <div className="left">
                      <h2>{myHotel?.flights[0].forward[0].arrival.port.id}</h2>
                      <p>
                        {myHotel?.flights[0].forward[0].arrival.port.shortName}
                      </p>
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>{myHotel?.flights[0].forward[0].departure.time}</h2>
                      <p>{myHotel?.flights[0].forward[0].departure.date}</p>
                    </div>
                    <p className="center"></p>
                    <div className="left">
                      <h2>{myHotel?.flights[0].forward[0].arrival.time}</h2>
                      <p>{myHotel?.flights[0].forward[0].arrival.date}</p>
                    </div>
                  </div>
                  <div className="hr_up"></div>
                  <div className="reis_div">
                    <img
                      className="fly"
                      src={myHotel?.flights[0].backward[0].company.thumb}
                      alt=""
                    />
                    <p className="center"></p>
                    <div className="gold">
                      {myHotel?.flights[0].backward[0].number}
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>
                        {myHotel?.flights[0].backward[0].departure.port.id}
                      </h2>
                      <p>
                        {
                          myHotel?.flights[0].backward[0].departure.port
                            .shortName
                        }
                      </p>
                    </div>
                    <div className="air">
                      <img src={line} alt="" />
                      <img
                        className="image_center"
                        src={details_icon7}
                        alt=""
                      />
                      <img src={line} alt="" />
                    </div>
                    <div className="left">
                      <h2>{myHotel?.flights[0].backward[0].arrival.port.id}</h2>
                      <p>
                        {myHotel?.flights[0].backward[0].arrival.port.shortName}
                      </p>
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>{myHotel?.flights[0].backward[0].departure.time}</h2>
                      <p>{myHotel?.flights[0].backward[0].departure.date}</p>
                    </div>
                    <p className="center"></p>
                    <div className="left">
                      <h2>{myHotel?.flights[0].backward[0].arrival.time}</h2>
                      <p>{myHotel?.flights[0].backward[0].arrival.date}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default DetailMyHotel;
