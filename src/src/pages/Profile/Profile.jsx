import React, { useState } from "react";
import "./Profile.css";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Modal from "../../components/UI/Modal/Modal";
import { GoDotFill } from "react-icons/go";
import user from "../../img/user-profile-svgrepo-com.svg";
import { BsChatSquareDots } from "react-icons/bs";

const Profile = () => {
  const [leng, setLeng] = useState(false);
  const [dot1, setDot1] = useState(true);
  const [dot2, setDot2] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="profile">
        <div className="container">
          <div className="profile_head">
            <h3>Профиль</h3>
            <BsChatSquareDots
              onClick={() => navigate("/chat")}
              className="icon"
              size={25}
            />
          </div>
          <div className="block_area">
            <img className="user" src={user} alt="" />
            <h1>
              Присоединяйтесь к нам <br /> прямо сейчас
            </h1>
            <NavLink className="button" to="/login">
              Войти
            </NavLink>
            <NavLink className="button" to="/register">
              Создать профиль
            </NavLink>
          </div>
        </div>
      </div>
      <div className="block_read">
        <NavLink to="/contact">
          <div className="link_page">
            <div className="container_block">
              Контакты
              <IoIosArrowForward className="icon" size={20} />
            </div>
          </div>
        </NavLink>
        {/* <div onClick={() => setLeng(true)} className="link_page">
          <div className="container_block">
            <HiLanguage className="icon_leng" color="var(--blue)" size={22} />
            Язык{" "}
            <p className="leng">
              Русский
              <IoIosArrowForward className="icon" size={20} />
            </p>
          </div>
        </div> */}
      </div>
      {leng && (
        <Modal close={setLeng}>
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
        </Modal>
      )}
    </>
  );
};

export default Profile;
