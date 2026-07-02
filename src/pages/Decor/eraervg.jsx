import React, { useEffect, useState } from "react";
import "./Decor.css";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

const FormDetails = ({ Alert, gg, FuncData }) => {
  const [stateData, setStateData] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    first_name: "",
    last_name: "",
    dateofborn: "",
    passport_id: "",
    issued_by: "",
  });

  const [valueDecorTourist, setValueDecorTourist] = useState({
    id: "",
    first_name: "",
    last_name: "",
    dateofborn: "",
    passport_id: "",
    issued_by: "",
  });

  useEffect(() => {
    setValueDecorTourist((prevValue) => ({ ...prevValue, id: gg }));
  }, [gg]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValueDecorTourist((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newValidationErrors = {};

    if (valueDecorTourist.dateofborn === "") {
      newValidationErrors.dateofborn = "Обязательное поле.";
    }
    if (valueDecorTourist.first_name === "") {
      newValidationErrors.first_name = "Обязательное поле.";
    }
    if (valueDecorTourist.last_name === "") {
      newValidationErrors.last_name = "Обязательное поле.";
    }
    if (valueDecorTourist.passport_id === "") {
      newValidationErrors.passport_id = "Обязательное поле.";
    }
    if (valueDecorTourist.issued_by === "") {
      newValidationErrors.issued_by = "Обязательное поле.";
    }

    if (Object.keys(newValidationErrors).length === 0) {
      setValidationErrors({});
      FuncData(valueDecorTourist);
      setStateData(false);
      Alert("Путешественник успешно добавлен", "success");
    } else {
      setValidationErrors(newValidationErrors);
    }
  };

  return (
    <div className="tour_block">
      <div
        style={{ height: 30 }}
        onClick={() => setStateData(!stateData)}
        className="tourist"
      >
        <h1>Путешественник</h1>
        {stateData ? (
          <MdKeyboardArrowDown color="var(--blue)" size={30} />
        ) : (
          <MdKeyboardArrowUp color="var(--blue)" size={30} />
        )}
      </div>
      {stateData && (
        <>
          <div className="decor_div">
            <label className="label_form">Имя по загранпаспорту</label>
            <input
              className="input_form"
              value={valueDecorTourist.first_name}
              onChange={handleInputChange}
              type="text"
              placeholder="Имя"
              name="first_name"
            />
            {validationErrors.first_name && (
              <p className="red">{validationErrors.first_name}</p>
            )}
          </div>
          <div className="decor_div">
            <label className="label_form">Фамилия по загранпаспорту</label>
            <input
              className="input_form"
              value={valueDecorTourist.last_name}
              onChange={handleInputChange}
              type="text"
              placeholder="Фамилия"
              name="last_name"
            />
            {validationErrors.last_name && (
              <p className="red">{validationErrors.last_name}</p>
            )}
          </div>
          <div className="decor_div">
            <label className="label_form">Дата рождения</label>
            <input
              className="input_form"
              value={valueDecorTourist.dateofborn}
              onChange={handleInputChange}
              type="date"
              name="dateofborn"
            />
            {validationErrors.dateofborn && (
              <p className="red">{validationErrors.dateofborn}</p>
            )}
          </div>
          <div className="decor_div">
            <label className="label_form">Серия и номер</label>
            <input
              className="input_form"
              value={valueDecorTourist.passport_id}
              onChange={handleInputChange}
              type="text"
              placeholder=""
              name="passport_id"
            />
            {validationErrors.passport_id && (
              <p className="red">{validationErrors.passport_id}</p>
            )}
          </div>

          <div className="decor_div">
            <label className="label_form">Орган, выдавший з/п</label>
            <input
              className="input_form"
              value={valueDecorTourist.issued_by}
              onChange={handleInputChange}
              type="text"
              placeholder=""
              name="issued_by"
            />
            {validationErrors.issued_by && (
              <p className="red">{validationErrors.issued_by}</p>
            )}
          </div>
          <button
            style={{ margin: 0, marginTop: 12 }}
            className="button_form"
            onClick={handleSubmit}
          >
            Добавить
          </button>
        </>
      )}
    </div>
  );
};

export default FormDetails;

/* <div className="decor_div">
            <label className="label_form">Срок действия</label>
            <input
              className="input_form"
              value={valueDecorTourist.validity}
              onChange={(e) =>
                setValueDecorTourist({
                  ...valueDecorTourist,
                  validity: e.target.value,
                })
              }
              type="date"
              name="Срок действия"
            />
            {gup.validity && (
              <p className="red">
                {gup.validity ==
                  "Неправильный формат date. Используйте один из этих форматов: YYYY-MM-DD." &&
                  "Обязательное поле."}
              </p>
            )}
          </div>
          <div className="decor_div_inn">
            <label className="label_form">ИНН</label>
            <input
              className={`input_form ${gup.inn && "inn_input"} `}
              value={valueDecorTourist.inn}
              onChange={(e) => {
                const inputInn = e.target.value.replace(/\D/g, "");
                if (inputInn.length <= 14) {
                  setValueDecorTourist({ ...valueDecorTourist, inn: inputInn });
                }
              }}
              type="text"
              placeholder="0000 0000 0000 0000"
              name="ИНН"
              maxLength="14"
            />
            {gup.inn && <p className="red">{gup.inn}</p>}
          </div>
          <div>
            <div>
              <label className="label_form">Пол</label>
              <div className="pol">
                <div
                  onClick={() =>
                    setBlue(true) ||
                    setRed(false) ||
                    setValueDecorTourist({
                      ...valueDecorTourist,
                      gender: "Муж",
                    })
                  }
                  className={blue ? "blue active" : "blue"}
                >
                  Муж
                </div>
                <div
                  onClick={() =>
                    setBlue(false) ||
                    setRed(true) ||
                    setValueDecorTourist({
                      ...valueDecorTourist,
                      gender: "Жен",
                    })
                  }
                  className={red ? "redd active" : "redd"}
                >
                  Жен
                </div>
              </div>
            </div>
          </div> */
