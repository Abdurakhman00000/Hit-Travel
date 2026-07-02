import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import empty from "../../img/empty-box.svg";
import "./Faq.css";
import Faq_getail from "./Faq_detail";
import axios from "axios";
import { url } from "../../Api";

const Faq = () => {
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    axios
      .get(url + "/faq")
      .then((response) => {
        setFaqData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="faq">
      <Header>
        <h1>Вопрос/Ответы</h1>
      </Header>
      <div className="container">
        {faqData ? (
          faqData.map((el, id) => <Faq_getail key={id} data={el} />)
        ) : (
          <div className="container">
            <h1 className="not_data">
              <img src={empty} alt="" />
              Пусто
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Faq;
