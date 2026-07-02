import React, { useState } from "react";
import "../DetailMyTour/DetailMyTour.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Travelers = ({ data, index }) => {
  const [faq, setFaq] = useState(false);

  function formatDates(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  return (
    <div onClick={() => setFaq(!faq)} className="tour_block">
      <div className="flex">
        <h1 className="title">Путешественник {index + 1}</h1>
        {faq ? (
          <IoIosArrowUp
            onClick={() => setFaq(!faq)}
            className="icon_faq"
            size={22}
          />
        ) : (
          <IoIosArrowDown
            onClick={() => setFaq(!faq)}
            className="icon_faq"
            size={22}
          />
        )}
      </div>
      {faq && (
        <div className="travel">
          {data.u_name && (
            <div className="grid">
              <p className="label">Имя</p>
              <p className="bold">{data.u_name}</p>
            </div>
          )}
          {data.u_surname && (
            <div className="grid">
              <p className="label">Фамилия</p>
              <p className="bold">{data.u_surname}</p>
            </div>
          )}
          {data.u_phone_mobile && (
            <div className="grid">
              <p className="label">Номер</p>
              <p className="bold">{data.u_phone_mobile}</p>
            </div>
          )}
          {data.u_email && (
            <div className="grid">
              <p className="label">E-mail</p>
              <p className="bold">{data.u_email}</p>
            </div>
          )}
          {data.u_birthday && (
            <div className="grid">
              <p className="label">Дата рождения</p>
              <p className="bold">{formatDates(data.u_birthday)}</p>
            </div>
          )}
          {data.u_zagran_number && (
            <div className="grid">
              <p className="label">Серия и номер</p>
              <p className="bold">{data.u_zagran_number}</p>
            </div>
          )}
          {data.u_zagran_given && (
            <div className="grid">
              <p className="label">Дата выдачи</p>
              <p className="bold">{formatDates(data.u_zagran_given)}</p>
            </div>
          )}
          {data.u_zagran_expire && (
            <div className="grid">
              <p className="label">Дата окончания </p>
              <p className="bold">{formatDates(data.u_zagran_expire)}</p>
            </div>
          )}
          {data.u_zagran_organization && (
            <div className="grid">
              <p className="label">Кем выдан</p>
              <p className="bold">{data.u_zagran_organization}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Travelers;
