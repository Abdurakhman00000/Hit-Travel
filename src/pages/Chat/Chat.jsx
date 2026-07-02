import React from "react";
import "./Chat.css";
import Header from "../../components/Header/Header";

const Chat = () => {
  return (
    <div className="chat">
      <Header>
        <h1>Связаться с нами</h1>
      </Header>
      <div className="if_con">
        <iframe
          src="https://jivo.chat/5YvrgR7uTG"
          frameBorder="0"
          width="100%"
          height="100vh"
        ></iframe>
      </div>
    </div>
  );
};

export default Chat;
