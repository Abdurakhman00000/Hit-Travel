import React, { useEffect, useState } from "react";
import "./Toolbar.css";
import { NavLink, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineUserCircle } from "react-icons/hi2";
import luggage from "../../img/luggage.svg";
import luggageBlack from "../../img/luggage_black.svg";

const Toolbar = () => {
  const [local, setLocal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      setLocal(true);
    } else {
      setLocal(false);
    }
  }, [location]);

  return (
    <div className="toolbar">
      <div className="tour_toolbar">
        <NavLink to="/" className="icon_div">
          <IoIosSearch className="icon" size={24} />
          <p>Поиск</p>
        </NavLink>
        <NavLink to="/favorites" className="icon_div">
          <IoMdHeartEmpty className="icon" size={24} />
          <p>Избранные</p>
        </NavLink>
        <NavLink to="/dashboard/history" className="icon_div">
          {location.pathname === "/dashboard/history" ? (
            <img className="icon" src={luggage} />
          ) : (
            <img className="icon" src={luggageBlack} />
          )}
          <p>Мои заказы</p>
        </NavLink>
        <NavLink
          to={local ? "/dashboard" : "/profile"}
          className={(active) =>
            active
              ? location.pathname == "/dashboard"
                ? "icon_div active"
                : "icon_div"
              : "icon_div"
          }
        >
          <HiOutlineUserCircle className="icon" size={24} />
          <p>Профиль</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Toolbar;
