import React, { useEffect, useMemo, useState } from "react";
import "./Insurance.css";
import Header from "../../components/Header/Header";
import Loader from "../../components/UI/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  calculateInsurancePrice,
  createInsurancePolicy,
  loadInsuranceDictionaries,
  getApiErrorMessage,
  submitKaskoInspection,
  getPolicyStatus,
} from "../../api/insuranceHitTravel";
import { deepAction } from "../../store/actions/deep";
import {
  insuranceDictionariesError,
  insuranceDictionariesLoading,
  insuranceDictionariesSuccess,
  insuranceReset,
  insuranceSetContract,
  insuranceSetPrice,
} from "../../store/actions/insuranceAction";
import {
  APPROVED_DRIVERS_TYPES,
  createInitialForm,
  INSURANCE_PRODUCTS,
  INSPECTION_PHOTO_FIELDS,
  KASKO_RISKS,
  OSAGO_DRIVERS_TYPES,
  PRODUCT_LABELS,
  STEP_LABELS_BY_PRODUCT,
  TRAVEL_RISKS,
  WIZARD_STEPS,
} from "./constants";
import { buildHitTravelPayload } from "./buildHitTravelPayload";
import { addDaysToDateStr, todayDateStr } from "../../utils/epochDate";

const SKIP_FORM_VALIDATION = false;

function goToFinikPayment(dispatch, navigate, created, formProduct) {
  dispatch(insuranceSetContract(created));
  dispatch(
    insuranceSetPrice({
      net_premium: created.net_premium,
      sales_tax: created.sales_tax,
      gross_premium:
        created.gross_premium ?? created.total ?? created.amount,
    })
  );
  dispatch(
    deepAction({
      amount: Number(
        created.gross_premium ?? created.total ?? created.amount ?? 0
      ),
      currency: "KGS",
      status: created.status,
      datasis: {
        transaction_id: created.transaction_id,
      },
      paymentType: "finik",
      productType: "insurance",
      policyId: created.policy_id,
      insuranceProduct: formProduct,
    })
  );
  navigate("/payment");
}

