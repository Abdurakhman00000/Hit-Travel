import React, { useEffect, useState } from "react";
import Segments from "../../components/UI/Segments/Segments";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { conditionsAction } from "../../store/actions/conditions";

const AirElement = ({ el, index }) => {
  const [isBaggage, setIsBaggage] = useState({
    states: false,
    data: [],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsBaggage({ ...isBaggage, states: el.is_baggage, data: "not" });
  }, [el.is_baggage]);

  const func = (e) => {
    e.stopPropagation();
    if (!el.is_baggage) {
      if (isBaggage.states) {
        setIsBaggage({
          ...isBaggage,
          states: false,
          data: [],
        });
      } else {
        if (el?.upgrades.length > 0) {
          setIsBaggage({
            ...isBaggage,
            states: true,
            data: el?.upgrades[0],
          });
        }
      }
    }
  };

  const summa = isBaggage.states
    ? el.price?.KGS?.amount + el?.upgrades[0]?.increase_price?.KGS
    : el.price?.KGS?.amount;

  const getDirectionLabel = (direction, directionIndex) => {
    if (directionIndex === 0) {
      return `Туда ${
        direction.length > 1
          ? direction.length == 2
            ? `1 пересадка`
            : `${direction.length - 1} пересадки`
          : "прямой"
      }`;
    } else {
      return `Обратно ${
        direction.length > 1
          ? direction.length == 2
            ? `1 пересадка`
            : `${direction.length - 1} пересадки`
          : "прямой"
      }`;
    }
  };

  const result = el?.segments.reduce(
    (acc, product) => {
      acc.baggage = Math.min(acc.baggage, product?.baggage?.weight ?? Infinity);
      acc.cbaggage = Math.min(
        acc.cbaggage,
        product?.cbaggage?.weight ?? Infinity
      );

      acc.is_baggage = acc.is_baggage && product.is_baggage;
      acc.is_change = acc.is_change && product.is_change;
      acc.is_refund = acc.is_refund && product.is_refund;

      acc.id = el.id;
      acc.price = el.price?.KGS?.amount;

      return acc;
    },
    {
      baggage: Infinity,
      cbaggage: Infinity,
      is_baggage: true,
      is_change: true,
      is_refund: true,
      id: false,
      price: false,
    }
  );

  const array = [result, ...(el.upgrades || [])];

  return (
    <div
      key={el.id}
      className={`air_box ${index === 0 && "b"}`}
      onClick={() => {
        dispatch(conditionsAction(array));
        navigate(
          `/detail-air/${
            isBaggage.data == "not" || isBaggage.data.length == 0
              ? el.id
              : isBaggage.data.id
          }`
        );
      }}
    >
      {index === 0 && (
        <div className="cheap">
          <p>Самый дешевый</p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="reis_div r" style={{padding: "0 15px"}}>
          <img
            className={
              el?.provider?.supplier?.logo == null ? "fly gray" : "fly"
            }
            src={el?.provider?.supplier?.logo}
            alt=""
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "#000",
              }}
            >
              {el?.provider?.supplier?.title}
            </p>
            {el?.segments_direction?.map((direction, directionIndex) => (
              <p
                key={directionIndex}
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: "rgb(114 112 112)",
                }}
              >
                {getDirectionLabel(direction, directionIndex)}
              </p>
            ))}
          </div>
        </div>
        {el.type == "lowcost" && (
          <p
            style={{
              marginRight: 16,
              fontSize: 14,
              fontWeight: "400",
              color: "var(--black)",
            }}
          >
            Лоукостер
          </p>
        )}
      </div>
      {el?.segments?.map((item) => (
        <Segments
          key={item.id}
          code1={item.dep?.airport.code}
          code2={item.arr?.airport.code}
          from_time={item.dep?.time}
          from_date={item.dep?.date}
          from_city={item.dep.city.title}
          from_country={item.dep.country.title}
          to_time={item.arr?.time}
          to_date={item.arr?.date}
          to_city={item.arr.city.title}
          to_country={item.arr.country.title}
          hour={item?.duration?.flight?.hour}
          minute={item?.duration?.flight?.minute}
        />
      ))}
      <div
        style={{
          padding: "0 16px",
        }}
      >
        <div onClick={func} className="baggage">
          {isBaggage.states ? (
            <p className="text_bag">Багаж включен</p>
          ) : (
            <p className="text_bag">
              {" "}
              Багаж{" "}
              <span>
                {" "}
                {el?.upgrades.length > 0 &&
                  ` + ${el?.upgrades[0]?.increase_price?.KGS} KGS`}
              </span>{" "}
            </p>
          )}
          <div className="circle_bag">
            {isBaggage.states && <div className="round_the_bag"></div>}
          </div>
        </div>
      </div>
      <div className="bottom_box_ticket">
        <div>
          <p className="price">
            {isBaggage.data === "not" ? el.price.KGS.amount : summa} KGS
          </p>
          <p className="bagaj">
            {isBaggage.states ? "С багажом" : "Без багажа"}, за одного
          </p>
          <p className="people">Осталось мест {el?.segments[0]?.seats}</p>
        </div>
        <div>
          <button
            onClick={() => navigate(`/detail-air/${el.id}`)}
            className="handle"
          >
            Выбрать билет
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirElement;
