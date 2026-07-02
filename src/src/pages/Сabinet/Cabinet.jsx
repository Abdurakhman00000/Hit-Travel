import React, { useEffect, useState } from "react";
import "./Cabinet.css";
import { FaUserEdit } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import { url } from "../../Api";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { personalAction } from "../../store/actions/personalAction";
import { useDispatch } from "react-redux";
import box from "../../img/box.svg";
import Loader from "../../components/UI/Loader/Loader";
import ModalBottom from "../../components/UI/ModalBottom/ModalBottom";

const Cabinet = ({ Alert, personal }) => {
  const [dot1, setDot1] = useState(true);
  const [dot2, setDot2] = useState(false);
  const [leng, setLeng] = useState(false);
  const [out, setOut] = useState(false);
  const [local, setLocal] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    }
  }, []);

  const headers = {
    Authorization: `Token ${local}`,
  };

  useEffect(() => {
    if (local) {
      dispatch(personalAction({ headers }));
    }
  }, [local]);

  const Log = () => {
    if (local) {
      axios
        .get(url + "/auth/logout", { headers })
        .then((response) => {
          if (response.data.response === true) {
            Alert(response.data.message, "success");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const Delete = () => {
    console.log("aervarv");
    if (local) {
      axios
        .get(url + "/profile/delete", { headers })
        .then((response) => {
          if (response.data.response === true) {
            Alert("Запрос на удаления аккаунта успешно отправлено", "success");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // useEffect(() => {
  //   document.addEventListener("deviceready", function () {
  //     if (personal && window.cordova && window.plugins.OneSignal && !localStorage.getItem("pushSubscriptionId")) {
  //       const OneSignal = window.plugins.OneSignal
  //       OneSignal.initialize("cdd2aecb-8204-4640-8396-36a3c5360179");
  //       OneSignal.Notifications.requestPermission(true).then((accepted) => {
  //         console.log("User accepted notifications: " + accepted);
  //       });
  //       OneSignal.login(personal.id);
  //       setTimeout(() => {
  //         const pushSubscriptionId = OneSignal.User.pushSubscription.id;
  //         axios.post(
  //           url + "/fcm-token/",
  //           { token: pushSubscriptionId },
  //           { headers }
  //         );
  //         localStorage.setItem("pushSubscriptionId", pushSubscriptionId);
  //       }, 3000);
  //     }
  //   });
  // }, [personal, headers]);

  return (
    <div className="cabinet">
      {personal.first_name ? (
        <>
          <div className="cabinet_header">
            <div className="container">
              <div className="head_tour">
                <img src={personal.photo} alt="" />
                <div>
                  <h1>
                    {personal.first_name} {personal.last_name}
                  </h1>
                  <p>{personal.email}</p>
                </div>
                <div className="icons">
                  <FaUserEdit
                    onClick={() => navigate("specific")}
                    className="icon"
                    size={25}
                  />
                </div>
              </div>
              <div className="cabinet_block">
                <div className="block">
                  <div>
                    <h2>Доступные бонусы</h2>
                    <h1 className="bonus_price">
                      {personal.bonuses} <u>C</u>{" "}
                    </h1>
                    <NavLink to="bonus-history" className="link">
                      История бонусов
                    </NavLink>
                  </div>
                  <img src={box} alt="" />
                </div>
                <div className="hr"></div>
                <p>
                  Получайте кешбек за покупку туров и используйте бонусы для
                  следующих поездок!
                </p>
              </div>
            </div>
          </div>
          <div className="containerr">
            <div className="page">
              {/* <div className="cabinet_block two">
              <h1>Получите еще 200 0000 сом бонусов</h1>
              <p>
                Отправьте промокод другу и вы оба получите по 3000 сом.У вас
                есть 4 промокода
              </p>
              <IoIosArrowForward className="icon" size={25} />
            </div> */}
              <NavLink to="history" className="pages">
                <div className="link_page">
                  <div className="container_block">
                    {/* <BsClockHistory color="var(--blue)" size={22} /> */}
                    Мои заказы
                  </div>
                </div>
              </NavLink>
              <NavLink to="notifications" className="pages">
                <div className="link_page">
                  <div className="container_block">
                    {/* <IoMdNotificationsOutline color="var(--blue)" size={22} /> */}
                    Уведомления
                  </div>
                </div>
              </NavLink>
              <NavLink to="/contact" className="pages">
                <div className="link_page">
                  <div className="container_block">
                    {/* <AiOutlinePhone color="var(--blue)" size={22} /> */}
                    Контакты
                  </div>
                </div>
              </NavLink>
              <NavLink to="chanche-password" className="pages">
                <div className="link_page">
                  <div className="container_block">
                    {/* <FiLock color="var(--blue)" size={22} /> */}
                    Изменить пароль
                  </div>
                </div>
              </NavLink>
              <NavLink to="/faq" className="pages">
                <div className="link_page">
                  <div className="container_block">
                    {/* <BsQuestionCircle color="var(--blue)" size={22} /> */}
                    Часто задаваемые вопросы
                  </div>
                </div>
              </NavLink>
              <div onClick={() => setLeng(true)} className="link_page">
                <div className="container_block">
                  {/* <HiLanguage color="var(--blue)" size={22} /> */}
                  Язык <p className="leng">Русский</p>
                </div>
              </div>
              <div onClick={() => setOut(true)} className="link_page">
                <div className="container_block">
                  {/* <RiLogoutBoxRLine color="var(--blue)" size={22} /> */}
                  Выйти/Удалить аккаунт
                </div>
              </div>
            </div>
          </div>
          {leng && (
            <ModalBottom close={setLeng}>
              <div className="leng_text">
                <div
                  onClick={() => setDot1(true) || setDot2(false)}
                  className="leng_giv"
                >
                  <div className="dot">
                    {dot1 && <GoDotFill color="var(--blue)" size={20} />}
                  </div>
                  <h2>Русский</h2>
                </div>
                <div
                  onClick={() => setDot1(false) || setDot2(true)}
                  className="leng_giv"
                >
                  <div className="dot">
                    {dot2 && <GoDotFill color="var(--blue)" size={20} />}
                  </div>
                  <h2>Кыргызча</h2>
                </div>
              </div>
            </ModalBottom>
          )}
          {out && (
            <ModalBottom close={setOut}>
              <div className="out_text">
                <div onClick={Log} className="out_div">
                  <RiLogoutBoxRLine color="var(--blue)" size={22} />
                  <h2>Выйти из профиля</h2>
                </div>
                <div onClick={Delete} className="out_div">
                  <AiOutlineUser color="var(--blue)" size={22} />
                  <h2>Удалить аккаунт</h2>
                </div>
              </div>
            </ModalBottom>
          )}
        </>
      ) : (
        <div className="loading_div">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Cabinet;
