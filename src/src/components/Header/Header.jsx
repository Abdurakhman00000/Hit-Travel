import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { TbMessageSearch } from "react-icons/tb";

const Header = ({ messages, children, handle, modal }) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (modal) {
      handle();
    } else {
      navigate(-1);
    }
  };

  const isWhatsAppAvailable = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return hour >= 9 && hour < 21;
    } else if (dayOfWeek === 6) {
      return hour >= 10 && hour < 18;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="box_header"></div>
      <div className="header">
        <div className="container">
          <div className="header_box">
            <IoIosArrowBack onClick={goBack} className="icon" size={25} />
            <div className="title">{children}</div>
            {messages && isWhatsAppAvailable() ? (
              <a href="https://wa.me/+996700636676" target="blank">
                <TbMessageSearch className="icon" size={25} />
              </a>
            ) : (
              <div style={{ width: 25 }}></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
