import React, { useEffect, useState, Component } from "react";
import "./RHResults.css";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { rhSearchAction } from "../../store/actions/ratehawkAction";
import { FaStar } from "react-icons/fa";
import { url } from "../../Api";
import axios from "axios";

const MEAL_LABELS = {
  nomeal: "Без питания",
  breakfast: "Завтрак включён",
  halfboard: "Полупансион",
  fullboard: "Полный пансион",
  allinclusive: "Всё включено",
};

function safeName(hotel) {
  try {
    if (!hotel || !hotel.id) return "Отель";
    return hotel.id.split(/[-_]/).map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : "").join(" ");
  } catch { return "Отель"; }
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: String(e) }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, color: "#c00", fontSize: 14 }}>
          <p>Ошибка отображения. Попробуйте ещё раз.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ST = {
  loading: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 20px", gap: 12,
  },
  loadingText: { fontSize: 16, color: "#555", margin: 0 },
  msg: {
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "80px 20px",
  },
  msgText: { fontSize: 18, color: "#333", textAlign: "center", margin: 0 },
  card: {
    width: "100%", borderRadius: 6, background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)", marginBottom: 12, cursor: "pointer",
    overflow: "hidden",
  },
  photo: { width: "100%", height: 200, objectFit: "cover", display: "block" },
  noPhoto: { width: "100%", height: 200, background: "#d0e4f7", display: "block" },
  body: { padding: "10px 12px 12px" },
  name: { fontSize: 16, fontWeight: 600, color: "#081f2c", margin: "4px 0 2px" },
  addr: { fontSize: 13, color: "#666", margin: "2px 0" },
  hr: { height: 1, background: "rgba(0,0,0,0.1)", margin: "10px 0" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  nights: { fontSize: 13, color: "#888", margin: 0 },
  price: { fontSize: 17, fontWeight: 700, color: "#026ed2", margin: 0 },
  starsRow: { display: "flex", gap: 2, marginBottom: 2 },
  rateBadge: {
    display: "inline-block", padding: "3px 8px", borderRadius: 4,
    background: "#026ed2", color: "#fff", fontSize: 13, fontWeight: 600, marginLeft: 6,
  },
  meal: { fontSize: 12, color: "#888", margin: "4px 0 0" },
};

