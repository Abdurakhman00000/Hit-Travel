import React, { useState } from "react";
import "./Users.css";
import { FaChild } from "react-icons/fa6";
import { FaChildReaching } from "react-icons/fa6";
import { FaPerson } from "react-icons/fa6";

const data = [
  {
    year: "До года",
  },
  {
    year: 1,
  },
  {
    year: 2,
  },
  {
    year: 3,
  },
  {
    year: 4,
  },
  {
    year: 5,
  },
  {
    year: 6,
  },
  {
    year: 7,
  },
  {
    year: 8,
  },
  {
    year: 9,
  },
  {
    year: 10,
  },
  {
    year: 11,
  },
  {
    year: 12,
  },
];

const Users = ({ count, price_child, setCount, setUserModal, bus }) => {
  const [userAdd, setUserAdd] = useState(false);

  console.log(count);

  const add = (el) => {
    const child = el.year === "До года" ? 0.5 : el.year;
    if (count.count3 === 0) {
      setCount({ ...count, count3: child });
      setUserAdd(false);
    } else if (count.count4 === 0) {
      setCount({ ...count, count4: child });
      setUserAdd(false);
    } else if (count.count5 === 0) {
      setCount({ ...count, count5: child });
      setUserAdd(false);
    }
  };

  return (
    <div className="user_tour">
      <h1 className="head">Кто летит</h1>
      <p
        style={{
          marginTop: 3,
          textAlign: "center",
          fontSize: 16,
          fontWeight: 400,
          color: "gray",
          marginBottom: 30,
        }}
      >
        {count.count1 === 1
          ? `${count.count1} взрослый`
          : count.count1 > 1 && `${count.count1} взрослых`}
        {count.count2
          ? count.count2 === 1
            ? `, ${count.count2} ребенок`
            : `, ${count.count2} детей`
          : ""}{" "}
      </p>
      <div className="user_box_tour">
        <div className="flex">
          <FaPerson size={23} className="icon" />
          <p>Взрослые</p>
        </div>
        <div className="btns">
          <button
            onClick={() =>
              count.count1 > 1
                ? setCount({ ...count, count1: count.count1 - 1 })
                : ""
            }
            className="btn"
          >
            -
          </button>
          <h1>{count.count1}</h1>
          <button
            onClick={() =>
              count.count1 < 8
                ? setCount({ ...count, count1: count.count1 + 1 })
                : ""
            }
            className="btn"
          >
            +
          </button>
        </div>
      </div>
      {count.count3 > 0 && (
        <div className="user_box_tour">
          <div className="flex">
            <FaChildReaching size={20} className="icon" />
            <p>
              Ребенок,{" "}
              {count.count3 >= 5
                ? `${count.count3} лет`
                : count.count3 === 1
                ? `${count.count3} год`
                : count.count3 === 0.5
                ? ` до года`
                : `${count.count3} года`}{" "}
            </p>
          </div>
          <button
            className="btn"
            onClick={() => setCount({ ...count, count3: 0 })}
          >
            -
          </button>
        </div>
      )}
      {count.count4 > 0 && (
        <div className="user_box_tour">
          <div className="flex">
            <FaChildReaching size={20} className="icon" />
            <p>
              Ребенок,{" "}
              {count.count4 >= 5
                ? `${count.count4} лет`
                : count.count4 === 1
                ? `${count.count4} год`
                : count.count4 === 0.5
                ? ` до года`
                : `${count.count4} года`}{" "}
            </p>
          </div>
          <button
            className="btn"
            onClick={() => setCount({ ...count, count4: 0 })}
          >
            -
          </button>
        </div>
      )}
      {count.count5 > 0 && (
        <div className="user_box_tour">
          <div className="flex">
            <FaChildReaching size={20} className="icon" />
            <p>
              Ребенок,{" "}
              {count.count5 >= 5
                ? `${count.count5} лет`
                : count.count5 === 1
                ? `${count.count5} год`
                : count.count5 === 0.5
                ? ` до года`
                : `${count.count5} года`}{" "}
            </p>
          </div>
          <button
            className="btn"
            onClick={() => setCount({ ...count, count5: 0 })}
          >
            -
          </button>
        </div>
      )}
      {!userAdd && count.count2 < 3 && (
        <div onClick={() => setUserAdd(true)} className="user_box_tour r">
          <div className="flex">
            <FaChild size={20} className="icon" />
            <p className="blue">Добавить ребенка</p>
          </div>
        </div>
      )}
      {userAdd && (
        <div className="chlid">
          <div className="between">
            <p style={{ color: "#888" }} className="mini">
              Укажите возраст ребенка
            </p>
            <p
              style={{ color: "var(--blue)" }}
              onClick={() => setUserAdd(false)}
              className="mini"
            >
              Отмена
            </p>
          </div>
          <div className="map">
            {data.map((el, index) => (
              <div onClick={() => add(el)} key={index} className="circle">
                {el.year}
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        style={{ marginTop: 20 }}
        onClick={() =>
          bus
            ? setUserModal({ ...count, closeDiv: false })
            : setUserModal(false)
        }
        className="button_form"
      >
        готово
      </button>
      {price_child !== 0 ? (
        <div className="child_data">
          <p className="child">За каждого младенца 80$</p>{" "}
          <p className="child_price">
            <span>Итог:</span>
            {price_child}$
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Users;
