import React from "react";
import "./Notifications.css";
import Header from "../../components/Header/Header";
import podarka from "../../img/podarka.svg";
import empty from "../../img/empty-box.svg";

const Notifications = () => {
  const messages = true;

  const data = false;

  return (
    <div className="notifications">
      <Header messages={messages}>
        <h1>Уведомление</h1>
      </Header>
      <div className="container">
        {data ? (
          <div className="notifications_all">
            <p className="text">19 августа</p>
            <div className="podarka">
              <img className="podarka_img" src={podarka} alt="" />
              <div className="bonus">
                <h6>Еще больше бонусов</h6>
                <p>
                  Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio
                  mattis.Nunc vulputate libero et velit interdum, ac aliquet
                  odio mattis.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="not_data">
              <img src={empty} alt="" />
              Пусто
            </h1>
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
