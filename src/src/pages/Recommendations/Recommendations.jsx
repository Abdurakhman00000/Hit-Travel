import React, { useEffect, useState } from "react";
import "./Recommendations.css";
import Header from "../../components/Header/Header";
import axios from "axios";
import { url } from "../../Api";
import { FaStar } from "react-icons/fa";
import { ImFire } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { GiAirplaneDeparture } from "react-icons/gi"
import { IoPricetagsOutline } from "react-icons/io5"
import { LiaBedSolid } from "react-icons/lia"
import { GiModernCity } from "react-icons/gi"
import Loader from "../../components/UI/Loader/Loader";
import Compilation from "../../components/Сompilation/Сompilation"

const Recommendations = () => {
  const [tourRec, setTourRec] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(url + "/api/recommendations")
      .then((response) => {
        setTourRec(response.data.hottours.tour);
        setLoading(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(true);
      });
  }, []);

  return (
    <div className="recommendations">
      <Header>
        {/* <h1>Рекомендации</h1> */}
        <h1>Горящие туры</h1>
      </Header>
      <Compilation />
      {/* {loading ? (
        tourRec.length > 0 ? (
          <div className="container">
            <div className="rec">
              {tourRec.map((el, id) => (
                <div
                  onClick={() => navigate(`/details-tour/${el.tourid}`)}
                  key={id}
                  className="contant_rec">
                  <div className="rec_box">
                    <img src={"https:" + el.hotelpicture} alt="" />
                    <ImFire className="fire" size={30} />
                    <div className="content_home">
                      <div className="content">
                        <div className="content_rate">
                          <div>
                            {Array.from(
                              { length: el.hotelstars },
                              (_, starIndex) => (
                                <span key={starIndex}>
                                  <FaStar className="icon" size={15} />
                                </span>
                              )
                            )}
                            <h1>{el.hotelname} <p className="country">Страна вылета: {el.countryname}</p> </h1>
                          </div>
                          <div>
                            <div className="rate">{el.hotelrating}</div>
                            <div className="ratingIcon tripadvisor"></div>
                          </div>
                        </div>
                        <div className="hr"></div>
                        <div className="contant_two">
                          <div className="div">
                            <GiAirplaneDeparture className="icon" size={23} />
                            <div className="btnp">
                              <h3>{el.flydate}</h3>
                              <p>Дата вылета</p>
                            </div>
                          </div>
                          <div className="div">
                            <LiaBedSolid className="icon" size={23} />
                            <div className="btnp">
                              <h3>{el.nights}</h3>
                              <p>Ночей</p>
                            </div>
                          </div>
                          <div className="div">
                            <GiModernCity className="icon" size={23} />
                            <div className="btnp">
                              <h3>{el.departurename}</h3>
                              <p>Город вылета</p>
                            </div>
                          </div>
                          <div className="div">
                            <IoPricetagsOutline className="icon" size={23} />
                            <div className="btnp">
                              <h3 className="price">
                                <span className="price_old">{el.priceold} </span>{" "}
                                {el.price} {el.currency}
                              </h3>
                              <p>Цена</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )
      ) : (
        <div className="loading_div">
          <Loader />
        </div>
      )} */}
    </div >
  );
};

export default Recommendations;