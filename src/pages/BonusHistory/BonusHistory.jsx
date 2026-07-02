import React, { useEffect, useState } from "react";
import "./BonusHistory.css";
import Header from "../../components/Header/Header";
import empty from "../../img/empty-box.svg";
import axios from "axios";
import { url } from "../../Api";
import Loader from "../../components/UI/Loader/Loader";

const BonusHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Token ${token}`,
    };

    axios
      .get(url + "/bonus/history", { headers })
      .then((response) => {
        setHistory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bonus_history">
      <Header>
        <h1>История бонусов</h1>
      </Header>
      <div className="container">
        {loading ? (
          <div className="loading_div">
            <Loader />
          </div>
        ) : history.length == 0 ? (
          <>
            <h1 className="not_data">
              <img src={empty} alt="" />
              Пусто
            </h1>
          </>
        ) : (
          <div className="bonus_block">
            {history &&
              history.map((el, id) => (
                <div key={id} className="bonus_block_box">
                  <div className="between">
                    <h1>{el.reason}</h1>
                    {el.increase == "1" ? (
                      <h2 style={{ color: "#00c75a" }}>
                        +{el.amount} <u>c</u>
                      </h2>
                    ) : (
                      <h2 style={{ color: "#ff0066" }}>
                        -{el.amount} <u>c</u>
                      </h2>
                    )}
                  </div>
                  {el.decrease == "1" ? (
                    ""
                  ) : (
                    <>
                      <p>
                        Доступен с <span>{el.datetime}</span>
                      </p>
                      <p>
                        Действительны до: <span>{el.amount_till_date}</span>
                      </p>
                    </>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusHistory;
