import React, { useEffect, useState } from "react";
import "./TicketRequest.css";
import Loader from "../../components/UI/Loader/Loader";
import Header from "../../components/Header/Header";
import { url } from "../../Api";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Segments from "../../components/UI/Segments/Segments";
import Loading from "../../components/UI/Loading/Loading";
import { MdOutlineHistory } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import { deepAction } from "../../store/actions/deep";
import ModalBottom from "../../components/UI/ModalBottom/ModalBottom";

const TicketRequest = ({ Alert }) => {
  const { cancel } = useParams();
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        url + `/avia/booking-history/${cancel}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(response);

      setTicket(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cancel]);

  // const CancelTicket = async (id) => {
  //   console.log(id);

  //   const token = localStorage.getItem("token");
  //   setLoader(true);
  //   const newData = {
  //     booking_id: ticket?.id,
  //     billing_number: ticket?.billing_number,
  //   };
  //   try {
  //     const response = await axios.post(
  //       url + "/avia/booking-cancel/",
  //       newData,
  //       {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data?.success) {
  //       navigate("/dashboard/history");
  //       // navigate(`/ticket-request/${id}`);

  //       Alert(response.data.message, "success");
  //     }

  //     setLoader(false);
  //   } catch (error) {
  //     console.log("cancel api", error);
  //     setLoader(false);
  //   }
  // };


  const CancelTicket = async (id) => {  
    const token = localStorage.getItem("token");
    setLoader(true);
    const newData = {
      booking_id: ticket?.id,
      billing_number: ticket?.billing_number,
    };
    try {
      const response = await axios.post(
        url + "/avia/booking-cancel/",
        newData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
 
      if (response?.data?.success) {
        
        const updatedTicket = { ...ticket, status: response?.data?.data?.status };
        setTicket(updatedTicket);
  
        setModal(false);
  
        Alert("успешно", 'success');
  
        // navigate("/dashboard/history");
      }
  
      setLoader(false);
    } catch (error) {
      console.log("cancel api", error);
      setLoader(false);
    }
  };

  const online = () => {
    const datasing = {
      amount: ticket.amount,
      currency: "KGS",
      status: null,
      timeout: null,
      datasis: {
        transaction_id: ticket.transaction_id,
      },
      paymentType: "finik",
      productType: "air",
    };
    dispatch(deepAction(datasing));
    navigate("/payment");
  };
  console.log(ticket);

  return (
    <div className="ticket_request">
      {loading ? (
        <div className="loading_div">
          <Loader />
        </div>
      ) : (
        <>
          <Header>
            <h1>Билет</h1>
          </Header>
          <div className="detail_air_comp">
            <div className="container">
              <div className="air_box">
                {ticket &&
                  ticket?.segments.map((item, index) => (
                    <Segments
                      key={index}
                      from_time={item?.time_from}
                      from_date={item?.date_from}
                      from_city={item?.from_name}
                      from_country={item?.from_country}
                      to_time={item?.time_to}
                      to_date={item?.date_to}
                      to_city={item?.to_name}
                      to_country={item?.to_country}
                      hour={item?.duration_hour}
                      minute={item?.duration_minute}
                    />
                  ))}
              </div>
              <div className="grid">
                <div className="column">
                  <p className="text">Класс:</p>
                  <p className="title">{ticket?.book_class}</p>
                </div>
                <div className="hr"></div>
                <div className="column">
                  <p className="text">Статус:</p>
                  {ticket?.status === "Бронирован" && (
                    <p className="status yellow">
                      <MdOutlineHistory size={22} />
                      Забронировано
                    </p>
                  )}
                  {ticket?.status === "Оплачено" && (
                    <p className="status green">
                      <BsCheckCircleFill size={16} />
                      {ticket?.status}
                    </p>
                  )}
                  {ticket.status === "Отменено" && (
                    <p
                      style={{ justifyContent: "center" }}
                      className="status red"
                    >
                      <BsCheckCircleFill size={16} />
                      {ticket.status}
                    </p>
                  )}
                </div>
                <div className="hr"></div>
                <div className="column">
                  <p className="text left">Цена:</p>
                  <p className="price left">{ticket?.amount} KGS</p>
                </div>
                {ticket?.status === "Бронирован" && (
                  <>
                    <div className="hr"></div>
                    <div className="column">
                      <button
                        onClick={online}
                        style={{ margin: 0 }}
                        className="button_form"
                      >
                        Оплатить онлайн
                      </button>
                    </div>
                  </>
                )}
              </div>
              {ticket?.status === "Бронирован" && (
                <div className="info">
                  <IoIosInformationCircle color="#ff0000" size={30} />
                  <div>
                    <p className="text">
                      До истечения текущего билета осталось {ticket?.timeout}{" "}
                      минут. Если оплата не будет произведена, билет будет
                      аннулирован.
                    </p>
                  </div>
                </div>
              )}
              {ticket?.status === "Бронирован" && (
                <button
                  disabled={loader}
                  onClick={() => setModal(true)}
                  className="button-cancel"
                >
                  {loader ? <Loading color={"#fff"} /> : "Отменить билет"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
      {modal && (
        <ModalBottom close={() => setModal(false)}>
          <div className="container_modal">
            <p></p>
            <p className="text_modal">
              Вы уверены, <br /> что хотите отменить ваш билет?
            </p>
            <div className="flex_modal">
              <button
                disabled={loader}
                onClick={() => setModal(false)}
                className="button-cancel-modal"
              >
                {loader ? <Loading color={"#fff"} /> : "Отменить"}
              </button>
              <button
                disabled={loader}
                onClick={() => CancelTicket(ticket.id)}
                className="button-ok"
              >
                {loader ? <Loading color={"#fff"} /> : "Подтвердить"}
              </button>
            </div>
          </div>
        </ModalBottom>
      )}
    </div>
  );
};

export default TicketRequest;




