import React, { useEffect, useRef, useState } from "react";
import "./RHConfirm.css";
import Header from "../../components/Header/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { rhBookStatusAction } from "../../store/actions/ratehawkAction";
import { useDispatch } from "react-redux";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdHotel } from "react-icons/md";

const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 150000; // 150 сек

const RHConfirm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const local = localStorage.getItem("token") || "";

  const orderId = params.get("partner_order_id");
  const hotelName = params.get("hotel_name") || "Отель";
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");

  const [status, setStatus] = useState("polling"); // polling | confirmed | failed | timeout
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!orderId) { setStatus("failed"); setErrorMsg("ID заказа не найден"); return; }
    poll();
    return () => clearTimeout(pollRef.current);
  }, [orderId]);

  const poll = async () => {
    if (Date.now() - startRef.current > POLL_TIMEOUT) {
      setStatus("timeout");
      return;
    }
    try {
      const data = await dispatch(rhBookStatusAction(orderId, local));
      const s = data?.status;
      if (s === "confirmed") { setStatus("confirmed"); return; }
      if (s === "failed" || s === "cancelled") {
        setStatus("failed");
        setErrorMsg(data?.error || "Бронирование не подтверждено");
        return;
      }
      // pending — продолжаем поллить
      pollRef.current = setTimeout(poll, POLL_INTERVAL);
    } catch (e) {
      pollRef.current = setTimeout(poll, POLL_INTERVAL);
    }
  };

  return (
    <div className="rh_confirm_page">
      <Header back={false}><h1>Статус бронирования</h1></Header>

      <div className="rh_confirm_container">
        {status === "polling" && (
          <div className="rh_confirm_polling">
            <div className="rh_big_spinner" />
            <div className="rh_confirm_hotel"><MdHotel size={24} /> {hotelName}</div>
            <h2>Обрабатываем бронирование...</h2>
            <p>Пожалуйста, не закрывайте экран.<br />Обычно это занимает до 2 минут.</p>
          </div>
        )}

        {status === "confirmed" && (
          <div className="rh_confirm_success">
            <FaCheckCircle className="rh_confirm_icon rh_icon_ok" />
            <h2>Бронирование подтверждено!</h2>
            <div className="rh_confirm_card">
              <div className="rh_confirm_row"><span>Отель</span><span>{hotelName}</span></div>
              <div className="rh_confirm_row"><span>Заезд</span><span>{checkin}</span></div>
              <div className="rh_confirm_row"><span>Выезд</span><span>{checkout}</span></div>
              <div className="rh_confirm_row"><span>Номер заказа</span><span className="rh_order_id">{orderId}</span></div>
            </div>
            <p className="rh_confirm_note">Детали брони отправлены на ваш email. Сохраните номер заказа.</p>
            <button className="rh_confirm_btn" onClick={() => navigate("/")}>На главную</button>
          </div>
        )}

        {(status === "failed" || status === "timeout") && (
          <div className="rh_confirm_fail">
            <FaTimesCircle className="rh_confirm_icon rh_icon_fail" />
            <h2>{status === "timeout" ? "Превышено время ожидания" : "Бронирование не удалось"}</h2>
            {errorMsg && <p className="rh_confirm_error_msg">{errorMsg}</p>}
            <p>Попробуйте выбрать другой тариф или обратитесь в поддержку.</p>
            <div className="rh_confirm_fail_btns">
              <button className="rh_confirm_btn_outline" onClick={() => navigate(-3)}>Другой тариф</button>
              <button className="rh_confirm_btn" onClick={() => navigate("/")}>Главная</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RHConfirm;
