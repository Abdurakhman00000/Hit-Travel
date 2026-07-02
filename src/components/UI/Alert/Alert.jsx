import React from "react";
import "./Alert.css";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import { AiOutlineWarning } from "react-icons/ai";
import { GrClose } from "react-icons/gr";

export function Alert({ state, setState, propsData, text }) {
  function FuncDelete() {
    setState({ ...state, open: false, opentwo: false });
  }

  return (
    <div className="color">
      <div className="alert">
        {propsData == "success" && <div className="cray green"></div>}
        {propsData == "error" && <div className="cray red"></div>}
        {propsData == "info" && <div className="cray blue"></div>}
        {propsData == "warning" && <div className="cray yellow"></div>}
        <div className="icon_div">
          {propsData == "success" && (
            <BsFillCheckCircleFill className="icon green" size={25} />
          )}
          {propsData == "error" && (
            <BiErrorCircle className="icon red" size={25} />
          )}
          {propsData == "info" && (
            <BiErrorCircle className="icon blue" size={25} />
          )}
          {propsData == "warning" && (
            <AiOutlineWarning className="icon yellow" size={25} />
          )}
        </div>
        <div className="text_div">
          <p>{text}</p>
        </div>
        <div onClick={FuncDelete} className="iks">
          <GrClose color="var(--black)" className="icon" size={20} />
        </div>
      </div>
    </div>
  );
}
