import React, { useEffect, useState } from "react";
import "./BusDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import axios from "axios";
import { url } from "../../Api";
import empty from "../../img/empty-box.svg";
import { VscFilePdf } from "react-icons/vsc";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Slider from "react-slick";
import { busAction } from "../../store/actions/busAction";
import { useDispatch } from "react-redux";
import Loader from "../../components/UI/Loader/Loader";
import { GiNightSleep } from "react-icons/gi";
import { WiDaySunnyOvercast } from "react-icons/wi";
import Modal from 'react-modal';
// import { VscFilePdf } from 'react-icons/vsc';

const BusDetails = ({ local, Alert }) => {
  const { buscode } = useParams();
  const [busDetail, setBusDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(false);
  const [description, setDescription] = useState(true);
  const [programm, setProgramm] = useState(false);
  const [conditions, setConditions] = useState(false);
  const [excursions, setExcursions] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [docs, setDocs] = useState(false);
  const [photo, setPhoto] = useState({
    img: "",
    open: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const openModal = (url) => {
    setPdfUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl('');
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const headers = {
    Authorization: `Token ${local}`,
  };

  useEffect(() => {
    setLoading(true);
    if (local) {
      axios
        .get(url + `/bus-tour/detail/${buscode}`, { headers })
        .then((response) => {
          setBusDetail(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    } else {
      axios
        .get(url + `/bus-tour/detail/${buscode}`)
        .then((response) => {
          setBusDetail(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (busDetail) {
      dispatch(busAction([]));
      dispatch(busAction(busDetail));
    }
  }, [busDetail]);

  return (
    <div className="bus_details">
      <Header>
        <h1>Детали тура</h1>
      </Header>
      {loading ? (
        <div className="loading_div">
          <Loader />
        </div>
      ) : busDetail.gallery ? (
        <>
          <div className="slide">
            <Slider {...settings} className="slide_border">
              {busDetail.gallery.slice(0, 6).map((el, id) => (
                <div key={id}>
                  <img src={el.img} alt="" />
                </div>
              ))}
            </Slider>
          </div>
          <div className="container">
            <div className="bus_details_blocks">
              <h1>{busDetail.title ? busDetail.title : ""}</h1>
              {busDetail.cities.length > 0 && (
                <p className="day_night">
                  По городам: {busDetail.cities.map((el) => el.name).join(", ")}{" "}
                </p>
              )}
              <p className="day_night">
                <WiDaySunnyOvercast size={20} color="var(--blue)" />
                {busDetail.days ? `${busDetail.days} дней` : ""}
              </p>
              <p className="day_night">
                <GiNightSleep size={20} color="var(--blue)" />
                {busDetail.nights ? `${busDetail.nights} ночей` : ""}
              </p>
            </div>
            <div className="btns">
              {busDetail?.description && busDetail?.description.length > 0 && (
                <button
                  style={{
                    color: description ? "var(--blue)" : "#000",
                  }}
                  onClick={() => {
                    setDescription(true);
                    setProgramm(false);
                    setConditions(false);
                    setExcursions(false);
                    setReviews(false);
                    setGallery(false);
                    setDocs(false);
                  }}
                  className="link"
                >
                  Общее описание
                </button>
              )}
              {busDetail?.programs && busDetail?.programs.length > 0 && (
                <button
                  style={{
                    color: programm ? "var(--blue)" : "#000",
                  }}
                  onClick={() => {
                    setDescription(false);
                    setProgramm(true);
                    setConditions(false);
                    setExcursions(false);
                    setReviews(false);
                    setGallery(false);
                    setDocs(false);
                  }}
                  className="link"
                >
                  Программа
                </button>
              )}
              {busDetail?.conditions && busDetail?.conditions.length > 0 && (
                <button
                  style={{
                    color: conditions ? "var(--blue)" : "#000",
                  }}
                  onClick={() => {
                    setDescription(false);
                    setProgramm(false);
                    setConditions(true);
                    setExcursions(false);
                    setReviews(false);
                    setGallery(false);
                    setDocs(false);
                  }}
                  className="link"
                >
                  Условие тура
                </button>
              )}
              {busDetail?.excursions && busDetail?.excursions.length > 0 && (
                <button
                  style={{
                    color: excursions ? "var(--blue)" : "#000",
                  }}
                  onClick={() => {
                    setDescription(false);
                    setProgramm(false);
                    setConditions(false);
                    setExcursions(true);
                    setReviews(false);
                    setGallery(false);
                    setDocs(false);
                  }}
                  className="link"
                >
                  Экскурсии
                </button>
              )}
              {busDetail.reviews && busDetail.reviews.length > 0 && (
                <button
                  style={{
                    color: reviews ? "var(--blue)" : "#000",
                  }}
                  onClick={() => {
                    setDescription(false);
                    setProgramm(false);
                    setConditions(false);
                    setExcursions(false);
                    setReviews(true);
                    setGallery(false);
                    setDocs(false);
                  }}
                  className="link"
                >
                  Отзывы
                </button>
              )}
              {busDetail?.gallery && busDetail?.gallery.length > 0 && (
                <button
                  style={{
                    color: gallery ? "var(--blue)" : "#000",
                  }}
                  onClick={() => {
                    setDescription(false);
                    setProgramm(false);
                    setConditions(false);
                    setExcursions(false);
                    setReviews(false);
                    setGallery(true);
                    setDocs(false);
                  }}
                  className="link"
                >
                  Галерея
                </button>
              )}
              {busDetail?.description_pdf &&
                busDetail?.description_pdf.length > 0 && (
                  <button
                    style={{
                      color: gallery ? "var(--blue)" : "#000",
                    }}
                    onClick={() => {
                      setDescription(false);
                      setProgramm(false);
                      setConditions(false);
                      setExcursions(false);
                      setReviews(false);
                      setGallery(false);
                      setDocs(true);
                    }}
                    className="link"
                  >
                    Документы
                  </button>
                )}
            </div>
            <div className="bus_details_pages">
              {description && busDetail.description && (
                <div className="bus_details_block">
                  {busDetail.description && (
                    <div
                      className="bus_details_description"
                      style={{ overflow: "hidden", height: next ? "auto" : 41 }}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: busDetail.description,
                        }}
                      ></p>
                    </div>
                  )}
                  <p onClick={() => setNext(!next)} className="next">
                    Подробнее{" "}
                    {next ? (
                      <MdKeyboardArrowUp className="icon_next" size={20} />
                    ) : (
                      <MdKeyboardArrowDown className="icon_next" size={20} />
                    )}
                  </p>
                </div>
              )}
              {programm &&
                busDetail.programs &&
                busDetail.programs.map((el, id) => (
                  <div key={id} className="bus_details_block">
                    <h2>
                      {el.day}. {el.title}
                    </h2>
                    <div className="hr"></div>
                    <p dangerouslySetInnerHTML={{ __html: el.body }}></p>
                  </div>
                ))}
              {conditions &&
                busDetail.conditions &&
                busDetail.conditions.map((el, id) => (
                  <div key={id} className="bus_details_block">
                    <h2>{el.title}</h2>
                    <div className="hr"></div>
                    <p dangerouslySetInnerHTML={{ __html: el.body }}></p>
                  </div>
                ))}
              {excursions &&
                busDetail.excursions &&
                busDetail.excursions.map((el, id) => (
                  <div key={id} className="bus_details_block">
                    <h2>{el.title}</h2>
                    <div className="hr"></div>
                    <p dangerouslySetInnerHTML={{ __html: el.body }}></p>
                  </div>
                ))}
              {reviews &&
                busDetail.reviews &&
                busDetail.reviews.map((el, id) => (
                  <div key={id} className="bus_details_block">
                    <h2 className="created">
                      {el.full_name}{" "}
                      <span className="created_at">{el.created_at}</span>{" "}
                    </h2>
                    <div className="hr"></div>
                    <p dangerouslySetInnerHTML={{ __html: el.body }}></p>
                  </div>
                ))}
              {gallery && busDetail.gallery.length > 0 && (
                <div className="gallery">
                  {busDetail.gallery.map((el, id) => (
                    <>
                      <img
                        onClick={() =>
                          setPhoto({ ...photo, img: el.img, open: true })
                        }
                        className="gallery_img"
                        src={el.img}
                        alt=""
                      />
                    </>
                  ))}
                </div>
              )}
              {docs && busDetail.description_pdf.length > 0 && (
                <div className="bus_details_block">
                  {busDetail.description_pdf.length > 0 && (
                      <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        openModal(busDetail.description_pdf);
                      }}
                    >
                      <VscFilePdf className="icon" size={23} />
                      Скачать описание тура PDF документом
                    </a>
                  )}
                </div>
              )}
                  <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="PDF Modal">
        <div className="modal-content">
          <button onClick={closeModal} className="close-btn" >Закрыть</button>
          <embed src={pdfUrl} width="100%" height="550px" />
        </div>
      </Modal>
              {/* {docs && busDetail.description_pdf.length > 0 && (
                <div className="bus_details_block">
                  {busDetail.description_pdf.length > 0 && (
                    <a href={busDetail.description_pdf}>
                      <VscFilePdf className="icon" size={23} />
                      Скачать описание тура PDF документом
                    </a>
                  )}
                </div>
              )} */}

              {photo.open && (
                <div className="photo">
                  <div className="photo_div">
                    <div
                      onClick={() =>
                        setPhoto({ ...photo, open: false, img: "" })
                      }
                      className="not"
                    ></div>
                    <img src={photo.img} alt="" />
                  </div>
                </div>
              )}
            </div>
            {busDetail.isrequested ? (
              ""
            ) : (
              <button
                style={{ marginTop: 12 }}
                onClick={() =>
                  local
                    ? navigate(`/decor/${busDetail.id}/${busDetail.isbustour}`)
                    : Alert("Вы не авторизованы!", "error") ||
                      navigate("/login")
                }
                className="button_form fixed"
              >
                Далее
              </button>
            )}
          </div>
        </>
      ) : (
        <h1 className="not_data">
          <img src={empty} alt="" />
          Пусто
        </h1>
      )}
    </div>
  );
};

export default BusDetails;
