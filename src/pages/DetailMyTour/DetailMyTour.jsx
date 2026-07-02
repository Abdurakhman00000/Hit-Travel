import React, { useEffect, useState } from "react";
import "./DetailMyTour.css";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlane, FaStar } from "react-icons/fa";
import { url } from "../../Api";
import { MdOutlineDateRange } from "react-icons/md";
import { LiaBedSolid } from "react-icons/lia";
import details_icon7 from "../../img/detais_icon7.svg";
import line from "../../img/Line.svg";
import { BsShieldCheck } from "react-icons/bs";
import { IoBusOutline } from "react-icons/io5";
import { PiCoffee } from "react-icons/pi";
import Loader from "../../components/UI/Loader/Loader";
import Travelers from "./Travelers";
import { useDispatch } from "react-redux";
import { deepAction } from "../../store/actions/deep";

const DetailMyTour = () => {
  const { id } = useParams();
  const [myTour, setMyTour] = useState();
  const [laoding, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const local = localStorage.getItem("token");

    const headers = {
      Authorization: `Token ${local}`,
    };

    axios
      .get(url + `/profile/detail-my-tour/${id}`, { headers })
      .then((responce) => {
        setLoading(false);
        setMyTour(responce.data[0]);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const online = () => {
    const datasing = {
      amount: myTour?.amount,
      currency: "KGS",
      status: null,
      timeout: null,
      datasis: {
        transaction_id: myTour.transaction_id,
        payler_url: myTour.payler_url,
      },
      deeplink: myTour?.deeplink,
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
            <p className="text_p">№ {myTour?.id}</p>
            <p
              onClick={() => navigate(`/reis/${myTour?.tour?.hotelcode}`)}
              style={{ color: "var(--blue)" }}
              className="text_p"
            >
              Детали отеля
            </p>
          </div>
          <div className="my_contant">
            <img src={myTour?.tour?.hotelpicturebig} alt="" />
            <div className="stars_div">
              {Array.from(
                { length: myTour?.tour?.hotelstars },
                (_, starIndex) => (
                  <span key={starIndex}>
                    <FaStar className="icon" size={20} />
                  </span>
                )
              )}
            </div>
            <h1 className="title_my">{myTour?.tour?.hotelname}</h1>
            <p style={{ textAlign: "center" }} className="text_p">
              {myTour?.tour?.countryname}, {myTour?.tour?.hotelregionname}
            </p>
            <div className="blue_div_flex">
              <div className="blue_div">{myTour?.tour?.flydate}</div>
              <div className="blue_div">{myTour?.tour?.nights} ночей</div>
            </div>
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
              Необходимо внесите предоплату, чтобы мы забранировали текущий тур
            </p>
            <div className="tour-price-wrap">
              <div className="flex">
                <h3>Стоимость тура</h3>
                <h3>{myTour?.price.toFixed(2)} KGS</h3>
              </div>
              <div className="flex">
                <h3>Использованные бонусы</h3>
                <h3>{myTour?.bonus} KGS</h3>
              </div>
              <div className="flex">
                <h3>Оплачено</h3>
                <h3>{myTour?.paid} KGS</h3>
              </div>
              <div className="flex">
                <h3>К оплате</h3>
                <h3 style={{ fontSize: 20 }} className="price">
                  {myTour?.amount.toFixed(2)} KGS
                </h3>
              </div>
              <button onClick={online} className="button_form">
                Оплатить онлайн
              </button>
            </div>
            {/* <button className="button_form">
              <p className="text_p">Внести предоплату</p>
              <div style={{ display: "flex", gap: 5 }}>
                {myTour?.tour?.price} {myTour?.tour?.currency}
              </div>
            </button>
            <a href="">Что входит в турпакет?</a> */}
          </div>
          {myTour?.manager && (
            <div className="meneger_div">
              <img src={myTour?.manager_photo} alt="" />
              <div>
                <h1 className="title_my">{myTour?.manager}</h1>
                <p className="text_p">Ваш персональный менеджер в этом туре</p>
                <div className="div_flex">
                  <div className="link">
                    <a href={myTour?.manager_whatsapp} target="blank">
                      Whatsapp
                    </a>
                  </div>
                  <div className="link_br"></div>
                  <div className="link">
                    <a href={"tel:" + myTour?.manager_phone} target="blank">
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
                  {myTour?.last_name} {myTour?.first_name}{" "}
                </h1>
                <div>
                  <div
                    className={`div_btn ${
                      myTour?.gender === "Женщина" ? "red" : "blue"
                    }`}
                  >
                    {myTour?.gender}
                  </div>
                </div>
              </div>
              <div className="grid">
                <p className="label">Телефон</p>
                <p className="bold">{myTour?.phone}</p>
              </div>
              <div className="grid">
                <p className="label">E-mail</p>
                <p className="bold">{myTour?.email}</p>
              </div>
              <div className="grid">
                <p className="label">Гражданство</p>
                <p className="bold">{myTour?.country}</p>
              </div>
              <div className="grid">
                <p className="label">Паспорт</p>
                <p className="bold">{myTour?.passport_id}</p>
              </div>
            </div>
          </div>
          <div className="bay_user">
            <h2>Турпакет</h2>
            <div className="tour_block gridden">
              <div className="tour_block_my">
                <img src={myTour?.tour?.hotelpicturebig} alt="" />
                <div>
                  {Array.from(
                    { length: myTour?.tour?.hotelstars },
                    (_, starIndex) => (
                      <span key={starIndex}>
                        <FaStar className="icon" size={15} />
                      </span>
                    )
                  )}
                  <h1 className="title_my">{myTour?.tour?.hotelname}</h1>
                  <p className="text_p">
                    {myTour?.tour?.countryname}, {myTour?.tour?.hotelregionname}
                  </p>
                </div>
              </div>
              <div className="box_my">
                <MdOutlineDateRange color="var(--black)" size={24} />
                <p className="bold">
                  {myTour?.tour?.flydate}, {myTour?.tour?.nights} ночей
                </p>
              </div>
              <div className="box_my">
                <LiaBedSolid color="var(--black)" size={24} />
                <p className="bold">Номер {myTour?.tour?.room}</p>
              </div>
              <div className="box_my">
                <PiCoffee color="var(--black)" size={24} />
                <p className="bold">{myTour?.tour?.meal}</p>
              </div>
              <div className="box_my">
                <IoBusOutline color="var(--black)" size={24} />
                <p className="bold">Аэропорт - Отель - Аэропорт</p>
              </div>
              <div className="box_my">
                <BsShieldCheck color="var(--black)" size={24} />
                <p className="bold">Медицинская страховка</p>
              </div>
            </div>
          </div>
          {myTour?.travelers[0] && (
            <div className="bay_user">
              <h2>Путешественники</h2>
              {myTour?.travelers.map((el, id) => (
                <Travelers key={id} data={el} />
              ))}
            </div>
          )}
          {myTour?.flights && (
            <div className="bay_user">
              <h2>Перелет</h2>
              {myTour?.flights?.iserror ? (
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
                      src={myTour?.flights[0]?.forward[0]?.company?.thumb}
                      alt=""
                    />
                    <p className="center"></p>
                    <div className="gold">
                      {myTour?.flights[0].forward[0].number}
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>{myTour?.flights[0].forward[0].departure.port.id}</h2>
                      <p>
                        {myTour?.flights[0].forward[0].departure.port.shortName}
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
                      <h2>{myTour?.flights[0].forward[0].arrival.port.id}</h2>
                      <p>
                        {myTour?.flights[0].forward[0].arrival.port.shortName}
                      </p>
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>{myTour?.flights[0].forward[0].departure.time}</h2>
                      <p>{myTour?.flights[0].forward[0].departure.date}</p>
                    </div>
                    <p className="center"></p>
                    <div className="left">
                      <h2>{myTour?.flights[0].forward[0].arrival.time}</h2>
                      <p>{myTour?.flights[0].forward[0].arrival.date}</p>
                    </div>
                  </div>
                  <div className="hr_up"></div>
                  <div className="reis_div">
                    <img
                      className="fly"
                      src={myTour?.flights[0].backward[0].company.thumb}
                      alt=""
                    />
                    <p className="center"></p>
                    <div className="gold">
                      {myTour?.flights[0].backward[0].number}
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>
                        {myTour?.flights[0].backward[0].departure.port.id}
                      </h2>
                      <p>
                        {
                          myTour?.flights[0].backward[0].departure.port
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
                      <h2>{myTour?.flights[0].backward[0].arrival.port.id}</h2>
                      <p>
                        {myTour?.flights[0].backward[0].arrival.port.shortName}
                      </p>
                    </div>
                  </div>
                  <div className="reis_div">
                    <div>
                      <h2>{myTour?.flights[0].backward[0].departure.time}</h2>
                      <p>{myTour?.flights[0].backward[0].departure.date}</p>
                    </div>
                    <p className="center"></p>
                    <div className="left">
                      <h2>{myTour?.flights[0].backward[0].arrival.time}</h2>
                      <p>{myTour?.flights[0].backward[0].arrival.date}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailMyTour;
