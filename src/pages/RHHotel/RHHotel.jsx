import React, { useEffect, useState } from "react";
import "./RHHotel.css";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { rhHotelInfoAction, rhHotelPageAction, rhPrebookAction } from "../../store/actions/ratehawkAction";
import { FaStar } from "react-icons/fa";
import { PiCoffee } from "react-icons/pi";
import { MdFreeBreakfast } from "react-icons/md";

const MEAL_LABELS = {
  nomeal: "Без питания",
  breakfast: "Завтрак",
  halfboard: "Полупансион",
  fullboard: "Полный пансион",
  allinclusive: "Всё включено",
};

function formatCancelPolicy(pt) {
  const free = pt?.cancellation_penalties?.free_cancellation_before;
  if (free) {
    const d = new Date(free);
    return { label: `Бесплатная отмена до ${d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}`, free: true };
  }
  const policies = pt?.cancellation_penalties?.policies || [];
  if (policies[0]?.amount_charge === "0.00") return { label: "Бесплатная отмена", free: true };
  return { label: "Невозвратный тариф", free: false };
}

const RHHotel = ({ Alert }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const local = localStorage.getItem("token") || "";
  const { hotelInfo, hotelPage, hotelPageLoading, prebookLoading } = useSelector((s) => s.ratehawk);
  const [prebooking, setPrebooking] = useState(null);

  const hotelId = params.get("hotel_id");
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");
  const adults = parseInt(params.get("adults") || "2");
  const regionName = params.get("region_name");

  const nights = (() => {
    try { return Math.round((new Date(checkout) - new Date(checkin)) / 86400000); }
    catch { return 0; }
  })();

  useEffect(() => {
    if (!hotelId) return;
    dispatch(rhHotelInfoAction(hotelId));
    dispatch(rhHotelPageAction({
      id: hotelId,
      checkin,
      checkout,
      guests: [{ adults }],
      currency: "USD",
      language: "ru",
      residency: "kg",
    }));
  }, [hotelId, checkin, checkout]);

  const handleBook = async (rate) => {
    if (!local) { Alert("Для бронирования необходимо войти в аккаунт", "error"); navigate("/login"); return; }
    const pt = rate.payment_options?.payment_types?.[0];
    const cancel = formatCancelPolicy(pt);
    setPrebooking({ rate, cancel, pt });
  };

  const handleConfirmBook = async () => {
    if (!prebooking) return;
    const result = await dispatch(rhPrebookAction(prebooking.rate.match_hash, local));
    if (result) {
      const pt = prebooking.pt;
      const p = new URLSearchParams({
        book_hash: result.book_hash || prebooking.rate.match_hash,
        hotel_id: hotelId,
        hotel_name: hotelInfo?.name || hotelId,
        checkin,
        checkout,
        adults,
        amount: pt?.amount || "0",
        currency: pt?.currency_code || "USD",
      });
      navigate(`/rh-book?${p.toString()}`);
    } else {
      Alert("Не удалось зафиксировать тариф. Попробуйте другой.", "error");
    }
    setPrebooking(null);
  };

  const stars = hotelInfo?.star_rating || 0;
  const rates = hotelPage?.rates || [];

  return (
    <div className="rh_hotel_page">
      <Header title={hotelInfo?.name || "Отель"} />

      {/* Hotel Info Block */}
      {/* Photos */}
      {hotelInfo?.images?.length > 0 && (
        <div className="rh_hotel_photos">
          {hotelInfo.images.slice(0, 6).map((img, i) => {
            const src = (img.url || img).replace("{size}", "640x400");
            return <img key={i} src={src} alt="" className="rh_hotel_photo" />;
          })}
        </div>
      )}

      <div className="rh_hotel_info_block">
        <div className="rh_hotel_info_name">{hotelInfo?.name || hotelId}</div>
        {stars > 0 && (
          <div className="rh_hotel_stars">
            {Array.from({ length: Math.floor(stars) }).map((_, i) => <FaStar key={i} color="#f5a623" size={14} />)}
          </div>
        )}
        {hotelInfo?.address && <div className="rh_hotel_address">{hotelInfo.address}</div>}
        <div className="rh_hotel_dates_row">
          <span>{checkin}</span> — <span>{checkout}</span> · {nights} ноч. · {adults} гост.
        </div>
        {(hotelInfo?.check_in_time || hotelInfo?.check_out_time) && (
          <div className="rh_hotel_checktimes">
            {hotelInfo.check_in_time && <span>Заезд: {hotelInfo.check_in_time.slice(0,5)}</span>}
            {hotelInfo.check_out_time && <span>Выезд: {hotelInfo.check_out_time.slice(0,5)}</span>}
          </div>
        )}
      </div>

      {/* Amenities */}
      {hotelInfo?.amenity_groups?.length > 0 && (
        <div className="rh_hotel_amenities">
          <div className="rh_section_title">Удобства</div>
          <div className="rh_amenity_list">
            {hotelInfo.amenity_groups.flatMap(g => g.amenities || []).slice(0, 12).map((a, i) => (
              <span key={i} className="rh_amenity_chip">{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Rates */}
      <div className="rh_section_title" style={{ padding: "0 16px" }}>Тарифы</div>

      {hotelPageLoading && (
        <div className="rh_results_loading"><div className="rh_spinner" /><p>Загружаем тарифы...</p></div>
      )}

      {!hotelPageLoading && rates.length === 0 && (
        <div className="rh_results_empty">Нет доступных тарифов</div>
      )}

      <div className="rh_rates_list">
        {rates.map((rate, i) => {
          const pt = rate.payment_options?.payment_types?.[0];
          const price = parseFloat(pt?.amount || 0);
          const currency = pt?.currency_code || "USD";
          const cancel = formatCancelPolicy(pt);
          const meal = rate.meal || "nomeal";

          return (
            <div key={i} className="rh_rate_card">
              <div className="rh_rate_top">
                <span className="rh_rate_meal">
                  {meal === "nomeal" ? <PiCoffee /> : <MdFreeBreakfast />}
                  {MEAL_LABELS[meal] || meal}
                </span>
                <span className={`rh_rate_cancel ${cancel.free ? "free" : "nr"}`}>
                  {cancel.label}
                </span>
              </div>

              {/* Cancellation policy detail */}
              {!cancel.free && pt?.cancellation_penalties?.policies?.length > 0 && (
                <div className="rh_cancel_detail">
                  {pt.cancellation_penalties.policies.map((p, pi) => (
                    <div key={pi} className="rh_cancel_row">
                      {p.end_at ? `до ${new Date(p.end_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}` : "После"}: штраф {p.amount_show} {currency}
                    </div>
                  ))}
                </div>
              )}

              <div className="rh_rate_bottom">
                <div>
                  <div className="rh_rate_price">{price.toLocaleString()} {currency}</div>
                  <div className="rh_rate_price_sub">за {nights} ноч. / {adults} гост.</div>
                </div>
                <button className="rh_rate_btn" onClick={() => handleBook(rate)}>
                  Забронировать
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prebook confirm modal */}
      {prebooking && (
        <div className="rh_modal_overlay" onClick={() => setPrebooking(null)}>
          <div className="rh_modal" onClick={e => e.stopPropagation()}>
            <div className="rh_modal_title">Подтвердите выбор</div>
            <div className="rh_modal_row">
              <span>Тариф</span>
              <span>{MEAL_LABELS[prebooking.rate.meal] || "Без питания"}</span>
            </div>
            <div className="rh_modal_row">
              <span>Стоимость</span>
              <span><b>{parseFloat(prebooking.pt?.amount || 0).toLocaleString()} {prebooking.pt?.currency_code}</b></span>
            </div>
            <div className={`rh_modal_cancel ${prebooking.cancel.free ? "free" : "nr"}`}>
              {prebooking.cancel.label}
            </div>
            <p className="rh_modal_note">Цена фиксируется на 15 минут. После этого нужно искать заново.</p>
            <button className="rh_rate_btn rh_modal_btn" onClick={handleConfirmBook} disabled={prebookLoading}>
              {prebookLoading ? "Фиксируем цену..." : "Продолжить"}
            </button>
            <button className="rh_modal_cancel_btn" onClick={() => setPrebooking(null)}>Назад</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RHHotel;
