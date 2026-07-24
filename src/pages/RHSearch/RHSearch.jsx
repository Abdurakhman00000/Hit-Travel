import React, { useEffect, useRef, useState } from "react";
import "./RHSearch.css";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { rhSuggestAction } from "../../store/actions/ratehawkAction";
import { GiRollingSuitcase } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { CgCalendarDates } from "react-icons/cg";
import { FaUser } from "react-icons/fa";

function toISO(d) {
  if (!d) return "";
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function formatShort(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
}

function defaultCheckin() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return toISO(d);
}

function defaultCheckout() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return toISO(d);
}

const RHSearch = ({ Alert }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suggest } = useSelector((s) => s.ratehawk);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [destOpen, setDestOpen] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [checkin, setCheckin] = useState(defaultCheckin());
  const [checkout, setCheckout] = useState(defaultCheckout());
  const [adults, setAdults] = useState(2);
  const [selectedStars, setSelectedStars] = useState(0);
  const [dateOpen, setDateOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const destRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) {
        setDestOpen(false);
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    clearTimeout(timerRef.current);
    if (val.length >= 2) {
      timerRef.current = setTimeout(() => {
        dispatch(rhSuggestAction(val));
        setShowSuggest(true);
      }, 350);
    } else {
      setShowSuggest(false);
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
    setQuery(item.name || item.full_name || "");
    setDestOpen(false);
    setShowSuggest(false);
  };

  const handleSearch = () => {
    if (!selected) { Alert("Выберите направление из списка", "error"); return; }
    if (!checkin || !checkout) { Alert("Выберите даты", "error"); return; }
    const p = new URLSearchParams({
      region_id: selected.id,
      region_name: selected.name || selected.full_name || "",
      checkin,
      checkout,
      adults,
      stars: selectedStars,
    });
    navigate(`/rh-results?${p.toString()}`);
  };

  const nights = checkin && checkout
    ? Math.round((new Date(checkout) - new Date(checkin)) / 86400000)
    : 0;

  const adultsLabel = adults === 1 ? "1 взрослый" : `${adults} взрослых`;

  return (
    <div className="hotels">
      <Header><h1>Отели</h1></Header>
      <div className="container">

        {/* Destination */}
        <div className="search_block" ref={destRef}>
          <div className="search_block_box" onClick={() => setDestOpen(true)}>
            <GiRollingSuitcase color="var(--blue)" size={25} />
            <div>
              <p>Страна, курорт, отель</p>
              <h1>{selected ? (selected.name || selected.full_name) : "Выберите направление"}</h1>
            </div>
          </div>
          {destOpen && (
            <div className="rhs_dest_panel">
              <input
                autoFocus
                className="rhs_dest_input"
                placeholder="Введите название"
                value={query}
                onChange={handleQueryChange}
              />
              {showSuggest && suggest.length > 0 && (
                <div className="rhs_suggest_list">
                  {suggest.slice(0, 8).map((item, i) => (
                    <div key={i} className="rhs_suggest_item" onClick={() => handleSelect(item)}>
                      <span className="rhs_suggest_name">{item.name || item.full_name}</span>
                      {item.country_code && (
                        <span className="rhs_suggest_sub"> · {item.country_code.toUpperCase()}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="filt_new">

          {/* Dates */}
          <div className="filt_grid">
            <div className="filt_box" onClick={() => setDateOpen(true)}>
              <p>Заезд</p>
              <h1>{formatShort(checkin)}</h1>
            </div>
            <div className="filt_box" onClick={() => setDateOpen(true)}>
              <p>Выезд{nights > 0 ? ` (${nights} н.)` : ""}</p>
              <h1>{formatShort(checkout)}</h1>
            </div>
          </div>

          {dateOpen && (
            <div className="rhs_date_panel">
              <div className="rhs_date_row">
                <label className="rhs_date_label">Заезд</label>
                <input
                  className="rhs_date_input"
                  type="date"
                  value={checkin}
                  min={toISO(new Date())}
                  onChange={e => setCheckin(e.target.value)}
                />
              </div>
              <div className="rhs_date_row">
                <label className="rhs_date_label">Выезд</label>
                <input
                  className="rhs_date_input"
                  type="date"
                  value={checkout}
                  min={checkin}
                  onChange={e => setCheckout(e.target.value)}
                />
              </div>
              <button className="button_form btn rhs_done_btn" onClick={() => setDateOpen(false)}>
                Готово
              </button>
            </div>
          )}

          {/* Guests */}
          <div className="filt_save" onClick={() => setGuestsOpen(!guestsOpen)}>
            <p>Кто едет</p>
            <h1>{adultsLabel}</h1>
          </div>

          {guestsOpen && (
            <div className="rhs_guests_panel">
              <div className="rhs_guests_row">
                <span>Взрослые</span>
                <div className="rhs_counter">
                  <button
                    className="rhs_counter_btn"
                    onClick={() => setAdults(a => Math.max(1, a - 1))}
                  >−</button>
                  <span className="rhs_counter_val">{adults}</span>
                  <button
                    className="rhs_counter_btn"
                    onClick={() => setAdults(a => Math.min(8, a + 1))}
                  >+</button>
                </div>
              </div>
              <button className="button_form btn rhs_done_btn" onClick={() => setGuestsOpen(false)}>
                Готово
              </button>
            </div>
          )}

          {/* Stars */}
          <div className="filt_box" style={{ marginTop: 8 }}>
            <p>Класс отеля</p>
            <div style={{ marginTop: 4 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedStars(i + 1 === selectedStars ? 0 : i + 1)}
                  style={{
                    color: i < selectedStars ? "gold" : "#cdcdcd",
                    cursor: "pointer",
                    marginRight: 4,
                  }}
                >
                  <FaStar className="icons" size={18} />
                </span>
              ))}
            </div>
          </div>

          <button className="button_form btn" onClick={handleSearch} style={{ marginTop: 12 }}>
            Найти отели
          </button>
        </div>
      </div>
    </div>
  );
};

export default RHSearch;
