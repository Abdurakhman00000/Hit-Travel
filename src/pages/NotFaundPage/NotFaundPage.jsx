import React from "react";
import "./NotFaundPage.css";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { MdWrongLocation } from "react-icons/md";
import { NavLink } from "react-router-dom";

const NotFaundPage = () => {
  return (
    <div className="not_faund_page">
      <div className="block">
        <MdWrongLocation color="var(--blue)" className="note_icon" size={50} />
        <h1>Такой страницы нету</h1>
        <NavLink to="/" className="btn">
          {" "}
          Вернуться <BsFillArrowLeftSquareFill className="icon" size={20} />
        </NavLink>
      </div>
    </div>
  );
};

export default NotFaundPage;