const RHResults = ({ Alert }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { hotels, searchLoading, searchError } = useSelector((s) => s.ratehawk);
  const [hotelInfoMap, setHotelInfoMap] = useState({});

  const regionId = params.get("region_id");
  const regionName = params.get("region_name");
  const adults = Math.max(1, parseInt(params.get("adults") || "2") || 2);
  const filterStars = parseInt(params.get("stars") || "0") || 0;

  const toISO = (d) => d.toISOString().split("T")[0];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const rawCheckin = params.get("checkin");
  const rawCheckout = params.get("checkout");

  const checkinDate = rawCheckin ? new Date(rawCheckin) : null;
  const checkoutDate = rawCheckout ? new Date(rawCheckout) : null;
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const defaultOut = new Date(today); defaultOut.setDate(today.getDate() + 8);

  const checkin = (checkinDate && !isNaN(checkinDate) && checkinDate >= today)
    ? rawCheckin : toISO(tomorrow);
  const checkout = (() => {
    const base = (checkinDate && !isNaN(checkinDate) && checkinDate >= today)
      ? checkinDate : tomorrow;
    return (checkoutDate && !isNaN(checkoutDate) && checkoutDate > base)
      ? rawCheckout : toISO(defaultOut);
  })();

  const nights = (() => {
    try { return Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000)); }
    catch { return 7; }
  })();

  useEffect(() => {
    if (!regionId) return;
    dispatch(rhSearchAction({
      region_id: parseInt(regionId),
      checkin, checkout,
      guests: [{ adults }],
      currency: "USD",
      language: "ru",
      residency: "kg",
    }));
  }, [regionId, checkin, checkout, adults]);

  useEffect(() => {
    if (!hotels || hotels.length === 0) return;
    hotels.slice(0, 30).forEach(h => {
      if (h && h.id && !hotelInfoMap[h.id]) {
        axios.get(`${url}/ratehawk/hotel/info/${h.id}/`, { params: { lang: "ru" }, timeout: 10000 })
          .then(r => { if (r.data) setHotelInfoMap(prev => ({ ...prev, [h.id]: r.data })); })
          .catch(() => {});
      }
    });
  }, [hotels]);

  const handleHotel = (hotel) => {
    if (!hotel || !hotel.id) return;
    const p = new URLSearchParams({
      hotel_id: hotel.id, checkin, checkout, adults,
      region_name: regionName || "",
    });
    navigate(`/rh-hotel?${p.toString()}`);
  };

  const visibleHotels = (() => {
    try {
      const list = (hotels || []).filter(h => h && h.id);
      if (filterStars > 0) {
        return list.filter(h => Math.floor(hotelInfoMap[h.id]?.star_rating || 0) >= filterStars);
      }
      return list.slice(0, 50);
    } catch { return []; }
  })();

  const renderCard = (hotel) => {
    try {
      const rate = hotel.rates?.[0];
      const pt = rate?.payment_options?.payment_types?.[0];
      const rawPrice = pt?.amount ? parseFloat(pt.amount) : null;
      const price = rawPrice ? Math.round(rawPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : null;
      const currency = pt?.currency_code || "USD";
      const meal = rate?.meal || "nomeal";
      const info = hotelInfoMap[hotel.id] || null;
      const name = info?.name || safeName(hotel);
      const stars = Math.floor(info?.star_rating || 0);
      const starRating = info?.star_rating ? Number(info.star_rating).toFixed(1) : null;
      const address = info?.address || "";
      const photo = (() => {
        try {
          const imgs = info?.images;
          if (!imgs || !imgs.length) return null;
          const img = imgs[0];
          if (!img) return null;
          const src = (typeof img === "string") ? img : (img.url || "");
          return src ? src.replace("{size}", "640x400") : null;
        } catch { return null; }
      })();

      return (
        <div key={hotel.id} style={ST.card} onClick={() => handleHotel(hotel)}>
          {photo
            ? <img style={ST.photo} src={photo} alt={name} onError={e => { e.target.style.display = "none"; }} />
            : <div style={ST.noPhoto} />
          }
          <div style={ST.body}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                {stars > 0 && (
                  <div style={ST.starsRow}>
                    {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
                      <FaStar key={i} color="gold" size={12} />
                    ))}
                  </div>
                )}
                <p style={ST.name}>{name}</p>
                {address ? <p style={ST.addr}>{address}</p> : null}
              </div>
              {starRating ? <span style={ST.rateBadge}>{starRating}★</span> : null}
            </div>
            <p style={ST.meal}>{MEAL_LABELS[meal] || meal}</p>
            <div style={ST.hr} />
            <div style={ST.priceRow}>
              <p style={ST.nights}>{adults} взр. · {nights} ноч.</p>
              {price ? <p style={ST.price}>{price} {currency}</p> : null}
            </div>
          </div>
        </div>
      );
    } catch { return null; }
  };

  return (
    <div className="hotels">
      <Header><h1>{regionName || "Отели"}</h1></Header>

      {searchLoading && (
        <div style={ST.loading}>
          <p style={ST.loadingText}>Ищем отели...</p>
        </div>
      )}

      {!searchLoading && searchError && (
        <div style={ST.msg}>
          <p style={ST.msgText}>Ошибка поиска.{"\n"}Попробуйте ещё раз.</p>
        </div>
      )}

      {!searchLoading && !searchError && visibleHotels.length === 0 && (
        <div style={ST.msg}>
          <p style={ST.msgText}>Отели не найдены</p>
        </div>
      )}

      {!searchLoading && visibleHotels.length > 0 && (
        <ErrorBoundary>
          <div style={{ padding: "0 16px 100px" }}>
            {visibleHotels.map(renderCard)}
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default RHResults;
