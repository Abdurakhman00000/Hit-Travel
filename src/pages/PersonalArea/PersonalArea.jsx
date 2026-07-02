import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Cabinet from "../Сabinet/Cabinet";
import NotFaundPage from "../NotFaundPage/NotFaundPage";
import History from "../History/History";
import Notifications from "../Notifications/Notifications";
import Specific from "../Specific/Specific";
import { personalAction } from "../../store/actions/personalAction";
import { useDispatch, useSelector } from "react-redux";
import ChanchePassword from "../ChanchePassword/ChanchePassword";
import BonusHistory from "../BonusHistory/BonusHistory";

const PersonalArea = ({ Alert }) => {
  const location = useLocation();
  const [local, setLocal] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { personal } = useSelector((state) => state.personal);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLocal(token);
    } else {
      Alert("Вы не авторизованы", "error");
      navigate("/login");
    }
  }, [location]);

  const headers = {
    Authorization: `Token ${local}`,
  };

  function ChagePersonal() {
    if (local) {
      dispatch(personalAction({ headers }));
    }
  }

  return (
    <div id="personal_area">
      <Routes>
        <Route index element={<Cabinet Alert={Alert} personal={personal} />} />
        <Route path="bonus-history" element={<BonusHistory />} />
        <Route path="history" element={<History />} />
        <Route path="notifications" element={<Notifications />} />
        <Route
          path="chanche-password"
          element={<ChanchePassword Alert={Alert} />}
        />
        <Route
          path="specific"
          element={
            <Specific
              Alert={Alert}
              ChagePersonal={ChagePersonal}
              personal={personal}
              headers={headers}
            />
          }
        />
        <Route path="*" element={<NotFaundPage />} />
      </Routes>
    </div>
  );
};

export default PersonalArea;
