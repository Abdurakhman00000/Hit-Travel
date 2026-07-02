import React, { useEffect, useState } from "react";
import "./DetailsTour.css";
import Header from "../../components/Header/Header";
import { FaStar } from "react-icons/fa";
import details_icon7 from "../../img/detais_icon7.svg";
import line from "../../img/Line.svg";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../Api";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { PiCoffee } from "react-icons/pi";
import { IoBusOutline } from "react-icons/io5";
import { BsShieldCheck } from "react-icons/bs";
import { LiaBedSolid } from "react-icons/lia";
import { linkAction } from "../../store/actions/linkAction";
import { tourAction, tourActionNot } from "../../store/actions/tourAction";
import { decorAction } from "../../store/actions/decorAction";
import { LuHotel } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Loader from "../../components/UI/Loader/Loader";
import ModalBottom from "../../components/UI/ModalBottom/ModalBottom";
import { BsAirplane } from "react-icons/bs";

const DetailsTour = ({ local, Alert }) => {
  const { tour } = useParams();
  const { list } = useParams();
  const [modal, setModal] = useState(false);
  const [dataTour, setDataTour] = useState([]);
  const [dataTourList, setDataTourList] = useState([]);
  const [like, setLike] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [meal, setMeal] = useState([]);
  const [next, setNext] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messages = true;
  const { dataList } = useSelector((state) => state.list);
  const { dataFilter } = useSelector((state) => state.filter);
  const { tourData } = useSelector((state) => state.tour);

  useEffect(() => {
    if (dataTour && dataTour.tour && dataTour.tour.operatorlink) {
      dispatch(linkAction(dataTour.tour.operatorlink));
    }
  }, [dataTour]);

  useEffect(() => {
    if (dataTour) {
      setLike(dataTour.isfavorite);
    }
  }, [dataTour, dataTour.isfavorite]);

  const headers = {
    Authorization: `Token ${local}`,
  };

  useEffect(() => {
    dispatch(tourActionNot());
    if (list === "favorit") {
      const data = dataList.filter((obj) => {
        const filterList = obj.tourid.includes(tour);
        return filterList;
      });
      setDataTourList(data[0]);
      dispatch(decorAction(data[0]));
    } else {
      if (local) {
        dispatch(tourAction({ headers: headers, tour }));
      } else {
        dispatch(tourAction({ tour }));
      }
    }
  }, [local, list, tour]);

  useEffect(() => {
    if (tourData && tourData.tour) {
      setDataTour(tourData);
    } else {
      setDataTour(dataTourList);
    }
  }, [tourData, dataTourList]);

  useEffect(() => {
    if (triggerEffect) {
      if (like) {
        Alert("Добавлено в избранные", "success");
      } else {
        Alert("Удалено из избранных", "error");
      }
    }
  }, [like]);

  useEffect(() => {
    if (
      dataFilter &&
      dataFilter.meals &&
      dataFilter.meals.meal &&
      dataTour &&
      dataTour.tour &&
      dataTour.tour.mealcode
    ) {
      const data = dataFilter.meals.meal.filter((obj) => {
        const stringId = obj.id.toString();
        return stringId.includes(dataTour.tour.mealcode);
      });
      setMeal(data);
    }
  }, [dataFilter, dataTour]);

  const data = "beka";

  const handleSubmit = async () => {
    if (local) {
      setLike(!like);
      setTriggerEffect(true);
      try {
        await axios.post(
          url + `/favorite/tour/${tour}`,
          { data },
          {
            headers,
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert("Вы не авторизованы", "error");
      navigate("/login");
    }
  };

  console.log(dataTour);

  return (
    <div className="details_tour">
      <Header messages={messages}>
        <h1>Детали тура</h1>
      </Header>
      {dataTour.tour ? (
        <div className="container">
          <div className="tour_block top">
            <div className="nav_tour">
              <img src={dataTour.tour.hotelpicturebig} alt="" />
              <div className="right">
                <h1>{dataTour.tour.tourname}</h1>
                <p>{dataTour.tour.countryname}</p>
              </div>
              <div className="icons">
                {like ? (
                  <GoHeartFill
                    onClick={handleSubmit}
                    className="icon_red"
                    size={25}
                  />
                ) : (
                  <GoHeart
                    onClick={handleSubmit}
                    className="icon_red"
                    size={25}
                  />
                )}
              </div>
            </div>
            <div className="hr"></div>
            <h3>Дата вылета {dataTour.tour.flydate}</h3>
            <p>
              {dataTour.tour.nights} ночей | {dataTour.tour.placement}
            </p>
          </div>
          <div className="tour_block">
            <div
              onClick={() => navigate(`/reis/${dataTour.tour.hotelcode}`)}
              className="block"
            >
              <div>
                <LuHotel color="var(--blue)" size={25} />
              </div>
              <div className="flex">
                <dir>
                  <h2>{dataTour.tour.hotelname}</h2>
                  <p className="text_p">Отель</p>
                </dir>
                <div className="icons_flex">
                  {Array.from(
                    { length: dataTour.tour.hotelstars },
                    (_, starIndex) => (
                      <span key={starIndex}>
                        <FaStar className="icon" size={15} />
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {dataTour.tour.hoteldescription && (
              <>
                <div className="hr"></div>
                <div>
                  <p
                    className="hoteldescription"
                    style={{ overflow: "hidden", height: next ? "auto" : 41 }}
                  >
                    {dataTour.tour.hoteldescription}
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
          <div
            style={{
              marginTop: 12,
            }}
          ></div>
          <div className="tour_block mer">
            <div className="tour_block_box">
              <PiCoffee color="var(--blue)" size={25} />
              <div>
                <h2>{meal[0] ? meal[0].russianfull : ""}</h2>
                <p>Питание</p>
                {/* <p>
                  {dataFilter &&
                    dataFilter.meals.meal
                      .filter((item) =>
                        item.id.includes(dataTour.tour.mealcode)
                      )
                      .map((el) => el.russian)}
                </p> */}
              </div>
            </div>
            <div className="hr_box"></div>
            <div className="tour_block_box">
              <IoBusOutline color="var(--blue)" size={25} />
              <div>
                <h2>Аэропорт - Отель - Аэропорт</h2>
                <p>Групповой трансфер</p>
              </div>
            </div>
            <div className="hr_box"></div>
            <div className="tour_block_box">
              <BsShieldCheck color="var(--blue)" size={25} />
              <div>
                <h2>Медицинская страховка</h2>
                <p>Страхование</p>
              </div>
            </div>
          </div>
          <div className="tour_block">
            <div className="tour_block_box">
              <LiaBedSolid color="var(--blue)" size={25} />
              <div>
                <h2>{dataTour.tour.room}</h2>
                <p className="blue_p">Номер</p>
              </div>
              {/* <button className="btn">Выбрать другой</button> */}
            </div>
            {/* <img className="photo" src="" alt="" /> */}
          </div>
          {dataTour?.flights?.iserror ? (
            ""
          ) : dataTour.flights && Object.keys(dataTour.flights).length > 0 ? (
            <div className="tour_block">
              <div className="tour_block_box">
                <BsAirplane color="var(--blue)" size={25} />
                <h2>Перелет</h2>
              </div>
              <div className="hr_up"></div>
              <div className="reis_div">
                <img
                  className="fly"
                  src={dataTour?.flights[0].forward[0].company.thumb}
                  alt=""
                />
                <p className="center"></p>
                <div className="gold">
                  {dataTour?.flights[0].forward[0].number}
                </div>
              </div>
              <div className="reis_div">
                <div>
                  <h2>{dataTour?.flights[0].forward[0].departure.port.id}</h2>
                  <p>
                    {dataTour?.flights[0].forward[0].departure.port.shortName}
                  </p>
                </div>
                <div className="air">
                  <img src={line} alt="" />
                  <img className="image_center" src={details_icon7} alt="" />
                  <img src={line} alt="" />
                </div>
                <div className="left">
                  <h2>{dataTour.flights[0].forward[0].arrival.port.id}</h2>
                  <p>{dataTour.flights[0].forward[0].arrival.port.shortName}</p>
                </div>
              </div>
              <div className="reis_div">
                <div>
                  <h2>{dataTour.flights[0].forward[0].departure.time}</h2>
                  <p>{dataTour.flights[0].forward[0].departure.date}</p>
                </div>
                <p className="center"></p>
                <div className="left">
                  <h2>{dataTour.flights[0].forward[0].arrival.time}</h2>
                  <p>{dataTour.flights[0].forward[0].arrival.date}</p>
                </div>
              </div>
              <div className="hr_up"></div>
              <div className="reis_div">
                <img
                  className="fly"
                  src={dataTour.flights[0].backward[0].company.thumb}
                  alt=""
                />
                <p className="center"></p>
                <div className="gold">
                  {dataTour.flights[0].backward[0].number}
                </div>
              </div>
              <div className="reis_div">
                <div>
                  <h2>{dataTour.flights[0].backward[0].departure.port.id}</h2>
                  <p>
                    {dataTour.flights[0].backward[0].departure.port.shortName}
                  </p>
                </div>
                <div className="air">
                  <img src={line} alt="" />
                  <img className="image_center" src={details_icon7} alt="" />
                  <img src={line} alt="" />
                </div>
                <div className="left">
                  <h2>{dataTour.flights[0].backward[0].arrival.port.id}</h2>
                  <p>
                    {dataTour.flights[0].backward[0].arrival.port.shortName}
                  </p>
                </div>
              </div>
              <div className="reis_div">
                <div>
                  <h2>{dataTour.flights[0].backward[0].departure.time}</h2>
                  <p>{dataTour.flights[0].backward[0].departure.date}</p>
                </div>
                <p className="center"></p>
                <div className="left">
                  <h2>{dataTour.flights[0].backward[0].arrival.time}</h2>
                  <p>{dataTour.flights[0].backward[0].arrival.date}</p>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {Object.keys(dataTour.flights).length > 0 ? (
            <>
              <div className="tour_block">
                {/* <h2>Информация о заказе</h2> */}
                {/* <div className="hr_min"></div>
            <div className="text_center">
              <h4>Стоимость тура</h4>
              <div className="border"></div>
              <div className="end">
                <p className="sale">67484 сом</p>
                <h4>
                  {dataTour.tour.price} {dataTour.tour.currency}
                </h4>
              </div>
            </div> */}
                {/* <div className="text_center">
              <div className="check">
                <input type="checkbox" />
                <h4>Использовать бонусы</h4>
              </div>
              <div className="border"></div>
              <div className="end">
                <h4>-200 000 сом</h4>
              </div>
            </div> */}

                <div className="text_center">
                  <h3>Стоимость тура</h3>
                  <div className="border"></div>
                  <div className="end">
                    <h2>
                      {dataTour.tour.operatorprice} {dataTour.tour.currency}
                    </h2>
                  </div>
                </div>
                {dataTour.tour.regular ? (
                  <p className="green">
                    Внимание! В состав тура включен перелет регулярным
                    авиарейсом. Цена не окончательная, она может меняться в
                    зависимости от тарифа авиакомпании.
                  </p>
                ) : (
                  <p className="green">
                    Мы проверили цену - она актуальна на данный момент.
                    Бронируйте тур и фиксируйте эту цену
                  </p>
                )}
              </div>
            </>
          ) : (
            ""
          )}
          {/* <div className="tour_block cursor">
            <div className="faq">
              <img src={faq} alt="" />
              <h2 className="blue"> Часто задаваемые вопросы</h2>
              <IoIosArrowForward className="icon" size={15} />
            </div>
          </div> */}
          {Object.keys(dataTour.flights).length< 0 ? (
            ""
          ) : (
            <button
              onClick={() =>
                local
                  ? setModal(true)
                  : Alert("Вы не авторизованы", "error") || navigate("/login")
              }
              className="button_form m"
            >
              Далее
            </button>
          )}
        </div>
      ) : (
        <div className="loading_div">
          <Loader />
        </div>
      )}
      {modal && (
        <ModalBottom close={setModal}>
          <div className="advantages">
            <h1 className="h1">Этот тур вы можете оформить в наших офисaх</h1>
            <div className="hr"></div>
            <div className="modal_div">
              <HiOutlineLocationMarker
                color="var(--black)"
                className="img"
                size={25}
              />
              <div>
                <p>Адрес</p>
                <h1>Разакова 26</h1>
              </div>
            </div>
            <button
              onClick={() => (local ? navigate(`/decor/${tour}`) : "")}
              className="button_form"
            >
              Продолжить
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="button_form white"
            >
              Связаться с менеджером
            </button>
          </div>
        </ModalBottom>
      )}
    </div>
  );
};

export default DetailsTour;
