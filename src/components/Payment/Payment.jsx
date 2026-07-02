import React, { useEffect, useState } from "react";
import "../../pages/Decor/Decor.css";
import "./Payment.css";
import Header from "../Header/Header";
import axios from "axios";
import { url } from "../../Api";
import { useSelector } from "react-redux";
import { IoIosInformationCircle } from "react-icons/io";
import Loader from "../UI/Loader/Loader";

const Payment = ({ Alert }) => {
  const { deep } = useSelector((state) => state.deep);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState();

  const visa = async () => {
    if (deep?.datasis?.transaction_id) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          `${url}/payler/pay/`,
          {
            order_id: deep.datasis.transaction_id,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (response?.data?.url) {
          setLink(response.data.url);
        } else if (response?.data?.response === false) {
          setLink(deep.datasis.payler_url || "");
        } else {
          Alert("Ссылка для оплаты не найдена", "error");
        }
      } catch (error) {
        console.error("Payment Error:", error);
        Alert("Произошла ошибка при загрузке данных", "error");
      } finally {
        setLoading(false);
      }
    } else {
      Alert("Сейчас недоступно", "info");
      setLoading(false);
    }
  };

  useEffect(() => {
    visa();
  }, [deep?.datasis?.transaction_id]);

  if (loading) {
    return (
      <div className="loading_div">
        <Loader />
      </div>
    );
  }

  // const handleLinkClick = (e) => {
  //   console.log("Payment Link:", link);
  //   if (link && link.startsWith("http")) {
  //     window.open(link, "_self");
  //   } else {
  //     e.preventDefault();
  //     Alert("Ссылка для оплаты недоступна", "error");
  //   }
  // };

  return (
    <div className="decor pay">
      <Header>
        <h1>Онлайн оплата</h1>
      </Header>
      <div className="container">
        <div className="summa">
          {/* {deep?.data?.price && (
            <>
              <div className="between">
                <p className="gray">Сумма</p>
                <p className="text">
                  {deep?.data?.price && deep?.data?.price.toFixed(2)}{" "}
                  {deep?.data.currency === 1
                    ? "EUR"
                    : deep?.data.currency === 2
                    ? "USD"
                    : deep?.data.currency === "KGS"
                    ? deep?.data.currency
                    : "KGS"}
                </p>
              </div>
              <div className="hr"></div>
            </>
          )}
          {deep?.data?.paid && (
            <>
              <div className="between">
                <p className="gray">Оплачено</p>
                <p className="text">
                  {deep?.data.paid}{" "}
                  {deep?.data.currency === 1
                    ? "EUR"
                    : deep.data.currency === 2
                    ? "USD"
                    : deep?.data.currency === "KGS"
                    ? deep?.data.currency
                    : "KGS"}{" "}
                </p>
              </div>
              <div className="hr"></div>
            </>
          )} */}
          <div className="between">
            <p className="gray">К оплате</p>
            <p className="text">
              {deep?.amount.toFixed(2)} {deep?.currency}
            </p>
          </div>
        </div>
        {deep?.status === "Бронирован" && (
          <div className="info">
            <IoIosInformationCircle color="#ff0000" size={30} />
            <div>
              <p className="text">
                До истечения текущего билета осталось {deep?.timeout} минут.
                Если оплата не будет произведена, билет будет аннулирован.
              </p>
            </div>
          </div>
        )}
        <h2>Оплата через:</h2>
        {deep?.deeplink ? (
          <a
            style={{
              position: "relative",
              top: 12,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            href={deep?.deeplink}
            target="blank"
          >
            <div className="oplata_div">
              <img
                style={{
                  width: 30,
                  height: 30,
                }}
                src="https://play-lh.googleusercontent.com/xf5_bSz5pNxQHd2K9yig3wM8LAaDigaLhMWdjsVKwSPW0CoyFXoJNUr7Iix1hzTgyg0"
                alt=""
              />
              MBANK
            </div>
          </a>
        ) : (
          <p>Оплата через MBANK недоступна</p>
        )}
        {link && (
          <a
            href={link || "#"}
            target="_blank"
            // onClick={handleLinkClick}
            style={{
              position: "relative",
              top: 12,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            rel="noreferrer"
          >
            <div className="oplata_div">
              <img
                style={{
                  width: 30,
                  height: 30,
                }}
                src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png"
                alt="Оплата картой"
              />
              Оплата картой
            </div>
          </a>
        )}
        {/* )} */}
        {/* <div
          onClick={() => navigate("/dashboard/history")}
          style={{
            marginTop: 22,
            background: "#fff",
            color: "#888",
            boxShadow: "none",
          }}
          className="button_form"
        >
          Оплатить позже
        </div> */}
      </div>
    </div>
  );
};

export default Payment;
