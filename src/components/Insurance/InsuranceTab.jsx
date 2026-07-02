import React from "react";
import { useNavigate } from "react-router-dom";
import "./InsuranceTab.css";
import { IoSearch } from "react-icons/io5";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { FaCar, FaPlaneDeparture } from "react-icons/fa6";
import { INSURANCE_PRODUCTS, PRODUCT_LABELS } from "../../pages/Insurance/constants";

const products = [
  {
    key: INSURANCE_PRODUCTS.OSAGO,
    icon: FaCar,
    desc: "Обязательное страхование автогражданской ответственности",
  },
  {
    key: INSURANCE_PRODUCTS.KASKO,
    icon: MdOutlineHealthAndSafety,
    desc: "Добровольное страхование автомобиля от повреждений",
  },
  {
    key: INSURANCE_PRODUCTS.VZR,
    icon: FaPlaneDeparture,
    desc: "Страхование выезжающих за рубеж",
  },
];

const InsuranceTab = ({ Alert, ht }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(INSURANCE_PRODUCTS.OSAGO);

  const handleStart = () => {
    navigate(`/insurance?product=${selected}`);
  };

  return (
    <div className={ht ? "htkz insurance_tab_panel" : "htkz closed insurance_tab_panel"}>
      <div className="container">
        <div className="insurance_tab_intro">
          <h2>Страхование</h2>
          <p>Оформите полис ОСАГО, КАСКО или ВЗР онлайн через партнёрский API НСК</p>
        </div>

        <div className="insurance_product_grid">
          {products.map(({ key, icon: Icon, desc }) => (
            <button
              key={key}
              type="button"
              className={`insurance_product_card ${selected === key ? "active" : ""}`}
              onClick={() => setSelected(key)}
            >
              <Icon size={28} />
              <div>
                <h3>{PRODUCT_LABELS[key]}</h3>
                <p>{desc}</p>
              </div>
            </button>
          ))}
        </div>

        <button type="button" className="button_form insurance_tab_cta" onClick={handleStart}>
          <IoSearch size={20} />
          Оформить {PRODUCT_LABELS[selected]}
        </button>
      </div>
    </div>
  );
};

export default InsuranceTab;