function Field({ label, children, required }) {
  return (
    <label className="insurance_field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

const Insurance = ({ Alert }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { usePurposes, travelRegions, programs, activities, price, contract, loadingDictionaries } =
    useSelector((state) => state.insurance);

  const initialProduct =
    searchParams.get("product")?.toUpperCase() || INSURANCE_PRODUCTS.OSAGO;

  const [step, setStep] = useState(WIZARD_STEPS.POLICYHOLDER);
  const [form, setForm] = useState(() => createInitialForm(initialProduct));
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [stepError, setStepError] = useState("");
  const [createdPolicy, setCreatedPolicy] = useState(null);
  const [inspectionStatus, setInspectionStatus] = useState(null);
  const [inspectionSubmitted, setInspectionSubmitted] = useState(false);

  const kaskoNeedsInspection =
    form.product === INSURANCE_PRODUCTS.KASKO && !form.car.program_id;

  const stepLabels = useMemo(() => {
    if (kaskoNeedsInspection || createdPolicy?.needs_inspection) {
      return STEP_LABELS_BY_PRODUCT.KASKO_WITH_INSPECTION;
    }
    return STEP_LABELS_BY_PRODUCT.DEFAULT;
  }, [kaskoNeedsInspection, createdPolicy?.needs_inspection]);

  const driversTypes = useMemo(
    () =>
      form.product === INSURANCE_PRODUCTS.OSAGO
        ? OSAGO_DRIVERS_TYPES
        : APPROVED_DRIVERS_TYPES,
    [form.product]
  );

  const filteredPrograms = useMemo(() => {
    if (!form.travel.region_id) return programs;
    const region = travelRegions.find((r) => r.id === form.travel.region_id);
    if (!region) return programs;
    return programs.filter((program) =>
      program.regions?.some((r) => r.id === region.id || r.key === region.key)
    );
  }, [programs, travelRegions, form.travel.region_id]);

  useEffect(() => {
    dispatch(insuranceReset());
    loadDictionaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const productParam = searchParams.get("product")?.toUpperCase();
    if (
      productParam &&
      Object.values(INSURANCE_PRODUCTS).includes(productParam)
    ) {
      setForm(createInitialForm(productParam));
      setStep(WIZARD_STEPS.POLICYHOLDER);
      setCreatedPolicy(null);
      setInspectionStatus(null);
      setInspectionSubmitted(false);
      loadDictionariesForProduct(productParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function loadDictionariesForProduct(product) {
    dispatch(insuranceDictionariesLoading());
    try {
      const dictionaries = await loadInsuranceDictionaries(product);
      dispatch(insuranceDictionariesSuccess(dictionaries));
    } catch (error) {
      dispatch(insuranceDictionariesError(getApiErrorMessage(error)));
    }
  }

  useEffect(() => {
    if (form.validity_period_type === "ANNEALED_DATE" && !form.started_at) {
      const start = todayDateStr();
      setForm((prev) => ({
        ...prev,
        started_at: start,
        ended_at: addDaysToDateStr(start, Number(prev.duration) || 14),
      }));
    }
  }, [form.validity_period_type, form.started_at, form.duration]);

  useEffect(() => {
    setStepError("");
    setApiError("");
  }, [form]);

  async function loadDictionaries() {
    dispatch(insuranceDictionariesLoading());
    try {
      const dictionaries = await loadInsuranceDictionaries(form.product);
      dispatch(insuranceDictionariesSuccess(dictionaries));
      setForm((prev) => ({
        ...prev,
        car: {
          ...prev.car,
          use_purpose_id: dictionaries.usePurposes[0]?.id || "",
        },
        travel: {
          ...prev.travel,
          region_id: dictionaries.travelRegions[0]?.id || "",
          program_id:
            dictionaries.programs.find((p) => p.risk_type === "TRAVEL_MEDICAL_EXPENSES")
              ?.id || "",
        },
      }));
    } catch (error) {
      dispatch(insuranceDictionariesError(getApiErrorMessage(error)));
    }
  }

  function updatePolicyholder(field, value) {
    setForm((prev) => ({
      ...prev,
      policyholder: { ...prev.policyholder, [field]: value },
    }));
  }

  function updatePolicyholderDoc(field, value) {
    setForm((prev) => ({
      ...prev,
      policyholder: {
        ...prev.policyholder,
        document: { ...prev.policyholder.document, [field]: value },
      },
    }));
  }

  function updateCar(field, value) {
    setForm((prev) => {
      const nextCar = { ...prev.car, [field]: value };

      if (
        prev.product === INSURANCE_PRODUCTS.KASKO &&
        field === "program_id" &&
        value
      ) {
        nextCar.approved_drivers_type = "EXPERIENCE_1_YEAR";
      }

      return { ...prev, car: nextCar };
    });
  }

  function toggleKaskoRisk(risk) {
    setForm((prev) => {
      const selected = prev.car.selected_risks.includes(risk)
        ? prev.car.selected_risks.filter((r) => r !== risk)
        : [...prev.car.selected_risks, risk];
      return {
        ...prev,
        car: {
          ...prev.car,
          selected_risks: selected.length
            ? selected
            : ["CAR_PROPERTY_DAMAGE"],
        },
      };
    });
  }

  function updateTravel(field, value) {
    setForm((prev) => ({
      ...prev,
      travel: { ...prev.travel, [field]: value },
    }));
  }

  function updateTraveler(index, field, value) {
    setForm((prev) => {
      const travelers = [...prev.travel.travelers];
      travelers[index] = { ...travelers[index], [field]: value };
      return { ...prev, travel: { ...prev.travel, travelers } };
    });
  }

  function toggleTravelRisk(risk) {
    setForm((prev) => {
      const selected = prev.travel.selected_risks.includes(risk)
        ? prev.travel.selected_risks.filter((r) => r !== risk)
        : [...prev.travel.selected_risks, risk];
      return {
        ...prev,
        travel: {
          ...prev.travel,
          selected_risks: selected.length ? selected : ["TRAVEL_MEDICAL_EXPENSES"],
          multi_trip:
            selected.includes("TRAVEL_BAGGAGE") ||
            selected.includes("TRAVEL_TRIP_DELAY_OR_CANCELLATION")
              ? false
              : prev.travel.multi_trip,
        },
      };
    });
  }

  function addDriver() {
    setForm((prev) => {
      if (prev.car.approved_drivers.length >= 4) return prev;
      return {
        ...prev,
        car: {
          ...prev.car,
          approved_drivers: [
            ...prev.car.approved_drivers,
            {
              pin_tin: "",
              first_name: "",
              last_name: "",
              gender: "MALE",
              registration_birth_date: "",
              document_series: "",
              document_number: "",
              issuing_authority: "МВД КР",
              issuing_date: "",
              expired_date: "",
            },
          ],
        },
      };
    });
  }

  function addTraveler() {
    setForm((prev) => ({
      ...prev,
      travel: {
        ...prev.travel,
        travelers: [
          ...prev.travel.travelers,
          {
            pin_tin: "",
            first_name: "",
            last_name: "",
            gender: "MALE",
            registration_birth_date: "",
            document_type: "INTERNATIONAL_PASSPORT",
            series: "",
            number: "",
            issuing_authority: "МКК-50-01",
            issuing_date: "",
            expired_date: "",
          },
        ],
      },
    }));
  }

  function getStepValidationError(currentStep) {
    if (SKIP_FORM_VALIDATION) return "";

    const ph = form.policyholder;
    if (currentStep === WIZARD_STEPS.POLICYHOLDER) {
      if (!ph.pin_tin || !ph.first_name || !ph.last_name || !ph.registration_birth_date) {
        return "Заполните обязательные поля страхователя";
      }
      if (!ph.document.number || !ph.document.issuing_authority || !ph.document.issuing_date) {
        return "Заполните данные документа страхователя";
      }
    }
    if (currentStep === WIZARD_STEPS.INSURED) {
      if (form.product !== INSURANCE_PRODUCTS.VZR) {
        const { car } = form;
        if (!car.use_purpose_id || !car.vin || !car.brand_name || !car.model_name) {
          return "Заполните обязательные поля автомобиля";
        }
        if (!car.registration_number || !car.certificate_number || !car.certificate_issuing_date) {
          return "Заполните данные свидетельства о регистрации";
        }
        if (form.product === INSURANCE_PRODUCTS.KASKO && !car.program_id && !car.insurance_amount) {
          return "Укажите страховую сумму для КАСКО Standard";
        }
        if (car.approved_drivers_type === "APPROVED") {
          if (!car.approved_drivers.length) {
            return "Добавьте хотя бы одного водителя";
          }
          const invalidDriver = car.approved_drivers.some(
            (d) =>
              !d.first_name ||
              !d.last_name ||
              !d.registration_birth_date ||
              !d.document_number ||
              !d.issuing_date
          );
          if (invalidDriver) {
            return "Заполните данные всех водителей";
          }
        }
      } else {
        const { travel } = form;
        if (!travel.region_id) {
          return "Выберите регион путешествия";
        }
        if (travel.selected_risks.includes("TRAVEL_MEDICAL_EXPENSES") && !travel.program_id) {
          return "Выберите программу медицинского страхования";
        }
        if (!form.started_at || !form.ended_at) {
          return "Укажите даты поездки";
        }
        if (travel.multi_trip && (!travel.insured_days || travel.insured_days < 1)) {
          return "Укажите количество застрахованных дней";
        }
        const invalidTraveler = travel.travelers.some(
          (t) =>
            !t.first_name ||
            !t.last_name ||
            !t.registration_birth_date ||
            !t.number ||
            !t.issuing_date
        );
        if (invalidTraveler) {
          return "Заполните данные всех путешественников";
        }
      }
    }
    return "";
  }

  function canNavigateToStep(targetStep) {
    if (SKIP_FORM_VALIDATION) {
      if (targetStep === WIZARD_STEPS.INSPECTION) {
        return Boolean(createdPolicy?.needs_inspection);
      }
      return targetStep <= WIZARD_STEPS.SUMMARY || targetStep === WIZARD_STEPS.INSPECTION;
    }
    if (targetStep === WIZARD_STEPS.INSPECTION) {
      return Boolean(createdPolicy?.needs_inspection);
    }
    return true;
  }

  function handleStepClick(targetStep) {
    if (targetStep === step || !canNavigateToStep(targetStep)) return;

    if (targetStep < step) {
      setStepError("");
      setStep(targetStep);
      return;
    }

    for (let s = step; s < targetStep; s += 1) {
      const error = getStepValidationError(s);
      if (error) {
        setStepError(error);
        setStep(s);
        return;
      }
    }

    setStepError("");
    setStep(targetStep);
  }

  function validateStep(currentStep) {
    const error = getStepValidationError(currentStep);
    if (error) {
      setStepError(error);
      return false;
    }
    setStepError("");
    return true;
  }

  async function handleCalculate() {
    setLoading(true);
    setApiError("");
    try {
      const payload = buildHitTravelPayload(form);
      const result = await calculateInsurancePrice(form.product, payload);
      dispatch(
        insuranceSetPrice({
          net_premium: result.net_premium,
          sales_tax: result.sales_tax,
          gross_premium: result.total ?? result.gross_premium,
        })
      );
      Alert("Стоимость рассчитана", "success");
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      Alert(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAndPay() {
    const token = localStorage.getItem("token");
    if (!token) {
      Alert("Для оформления полиса необходимо войти в аккаунт", "error");
      navigate("/login");
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const payload = buildHitTravelPayload(form);

      if (!price) {
        const calculated = await calculateInsurancePrice(form.product, payload);
        dispatch(
          insuranceSetPrice({
            net_premium: calculated.net_premium,
            sales_tax: calculated.sales_tax,
            gross_premium: calculated.total ?? calculated.gross_premium,
          })
        );
      }

      const created = await createInsurancePolicy(form.product, payload);

      if (!created?.policy_id) {
        throw new Error("Не получен policy_id после создания полиса");
      }

      setCreatedPolicy(created);

      if (form.product === INSURANCE_PRODUCTS.KASKO && created.needs_inspection) {
        Alert(
          "Полис создан. Загрузите фото автомобиля для осмотра (Standard).",
          "info"
        );
        setStep(WIZARD_STEPS.INSPECTION);
        return;
      }

      if (!created?.transaction_id) {
        throw new Error("Не получен transaction_id для оплаты");
      }

      Alert("Полис создан. Переход к оплате", "success");
      goToFinikPayment(dispatch, navigate, created, form.product);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      Alert(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleInspectionSubmit() {
    const policyId = createdPolicy?.policy_id || contract?.policy_id;
    if (!policyId) {
      Alert("Сначала создайте полис на шаге «Расчёт и оплата»", "error");
      return;
    }

    const missingPhoto = INSPECTION_PHOTO_FIELDS.some(
      ({ key }) => !form.inspection.photos[key]
    );
    if (!SKIP_FORM_VALIDATION && missingPhoto) {
      Alert("Загрузите все 10 обязательных фотографий", "error");
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const result = await submitKaskoInspection(
        policyId,
        form.inspection.photos,
        form.inspection.damageImages
      );
      setInspectionSubmitted(true);
      setInspectionStatus(result?.status || "IN_PROGRESS");
      Alert(
        result?.message ||
          "Осмотр отправлен на согласование. Ожидайте подтверждения.",
        "success"
      );
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      Alert(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleProceedToPayment() {
    const policy = createdPolicy || contract;
    if (!policy?.transaction_id) {
      Alert("Транзакция для оплаты не найдена", "error");
      return;
    }
    goToFinikPayment(dispatch, navigate, policy, form.product);
  }

  useEffect(() => {
    const policyId = createdPolicy?.policy_id || contract?.policy_id;
    if (
      step !== WIZARD_STEPS.INSPECTION ||
      !policyId ||
      !inspectionSubmitted
    ) {
      return undefined;
    }

    let cancelled = false;

    const pollStatus = async () => {
      try {
        const status = await getPolicyStatus(policyId);
        if (cancelled) return;
        setInspectionStatus(status?.inspection_status || status?.status);
      } catch {
        // polling errors are non-fatal
      }
    };

    pollStatus();
    const intervalId = setInterval(pollStatus, 5000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [step, createdPolicy, contract, inspectionSubmitted]);

  function renderPolicyholderStep() {
    const ph = form.policyholder;
    return (
      <div className="insurance_step_card">
        <h3>Данные страхователя — {PRODUCT_LABELS[form.product]}</h3>
        <div className="insurance_form_grid">
          <Field label="ПИН" required>
            <input className="input_form" value={ph.pin_tin} onChange={(e) => updatePolicyholder("pin_tin", e.target.value)} />
          </Field>
          <Field label="Имя" required>
            <input className="input_form" value={ph.first_name} onChange={(e) => updatePolicyholder("first_name", e.target.value)} />
          </Field>
          <Field label="Фамилия" required>
            <input className="input_form" value={ph.last_name} onChange={(e) => updatePolicyholder("last_name", e.target.value)} />
          </Field>
          <Field label="Отчество">
            <input className="input_form" value={ph.middle_name} onChange={(e) => updatePolicyholder("middle_name", e.target.value)} />
          </Field>
          <Field label="Пол" required>
            <select className="input_form" value={ph.gender} onChange={(e) => updatePolicyholder("gender", e.target.value)}>
              <option value="MALE">Мужской</option>
              <option value="FEMALE">Женский</option>
            </select>
          </Field>
          <Field label="Дата рождения" required>
            <input type="date" className="input_form" value={ph.registration_birth_date} onChange={(e) => updatePolicyholder("registration_birth_date", e.target.value)} />
          </Field>
          <Field label="Телефон">
            <input className="input_form" placeholder="+996555123456" value={ph.phone} onChange={(e) => updatePolicyholder("phone", e.target.value)} />
          </Field>
          <Field label="Email">
            <input className="input_form" value={ph.email} onChange={(e) => updatePolicyholder("email", e.target.value)} />
          </Field>
          <Field label="Тип документа" required>
            <select className="input_form" value={ph.document.type} onChange={(e) => updatePolicyholderDoc("type", e.target.value)}>
              <option value="PASSPORT">Паспорт</option>
              <option value="INTERNATIONAL_PASSPORT">Загранпаспорт</option>
            </select>
          </Field>
          <Field label="Серия">
            <input className="input_form" value={ph.document.series} onChange={(e) => updatePolicyholderDoc("series", e.target.value)} />
          </Field>
          <Field label="Номер" required>
            <input className="input_form" value={ph.document.number} onChange={(e) => updatePolicyholderDoc("number", e.target.value)} />
          </Field>
          <Field label="Орган выдачи" required>
            <input className="input_form" value={ph.document.issuing_authority} onChange={(e) => updatePolicyholderDoc("issuing_authority", e.target.value)} />
          </Field>
          <Field label="Дата выдачи" required>
            <input type="date" className="input_form" value={ph.document.issuing_date} onChange={(e) => updatePolicyholderDoc("issuing_date", e.target.value)} />
          </Field>
          <Field label="Дата окончания">
            <input type="date" className="input_form" value={ph.document.expired_date} onChange={(e) => updatePolicyholderDoc("expired_date", e.target.value)} />
          </Field>
        </div>
      </div>
    );
  }

  function renderCarStep() {
    const { car } = form;
    return (
      <div className="insurance_step_card">
        <h3>Данные автомобиля — {PRODUCT_LABELS[form.product]}</h3>
        <div className="insurance_form_grid">
          <Field label="Цель использования" required>
            <select className="input_form" value={car.use_purpose_id} onChange={(e) => updateCar("use_purpose_id", e.target.value)}>
              <option value="">Выберите</option>
              {usePurposes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Допуск водителей" required>
            <select className="input_form" value={car.approved_drivers_type} onChange={(e) => updateCar("approved_drivers_type", e.target.value)}>
              {driversTypes.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </Field>
          {form.product === INSURANCE_PRODUCTS.KASKO && (
            <>
              <Field label="Программа КАСКО">
                <select className="input_form" value={car.program_id} onChange={(e) => updateCar("program_id", e.target.value)}>
                  <option value="">Standard (требуется осмотр)</option>
                  {programs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.insured_sum} {item.currency}
                    </option>
                  ))}
                </select>
              </Field>
              {car.program_id && (
                <p className="insurance_hint">
                  Программы Эконом/Эконом+ — осмотр не нужен, допуск водителей: стаж от 1 года.
                </p>
              )}
              {!car.program_id && (
                <Field label="Страховая сумма" required>
                  <input type="number" className="input_form" value={car.insurance_amount} onChange={(e) => updateCar("insurance_amount", e.target.value)} />
                </Field>
              )}
              <Field label="С прицепом">
                <select className="input_form" value={car.use_with_trailer ? "yes" : "no"} onChange={(e) => updateCar("use_with_trailer", e.target.value === "yes")}>
                  <option value="no">Нет</option>
                  <option value="yes">Да</option>
                </select>
              </Field>
            </>
          )}
          <Field label="Марка" required>
            <input className="input_form" value={car.brand_name} onChange={(e) => updateCar("brand_name", e.target.value)} />
          </Field>
          <Field label="Модель" required>
            <input className="input_form" value={car.model_name} onChange={(e) => updateCar("model_name", e.target.value)} />
          </Field>
          <Field label="Год выпуска" required>
            <input type="number" className="input_form" value={car.year} onChange={(e) => updateCar("year", e.target.value)} />
          </Field>
          <Field label="VIN" required>
            <input className="input_form" value={car.vin} onChange={(e) => updateCar("vin", e.target.value)} />
          </Field>
          <Field label="Тип двигателя" required>
            <select className="input_form" value={car.engine_type} onChange={(e) => updateCar("engine_type", e.target.value)}>
              <option value="ICE">Бензин/дизель</option>
              <option value="ELECTRIC">Электро</option>
              <option value="HYBRID">Гибрид</option>
            </select>
          </Field>
          <Field label="Объём/мощность двигателя" required>
            <input type="number" className="input_form" value={car.engine_capacity_power} onChange={(e) => updateCar("engine_capacity_power", e.target.value)} />
          </Field>
          <Field label="Гос. номер" required>
            <input className="input_form" value={car.registration_number} onChange={(e) => updateCar("registration_number", e.target.value)} />
          </Field>
          <Field label="Номер СТС" required>
            <input className="input_form" value={car.certificate_number} onChange={(e) => updateCar("certificate_number", e.target.value)} />
          </Field>
          <Field label="Дата выдачи СТС" required>
            <input type="date" className="input_form" value={car.certificate_issuing_date} onChange={(e) => updateCar("certificate_issuing_date", e.target.value)} />
          </Field>
          <Field label="Срок полиса (дней)">
            <input type="number" min="1" max="366" className="input_form" value={form.duration} onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))} />
          </Field>
        </div>

        {form.product === INSURANCE_PRODUCTS.KASKO && (
          <div className="insurance_risks">
            <h4>Риски КАСКО</h4>
            {KASKO_RISKS.map((risk) => (
              <label key={risk.value} className="insurance_risk_item">
                <input
                  type="checkbox"
                  checked={car.selected_risks.includes(risk.value)}
                  onChange={() => toggleKaskoRisk(risk.value)}
                  disabled={risk.value === "CAR_PROPERTY_DAMAGE"}
                />
                <span>{risk.label}</span>
              </label>
            ))}
          </div>
        )}

        {car.approved_drivers_type === "APPROVED" && (
          <div className="insurance_subsection">
            <div className="insurance_subsection_head">
              <h4>Водители</h4>
              <button type="button" className="insurance_link_btn" onClick={addDriver}>+ Добавить</button>
            </div>
            {car.approved_drivers.map((driver, index) => (
              <div key={index} className="insurance_driver_card">
                <div className="insurance_form_grid">
                  <Field label="ПИН"><input className="input_form" value={driver.pin_tin} onChange={(e) => {
                    const drivers = [...car.approved_drivers];
                    drivers[index] = { ...driver, pin_tin: e.target.value };
                    updateCar("approved_drivers", drivers);
                  }} /></Field>
                  <Field label="Имя" required><input className="input_form" value={driver.first_name} onChange={(e) => {
                    const drivers = [...car.approved_drivers];
                    drivers[index] = { ...driver, first_name: e.target.value };
                    updateCar("approved_drivers", drivers);
                  }} /></Field>
                  <Field label="Фамилия" required><input className="input_form" value={driver.last_name} onChange={(e) => {
                    const drivers = [...car.approved_drivers];
                    drivers[index] = { ...driver, last_name: e.target.value };
                    updateCar("approved_drivers", drivers);
                  }} /></Field>
                  <Field label="Дата рождения" required><input type="date" className="input_form" value={driver.registration_birth_date} onChange={(e) => {
                    const drivers = [...car.approved_drivers];
                    drivers[index] = { ...driver, registration_birth_date: e.target.value };
                    updateCar("approved_drivers", drivers);
                  }} /></Field>
                  <Field label="Номер ВУ" required><input className="input_form" value={driver.document_number} onChange={(e) => {
                    const drivers = [...car.approved_drivers];
                    drivers[index] = { ...driver, document_number: e.target.value };
                    updateCar("approved_drivers", drivers);
                  }} /></Field>
                  <Field label="Дата выдачи ВУ" required><input type="date" className="input_form" value={driver.issuing_date} onChange={(e) => {
                    const drivers = [...car.approved_drivers];
                    drivers[index] = { ...driver, issuing_date: e.target.value };
                    updateCar("approved_drivers", drivers);
                  }} /></Field>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderTravelStep() {
    const { travel } = form;
    const hasBaggageRisks = travel.selected_risks.some((r) =>
      ["TRAVEL_BAGGAGE", "TRAVEL_TRIP_DELAY_OR_CANCELLATION"].includes(r)
    );

    return (
      <div className="insurance_step_card">
        <h3>Данные поездки — ВЗР</h3>
        <div className="insurance_form_grid">
          <Field label="Регион" required>
            <select className="input_form" value={travel.region_id} onChange={(e) => updateTravel("region_id", e.target.value)}>
              <option value="">Выберите регион</option>
              {travelRegions.map((region) => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Программа" required>
            <select className="input_form" value={travel.program_id} onChange={(e) => updateTravel("program_id", e.target.value)}>
              <option value="">Выберите программу</option>
              {filteredPrograms
                .filter((p) => p.risk_type === "TRAVEL_MEDICAL_EXPENSES")
                .map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name} — {program.insured_sum} {program.currency}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Активность">
            <select className="input_form" value={travel.activity_id} onChange={(e) => updateTravel("activity_id", e.target.value)}>
              <option value="">Стандартная</option>
              {activities.map((item) => (
                <option key={item.id} value={item.id}>{item.name || item.id}</option>
              ))}
            </select>
          </Field>
          <Field label="Дата начала" required>
            <input type="date" className="input_form" value={form.started_at} onChange={(e) => setForm((prev) => ({ ...prev, started_at: e.target.value }))} />
          </Field>
          <Field label="Дата окончания" required>
            <input type="date" className="input_form" value={form.ended_at} onChange={(e) => setForm((prev) => ({ ...prev, ended_at: e.target.value }))} />
          </Field>
          <Field label="Мульти-трип">
            <select className="input_form" value={travel.multi_trip ? "yes" : "no"} onChange={(e) => updateTravel("multi_trip", e.target.value === "yes")}>
              <option value="no">Нет</option>
              <option value="yes">Да</option>
            </select>
          </Field>
          {travel.multi_trip && (
            <Field label="Застрахованные дни" required>
              <input type="number" min="1" className="input_form" value={travel.insured_days} onChange={(e) => updateTravel("insured_days", e.target.value)} />
            </Field>
          )}
          {hasBaggageRisks && (
            <>
              <Field label="Трансфер багажа" required>
                <select className="input_form" value={travel.transfer ? "yes" : "no"} onChange={(e) => updateTravel("transfer", e.target.value === "yes")}>
                  <option value="no">Нет</option>
                  <option value="yes">Да</option>
                </select>
              </Field>
              <Field label="Детский билет" required>
                <select className="input_form" value={travel.age_ticket ? "yes" : "no"} onChange={(e) => updateTravel("age_ticket", e.target.value === "yes")}>
                  <option value="no">Нет</option>
                  <option value="yes">Да</option>
                </select>
              </Field>
            </>
          )}
        </div>

        <div className="insurance_risks">
          <h4>Риски</h4>
          {TRAVEL_RISKS.map((risk) => (
            <label key={risk.value} className="insurance_risk_item">
              <input
                type="checkbox"
                checked={travel.selected_risks.includes(risk.value)}
                onChange={() => toggleTravelRisk(risk.value)}
                disabled={
                  travel.multi_trip &&
                  ["TRAVEL_BAGGAGE", "TRAVEL_TRIP_DELAY_OR_CANCELLATION"].includes(risk.value)
                }
              />
              <span>{risk.label}</span>
            </label>
          ))}
        </div>

        <div className="insurance_subsection">
          <div className="insurance_subsection_head">
            <h4>Путешественники</h4>
            <button type="button" className="insurance_link_btn" onClick={addTraveler}>+ Добавить</button>
          </div>
          {travel.travelers.map((traveler, index) => (
            <div key={index} className="insurance_driver_card">
              <div className="insurance_form_grid">
                <Field label="Имя" required><input className="input_form" value={traveler.first_name} onChange={(e) => updateTraveler(index, "first_name", e.target.value)} /></Field>
                <Field label="Фамилия" required><input className="input_form" value={traveler.last_name} onChange={(e) => updateTraveler(index, "last_name", e.target.value)} /></Field>
                <Field label="ПИН"><input className="input_form" value={traveler.pin_tin} onChange={(e) => updateTraveler(index, "pin_tin", e.target.value)} /></Field>
                <Field label="Дата рождения" required><input type="date" className="input_form" value={traveler.registration_birth_date} onChange={(e) => updateTraveler(index, "registration_birth_date", e.target.value)} /></Field>
                <Field label="Тип документа" required>
                  <select className="input_form" value={traveler.document_type} onChange={(e) => updateTraveler(index, "document_type", e.target.value)}>
                    <option value="PASSPORT">Паспорт</option>
                    <option value="INTERNATIONAL_PASSPORT">Загранпаспорт</option>
                  </select>
                </Field>
                <Field label="Номер документа" required><input className="input_form" value={traveler.number} onChange={(e) => updateTraveler(index, "number", e.target.value)} /></Field>
                <Field label="Дата выдачи" required><input type="date" className="input_form" value={traveler.issuing_date} onChange={(e) => updateTraveler(index, "issuing_date", e.target.value)} /></Field>
                <Field label="Дата окончания"><input type="date" className="input_form" value={traveler.expired_date} onChange={(e) => updateTraveler(index, "expired_date", e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSummaryStep() {
    const total = price
      ? Number(price.net_premium || 0) + Number(price.sales_tax || 0)
      : null;

    return (
      <div className="insurance_step_card">
        <h3>Расчёт и оплата</h3>
        <div className="insurance_summary_box">
          <p><strong>Продукт:</strong> {PRODUCT_LABELS[form.product]}</p>
          <p><strong>Страхователь:</strong> {form.policyholder.last_name} {form.policyholder.first_name}</p>
          {total !== null && (
            <div className="insurance_price_row">
              <span>Нетто-премия:</span>
              <strong>{Number(price.net_premium).toFixed(2)} сом</strong>
            </div>
          )}
          {total !== null && (
            <div className="insurance_price_row">
              <span>Налог:</span>
              <strong>{Number(price.sales_tax).toFixed(2)} сом</strong>
            </div>
          )}
          {total !== null && (
            <div className="insurance_price_total">
              <span>Итого:</span>
              <strong>{total.toFixed(2)} сом</strong>
            </div>
          )}
        </div>
        {apiError && (
          <div className="insurance_form_error" role="alert">
            {apiError}
          </div>
        )}
        <div className="insurance_actions_row">
          <button type="button" className="button_form insurance_btn_secondary" onClick={handleCalculate} disabled={loading}>
            Рассчитать стоимость
          </button>
          <button type="button" className="button_form" onClick={handleCreateAndPay} disabled={loading}>
            {form.product === INSURANCE_PRODUCTS.KASKO && kaskoNeedsInspection
              ? "Оформить и перейти к осмотру"
              : "Оформить и перейти к оплате"}
          </button>
        </div>
      </div>
    );
  }

  function renderInspectionStep() {
    const inspectionApproved = inspectionStatus === "APPROVED";
    const inspectionRejected = inspectionStatus === "REJECTED";

    return (
      <div className="insurance_step_card">
        <h3>Осмотр автомобиля (КАСКО Standard)</h3>
        <p className="insurance_hint">
          Загрузите 10 обязательных фотографий. После согласования НСК можно перейти к оплате через Finik.
        </p>
        {inspectionStatus && (
          <div className="insurance_status_badge">
            Статус осмотра: {inspectionStatus}
          </div>
        )}
        {inspectionRejected && (
          <div className="insurance_form_error" role="alert">
            Осмотр отклонён. Загрузите фото повторно или обратитесь в поддержку.
          </div>
        )}
        <div className="insurance_photo_grid">
          {INSPECTION_PHOTO_FIELDS.map(({ key, label }) => (
            <label key={key} className="insurance_photo_field">
              <span>{label} *</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setForm((prev) => ({
                    ...prev,
                    inspection: {
                      ...prev.inspection,
                      photos: { ...prev.inspection.photos, [key]: file },
                    },
                  }));
                }}
              />
            </label>
          ))}
        </div>
        {apiError && (
          <div className="insurance_form_error" role="alert">
            {apiError}
          </div>
        )}
        <div className="insurance_actions_row">
          <button
            type="button"
            className="button_form insurance_btn_secondary"
            onClick={handleInspectionSubmit}
            disabled={loading || inspectionApproved}
          >
            Отправить осмотр
          </button>
          <button
            type="button"
            className="button_form"
            onClick={handleProceedToPayment}
            disabled={loading || !inspectionApproved}
          >
            Перейти к оплате
          </button>
        </div>
      </div>
    );
  }

  function renderStepContent() {
    switch (step) {
      case WIZARD_STEPS.POLICYHOLDER:
        return renderPolicyholderStep();
      case WIZARD_STEPS.INSURED:
        return form.product === INSURANCE_PRODUCTS.VZR
          ? renderTravelStep()
          : renderCarStep();
      case WIZARD_STEPS.SUMMARY:
        return renderSummaryStep();
      case WIZARD_STEPS.INSPECTION:
        return renderInspectionStep();
      default:
        return null;
    }
  }

  const showNav =
    step < WIZARD_STEPS.SUMMARY ||
    (step === WIZARD_STEPS.SUMMARY && !createdPolicy?.needs_inspection);
  const showNextButton = step < WIZARD_STEPS.SUMMARY;

  function goToNextStep() {
    if (!validateStep(step)) return;
    setStepError("");

    if (step === WIZARD_STEPS.POLICYHOLDER) {
      setStep(WIZARD_STEPS.INSURED);
      return;
    }
    if (step === WIZARD_STEPS.INSURED) {
      setStep(WIZARD_STEPS.SUMMARY);
    }
  }

  return (
    <div className="insurance_page">
      <Header>Страхование</Header>
      <div className="container insurance_container">
        {loadingDictionaries && <Loader />}
        {loading && <Loader />}

        <div className="insurance_steps">
          {stepLabels.map((label, index) => {
            const isNavigable = canNavigateToStep(index) && index !== step;
            return (
              <button
                key={label}
                type="button"
                className={`insurance_step_item ${step >= index ? "active" : ""} ${step === index ? "current" : ""} ${isNavigable ? "clickable" : ""}`}
                onClick={() => handleStepClick(index)}
                disabled={!canNavigateToStep(index)}
              >
                <span>{index + 1}</span>
                <p>{label}</p>
              </button>
            );
          })}
        </div>

        {stepError && (
          <div className="insurance_form_error" role="alert">
            {stepError}
          </div>
        )}

        {renderStepContent()}

        {showNav && (
          <div className="insurance_nav_buttons">
            {step > WIZARD_STEPS.POLICYHOLDER && (
              <button
                type="button"
                className="button_form insurance_btn_secondary"
                onClick={() => {
                  setStepError("");
                  setStep((s) => s - 1);
                }}
              >
                Назад
              </button>
            )}
            {showNextButton && (
              <button
                type="button"
                className="button_form"
                onClick={goToNextStep}
              >
                Далее
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insurance;
