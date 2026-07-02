import React, { useEffect, useState } from "react";
import "./Сompilation.css";
import axios from "axios";
import { url } from "../../Api";
import { useNavigate } from "react-router-dom";
import Loader from "../UI/Loader/Loader";

const Сompilation = () => {
  const [tour, setTour] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(url + "/api/hottours")
      .then((response) => {
        setTour(response.data.hottours.tour);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);
  console.log(tour);

  return (
    <div className="compilation">
      <div class="containers">
        <div className="tour">
          <h1>Подборка горящих туров</h1>
          {loading ? (
            <div className="loading_div">
              <Loader />
            </div>
          ) : (
            <div className="map_boxs">
              {tour.map((el, id) => (
                <div
                  onClick={() => navigate(`/details-tour/${el.tourid}`)}
                  key={id}
                  className="compilation_box"
                >
                  {el.hotelpicture ? (
                    <div>
                      <img src={"https:" + el.hotelpicture} alt="" />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="tour-info-wrap">
                    <h1>{el.countryname}</h1>
                    <div className="like">
                      <p>
                        От <span className="old">{el.priceold}</span> {el.price}{" "}
                        {el.currency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Сompilation;
