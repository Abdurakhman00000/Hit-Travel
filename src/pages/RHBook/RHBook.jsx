import React, { useEffect, useState } from "react";
import "./RHBook.css";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { rhBookAction, rhFinishBookAction } from "../../store/actions/ratehawkAction";
import Loading from "../../components/UI/Loading/Loading";

const RHBook = ({ Alert }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const local = localStorage.getItem("token") || "";
  const { personal } = useSelector((s) => s.personal);
  const { bookLoading, bookError } = useSelector((s) => s.ratehawk);

  const bookHash = params.get("book_hash");
  const hotelId = params.get("hotel_id");
  const hotelName = params.get("hotel_name") || hotelId;
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");
  const adults = parseInt(params.get("adults") || "2");
  const amount = params.get("amount");
  const currency = params.get("currency") || "USD";

  const nights = (() => {
    try { return Math.round((new Date(checkout) - new Date(checkin)) / 86400000); }
    catch { return 0; }
  })();

  const [guests, setGuests] = useState(
    Array.from({ length: adults }, () => ({ first_name: "", last_name: "" }))
  );
  const [contact, setContact] = useState({
    email: personal?.email || "",
    phone: personal?.phone || "",
  });

  useEffect(() => {
    setContact({
      email: personal?.email || "",
      phone: personal?.phone || "",
    });
  }, [personal]);

  const updateGuest = (i, field, val) => {
    setGuests(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: val } : g));
  };

  const validate = () => {
    for (let i = 0; i < guests.length; i++) {
      if (!guests[i].first_name.trim() || !guests[i].last_name.trim()) {
        Alert(`Заполните имя и фамилию гостя ${i + 1}`, "error");
        return false;
      }
    }
    if (!contact.email.trim()) { Alert("Укажите email", "error"); return false; }
    if (!contact.phone.trim()) { Alert("Укажите телефон", "error"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      book_hash: bookHash,
      hotel_id: hotelId,
      hotel_name: hotelName,
      checkin,
      checkout,
      amount,
      currency,
      language: "ru",
      rooms: [{ guests: guests.map((g, i) => ({ first_name: g.first_name, last_name: g.last_name, is_main: i === 0 })) }],
      payment_type: "now",
      email: contact.email,
      phone: contact.phone,
    };

    const result = await dispatch(rhBookAction(payload, local));
    if (result) {
      const orderId = result.partner_order_id;
      await dispatch(rhFinishBookAction(orderId, local));
      navigate(`/rh-confirm?partner_order_id=${orderId}&hotel_name=${encodeURIComponent(hotelName)}&checkin=${checkin}&checkout=${checkout}`);
    } else {
      Alert(bookError || "Ошибка при создании брони", "error");
    }
  };

  return (
    <div className="rh_book_page">
      <Header><h1>Оформление</h1></Header>

      {/* Summary */}
      <div className="rh_book_summary">
        <div className="rh_book_hotel">{hotelName}</div>
        <div className="rh_book_meta">{checkin} — {checkout} &bull; {nights} ноч. &bull; {adults} гост.</div>
        <div className="rh_book_total">{parseFloat(amount || 0).toLocaleString()} {currency}</div>
      </div>

      {/* Guests */}
      <div className="rh_book_section_title">Данные гостей</div>
      {guests.map((g, i) => (
        <div key={i} className="rh_book_guest_card">
          <div className="rh_book_guest_label">Гость {i + 1}</div>
          <input
            className="rh_book_input"
            placeholder="Имя (как в паспорте)"
            value={g.first_name}
            onChange={e => updateGuest(i, "first_name", e.target.value)}
          />
          <input
            className="rh_book_input"
            placeholder="Фамилия (как в паспорте)"
            value={g.last_name}
            onChange={e => updateGuest(i, "last_name", e.target.value)}
          />
        </div>
      ))}

      {/* Contact */}
      <div className="rh_book_section_title">Контакты</div>
      <div className="rh_book_guest_card">
        <input
          className="rh_book_input"
          placeholder="Email"
          type="email"
          value={contact.email}
          onChange={e => setContact({ ...contact, email: e.target.value })}
        />
        <input
          className="rh_book_input"
          placeholder="Телефон"
          type="tel"
          value={contact.phone}
          onChange={e => setContact({ ...contact, phone: e.target.value })}
        />
      </div>

      <div className="rh_book_note">
        Данные гостей должны совпадать с паспортом. Бронирование невозможно изменить после подтверждения.
      </div>

      {bookError && <div className="rh_book_error">{bookError}</div>}

      <div className="rh_book_bottom">
        <div className="rh_book_bottom_price">
          <div className="rh_book_bottom_label">Итого</div>
          <div className="rh_book_bottom_amount">{parseFloat(amount || 0).toLocaleString()} {currency}</div>
        </div>
        <button className="rh_book_btn" onClick={handleSubmit} disabled={bookLoading}>
          {bookLoading ? "Оформляем..." : "Подтвердить бронь"}
        </button>
      </div>

      {bookLoading && <Loading />}
    </div>
  );
};

export default RHBook;
