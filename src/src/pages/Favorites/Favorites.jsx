import React, { useEffect, useState } from "react";
import "./Favorites.css";
import Header from "../../components/Header/Header";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listAction } from "../../store/actions/listAction";
import empty from "../../img/empty-box.svg";
import { GiAirplaneDeparture } from "react-icons/gi";
import { IoPricetagsOutline } from "react-icons/io5";
import { LiaBedSolid } from "react-icons/lia";
import { GiModernCity } from "react-icons/gi";
import Loader from "../../components/UI/Loader/Loader";

const Favorites = ({ Alert }) => {
  const [local, setLocal] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messages = true;
  const { loading, dataList, login } = useSelector((state) => state.list);
  const { dataFilter } = useSelector((state) => state.filter);
  console.log( dataList);
  

  useEffect(() => {
    if (login) {
      navigate("login");
    }
  }, [login]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    } else {
      Alert("Вы не авторизованы", "error");
      navigate("/login");
    }
  }, []);

  const headers = {
    Authorization: `Token ${local}`,
  };

  useEffect(() => {
    if (local) {
      dispatch(listAction({ headers }));
    }
  }, [local]);

  // <p className="tour-info-column">{
  //   dataFilter && dataFilter.meals && dataFilter.meals.meal.map((obj) => {
  //     const stringId = obj.id.toString();
  //     if (stringId.includes(el.tour.mealcode)) {
  //       return obj.russianfull;
  //     }
  //     return null;
  //   }).filter(Boolean).join(', ')
  // }</p>

  return (
    <div className="favorites">
      <Header messages={messages}><h1>Избранные</h1></Header>
    {/* {loading ? (
        dataList?.length === 0 || dataList?.every((el) => el.tour.length===0) ? (
          <h1 className="not_data">
            <img src={empty} alt="" />
            Пусто
          </h1>
        ) : (
          <div className="container">
            {dataList?.map((el, id) =>
              el.tour ? (
                <div
                  onClick={() => navigate(`/details-tour/${el.tourid}/favorit`)}
                  key={id}
                  className="contant_rec"
                >
                  <div className="rec_box">
                    <div className="contant_between">
                      <img src={el?.tour?.hotelpicturebig} alt="" />
                      <div className="content_rate">
                        <div>
                          {Array.from(
                            { length: el?.tour?.hotelstars },
                            (_, starIndex) => (
                              <span key={starIndex}>
                                <FaStar className="icon" size={15} />
                              </span>
                            )
                          )}
                          <h1>
                            {el?.tour?.hotelname}{" "}
                            <p className="country">
                              {el?.tour?.countryname}
                              {el?.tour?.hotelregionname &&
                                `, ${el?.tour?.hotelregionname}`}
                            </p>{" "}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="content_home">
                      <div className="contant_tour_one">
                        <div className="div">
                          <GiAirplaneDeparture className="icon" size={25} />
                          <div className="btnp">
                            <h3>
                              {el?.tour?.flydate}, <br /> {el?.tour?.nights} ночей
                            </h3>
                          </div>
                        </div>
                        <div className="div">
                          <LiaBedSolid className="icon" size={25} />
                          <div className="btnp">
                            <h3>{el?.tour?.room}</h3>
                          </div>
                        </div>
                        <div className="div">
                          <GiModernCity className="icon" size={25} />
                          <div className="btnp">
                            <h3>{el?.tour?.departurename}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="content_tour_two">
                        <p>
                          Цена за <br /> {`${el.tour.adults} взрослых`}
                          {el?.tour?.child !== "0" &&
                            `, ${el?.tour?.child} детей`}
                        </p>
                        <h3 className="price">
                          {el?.tour?.price} {el?.tour?.currency}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        )
      ) : (
        <div className="loading_div">
          <Loader />
        </div>
      )} */}
 {loading ? (
    dataList?.length === 0 || dataList?.every((el) => !el.tour || Object.keys(el.tour).length === 0) ? (
      <h1 className="not_data">
        <img src={empty} alt="" />
        Пусто
      </h1>
    ) : (
      <div className="container">
        {dataList
          ?.filter((el) => el.tour && Object.keys(el.tour).length > 0) // Убираем пустые объекты
          .map((el, id) => ( 
            <div
              onClick={() => navigate(`/details-tour/${el?.tourid}/favorit`)}
              key={id}
              className="contant_rec"
            >
              <div className="rec_box">
                <div className="contant_between">
                  {el?.tour?.hotelpicturebig && (
                    <img src={el?.tour?.hotelpicturebig} alt="Фото отеля" />
                  )}
                  <div className="content_rate">
                    <div>
                      {el?.tour?.hotelstars &&
                        Array.from({ length: el?.tour?.hotelstars }, (_, starIndex) => (
                          <span key={starIndex}>
                            <FaStar className="icon" size={15} />
                          </span>
                        ))}
                      <h1>
                        {el?.tour?.hotelname}
                        <p className="country">
                          {el?.tour?.countryname}
                          {el?.tour?.hotelregionname &&
                            `, ${el?.tour?.hotelregionname}`}
                        </p>
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="content_home">
                  <div className="contant_tour_one">
                    {el?.tour?.flydate && (
                      <div className="div">
                        <GiAirplaneDeparture className="icon" size={25} />
                        <div className="btnp">
                          <h3>{el?.tour?.flydate}, {el?.tour?.nights} ночей</h3>
                        </div>
                      </div>
                    )}
                    {el?.tour?.room && (
                      <div className="div">
                        <LiaBedSolid className="icon" size={25} />
                        <div className="btnp">
                          <h3>{el?.tour?.room}</h3>
                        </div>
                      </div>
                    )}
                    {el?.tour?.departurename && (
                      <div className="div">
                        <GiModernCity className="icon" size={25} />
                        <div className="btnp">
                          <h3>{el?.tour?.departurename}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="content_tour_two">
                    {el?.tour?.adults && (
                      <p>
                        Цена за <br /> {el?.tour?.adults} взрослых
                        {el?.tour?.child !== "0" && `, ${el?.tour?.child} детей`}
                      </p>
                    )}
                    {el?.tour?.price && (
                      <h3 className="price">
                        {el?.tour?.price} {el?.tour?.currency}
                      </h3>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    )
  ) : (
    <div className="loading_div">
      <Loader />
    </div>
  )}


    </div>
  );
};

export default Favorites;
