import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppSite from "./pages/AppSite/AppSite";
import NotFaundPage from "./pages/NotFaundPage/NotFaundPage";
import Toolbar from "./components/Toolbar/Toolbar";
import PersonalArea from "./pages/PersonalArea/PersonalArea";
import { useDispatch, useSelector } from "react-redux";
import { paramsAction } from "./store/actions/paramsAction";
import { Alert } from "./components/UI/Alert/Alert";
import { personalAction } from "./store/actions/personalAction";
import axios from "axios";
import { url } from "./Api";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { PiAppStoreLogoBold } from "react-icons/pi";
import { FaGooglePlay } from "react-icons/fa";
import { airParamsAction } from "./store/actions/airParamsAction";
import { countAction } from "./store/actions/count";

function App() {
  const [openAlert, setOpenAlert] = useState({
    open: false,
    props: "",
    text: "",
  });
  const [local, setLocal] = useState("");
  const [version, setVersion] = useState([]);
  const [upDate, setUpDate] = useState(false);
  const { personal } = useSelector((state) => state.personal);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(countAction([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    } else {
      setLocal(token);
    }
  }, [location]);

  const headers = {
    Authorization: `Token ${local}`,
  };

  useEffect(() => {
    handleScroll();
  }, [location]);

  useEffect(() => {
    dispatch(paramsAction());
    if (local) {
      dispatch(airParamsAction({ code: "", head: headers }));
    }
  }, [local]);

  useEffect(() => {
    if (local) {
      dispatch(personalAction({ headers })).catch((error) => {
        console.log(error);
        navigate("/login");
        localStorage.setItem("token", "");
        localStorage.setItem("email", "");
      });
    }
  }, [local]);

  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function FuncAlert(text, props) {
    setTimeout(() => {
      setOpenAlert({
        ...openAlert,
        open: true,
        text: text,
        props: props,
      });
    }, 200);
    setOpenAlert({ ...openAlert, open: false });
  }

  useEffect(() => {
    if (openAlert.open) {
      const timeoutId = setTimeout(() => {
        setOpenAlert({ ...openAlert, open: false });
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [openAlert.open]);

  useEffect(() => {
    axios
      .get(url + "/versions")
      .then((response) => {
        setVersion(response.data);
      })
      .catch((error) => { console.log(error) });
  }, []);

  useEffect(() => {
    if (version && version.version && window.cordova && window.cordova.getAppVersion) {
      window.cordova.getAppVersion.getVersionNumber().then(function (appVersion) {
        if (String(appVersion).replaceAll(".", "") < String(version.version).replaceAll(".", "")) {
          setUpDate(true)
        }
      })
    }
  }, [version]);

  return (
    <>
      {upDate && (
        <div className="version">
          <div className="verson_block">
            <BsFillArrowDownCircleFill color="var(--blue)" size={75} />
            <h1>Доступно обновление</h1>
            <a href={version.appstore} target="blank" className="dowload app">
              <button className="button_form">
                <PiAppStoreLogoBold size={20} />
                Обновить
              </button>
            </a>
            <a
              href={version.googleplay}
              target="blank"
              className="dowload play"
            >
              <button className="button_form">
                <FaGooglePlay size={20} />
                Обновить
              </button>
            </a>
            <p onClick={() => setUpDate(false)} className="up_date">
              Обновить позже
            </p>
          </div>
        </div>
      )}
      {openAlert.open && (
        <Alert
          state={openAlert}
          setState={setOpenAlert}
          propsData={openAlert.props}
          text={openAlert.text}
        />
      )}
      <div className="App">
        <Routes>
          <Route
            path="/*"
            element={<AppSite local={local} Alert={FuncAlert} />}
          />
          <Route
            path="dashboard/*"
            element={<PersonalArea Alert={FuncAlert} />}
          />
          <Route path="*" element={<NotFaundPage />} />
        </Routes>
        {location.pathname.startsWith("/city-and-country") ? null : <Toolbar />}
      </div>
    </>
  );
}

export default App;
