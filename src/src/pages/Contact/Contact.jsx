import React from "react";
import "./Contact.css";
import Header from "../../components/Header/Header";
import hit_logo from "../../img/hit-logo.png";
import { LuPhone } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import whatsapp from "../../img/whatsapp_svg.svg";
import insta from "../../img/insta.svg";

const Contact = () => {
  const messages = true;

  return (
    <div className="contact">
      <Header messages={messages}>
        <h1>Контакты</h1>
      </Header>
      {/* <div className="faq">
        <TbMessageQuestion color="var(--blue)" size={20} />
        <h2 className="blue"> Часто задаваемые вопросы</h2>
        <IoIosArrowForward className="icon" size={20} />
      </div> */}
      <div className="container">
        <img src={hit_logo} alt="" />
        <h1 className="title">КОНТАКТЫ</h1>
        <div className="box d svg">
          <h2>Оставить запрос на подбор тура</h2>
          <div className="flex">
            {/* <a href="https://wa.me/+996557636676" target="blank">
              <div className="svg_div">
                <img src={telegram} alt="" />
              </div>
            </a> */}
            <a href="https://wa.me/+996700636676" target="blank">
              <div className="svg_div">
                <img src={whatsapp} alt="" />
              </div>
            </a>
            <a
              href="https://www.instagram.com/hit_travelkg"
              target="blank"
              className="insta"
            >
              <div className="svg_div">
                <img src={insta} alt="" />
              </div>
            </a>
          </div>
        </div>
        <div className="box">
          <LuPhone className="icon" color="var(--blue)" size={22} />
          <div>
            <a href="tel:+996557636676">+996 557 63 66 76</a>
            <p>Номер телефона</p>
          </div>
        </div>

        <div className="box">
          <LuPhone className="icon" color="var(--blue)" size={22} />
          <div>
            <a href="tel:+996700636676">+996 700 63 66 76</a>
            <p>Номер телефона</p>
          </div>
        </div>
        <div className="box">
          <LuPhone className="icon" color="var(--blue)" size={22} />
          <div>
            <a href="tel:+996700636676">+996 776 63 66 76</a>
            <p>Номер телефона</p>
          </div>
        </div>
        <div className="box">
          <MdOutlineEmail className="icon" color="var(--blue)" size={22} />
          <div>
            <a href="mailto:info@hit-travel.kg">info@hit-travel.kg</a>
            <p>Электронная почта</p>
          </div>
        </div>
        <div className="box">
          <MdOutlineDateRange className="icon" color="var(--blue)" size={22} />
          <div>
            <h3>Пн-пт с 10:00 до 19:00 </h3>
            <p>Рабочее время</p>
          </div>
        </div>
        <div className="box">
          <MdOutlineDateRange className="icon" color="var(--blue)" size={22} />
          <div>
            <h3>Сб с 10:00 до 16:30</h3>
            <p>Рабочее время</p>
          </div>
        </div>
        <div className="box">
          <MdOutlineDateRange className="icon" color="var(--blue)" size={22} />
          <div>
            <h3>Воскресенье</h3>
            <p>Выходной</p>
          </div>
        </div>
        <div className="modal_div">
          <SlLocationPin className="icon" size={22} />
          <div>
            <h3>Разакова 26</h3>
            <p>Адрес</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
