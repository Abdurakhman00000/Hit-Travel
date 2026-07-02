import React from "react";
import "./Modal.css";
import { IoIosArrowBack } from "react-icons/io";

const Modal = ({ style, open, close, children }) => {

  return (
    <div className="modal_home">
      <div
        onClick={() =>
          close
            ? open
              ? close({ ...open, closeDiv: false })
              : close(false)
            : " "
        }
        className="not_modal"
      ></div>
      <div className="modal">
        <div className="container">
          <div className="padding">
            <div className="box_header"></div>
            <div className="header">
              <div className="container">
                <div className="header_box">
                  <IoIosArrowBack
                    onClick={() =>
                      close
                        ? open
                          ? close({ ...open, closeDiv: false })
                          : close(false)
                        : " "
                    }
                    className="icon"
                    size={25}
                  />
                  <div className="title">
                    <h1>Фильтры</h1>
                  </div>
                  <div style={{ width: 25 }}></div>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
