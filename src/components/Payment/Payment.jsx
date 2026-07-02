import React, { useEffect, useState } from "react";
import "../../pages/Decor/Decor.css";
import "./Payment.css";
import Header from "../Header/Header";
import Loader from "../UI/Loader/Loader";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosInformationCircle } from "react-icons/io";
import { createFinikPayment } from "../../api/finikPayment";
import { getApiErrorMessage } from "../../api/http";
import finikLogo from "../../img/hit-logo.png";

const FINIK_PRODUCTS = new Set(["air", "insurance"]);

const Payment = ({ Alert }) => {
  const { deep } = useSelector((state) => state.deep);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  const transactionId = deep?.datasis?.transaction_id;
  const isFinikPayment =
    deep?.paymentType === "finik" || FINIK_PRODUCTS.has(deep?.productType);

  useEffect(() => {
    if (!transactionId || !isFinikPayment) {
      setLoading(false);
      return;
    }

    const initPayment = async () => {
      try {
        const redirectPath = deep?.policyId
          ? `/payment/success?type=insurance&policy_id=${deep.policyId}`
          : "/payment/success?type=air";
        const data = await createFinikPayment(transactionId, redirectPath);
        setPaymentData(data);
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        Alert(message, "error");
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [transactionId, isFinikPayment]);

  if (loading) {
    return (
      <div className="loading_div">
        <Loader />
      </div>
    );
  }

  if (!transactionId || !isFinikPayment) {
    return (
      <div className="decor pay">
        <Header>
          <h1>Онлайн оплата</h1>
        </Header>
        <div className="container">
          <div className="pay_unavailable">
            <IoIosInformationCircle color="var(--blue)" size={32} />
            <p>
              Онлайн-оплата через Finik доступна для авиабилетов, ОСАГО, КАСКО и ВЗР.
            </p>
            <button type="button" className="button_form" onClick={() => navigate("/")}>
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  const amount = paymentData?.amount ?? deep?.amount;
  const paymentUrl = paymentData?.payment_url;

  return (
    <div className="decor pay">
      <Header>
        <h1>Оплата Finik Pay</h1>
      </Header>
      <div className="container">
        <div className="summa">
          <div className="between">
            <p className="gray">К оплате</p>
            <p className="text">
              {Number(amount || 0).toFixed(2)} {deep?.currency || "KGS"}
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

        <div className="finik_pay_info">
          <p>После успешной оплаты заказ будет обработан автоматически.</p>
        </div>

        {error && <div className="payment_error">{error}</div>}

        {paymentUrl ? (
          <a href={paymentUrl} target="_blank" rel="noreferrer" className="finik_pay_link">
            <div className="oplata_div finik_pay_card">
              <img src={finikLogo} alt="Finik Pay" className="finik_pay_logo" />
              <div>
                <strong>Оплатить через Finik Pay</strong>
                <span>QR / банковское приложение</span>
              </div>
            </div>
          </a>
        ) : (
          !error && (
            <button type="button" className="button_form" disabled>
              Ссылка на оплату загружается...
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Payment;
