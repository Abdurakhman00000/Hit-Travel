import React, { useState } from "react";
import "./DetailMyHotel.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Travelers = ({ data }) => {
  const [faq, setFaq] = useState(false);

  return (
    <div onClick={() => setFaq(!faq)} className="tour_block">
      <div className="flex">
        <h1 className="title">Путешественник</h1>
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
          <div className="grid">
            <p className="label">Имя по загранпаспорту</p>
            <p className="bold">{data.first_name}</p>
          </div>
          <div className="grid">
            <p className="label">Фамилия по загранпаспорту</p>
            <p className="bold">{data.last_name}</p>
          </div>
          <div className="grid">
            <p className="label">Дата рождения</p>
            <p className="bold">{data.dateofborn}</p>
          </div>
          <div className="grid">
            <p className="label">Серия и номер</p>
            <p className="bold">{data.passport_id}</p>
          </div>
          <div className="grid">
            <p className="label">Орган, выдавший з/п</p>
            <p className="bold">{data.issued_by}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Travelers;
