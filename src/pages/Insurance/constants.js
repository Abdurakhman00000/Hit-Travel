export const INSURANCE_PRODUCTS = {
  OSAGO: "OSAGO",
  KASKO: "KASKO",
  VZR: "VZR",
};

export const PRODUCT_LABELS = {
  [INSURANCE_PRODUCTS.OSAGO]: "ОСАГО",
  [INSURANCE_PRODUCTS.KASKO]: "КАСКО",
  [INSURANCE_PRODUCTS.VZR]: "ВЗР",
};

export const APPROVED_DRIVERS_TYPES = [
  { value: "NO_LIMITS", label: "Без ограничений" },
  { value: "APPROVED", label: "Конкретные водители (до 4)" },
  { value: "EXPERIENCE_1_YEAR", label: "Стаж от 1 года" },
  { value: "EXPERIENCE_2_YEARS", label: "Стаж от 2 лет" },
  { value: "EXPERIENCE_3_YEARS", label: "Стаж от 3 лет" },
  { value: "ACCORDING_TO_WAYBILL", label: "По путевому листу" },
];

export const OSAGO_DRIVERS_TYPES = [
  { value: "NO_LIMITS", label: "Без ограничений" },
  { value: "APPROVED", label: "Конкретные водители (до 4)" },
];

export const TRAVEL_RISKS = [
  { value: "TRAVEL_MEDICAL_EXPENSES", label: "Медицинские расходы" },
  { value: "TRAVEL_BAGGAGE", label: "Багаж" },
  { value: "TRAVEL_TRIP_DELAY_OR_CANCELLATION", label: "Задержка/отмена рейса" },
];

export const INSPECTION_PHOTO_FIELDS = [
  { key: "frontView", label: "Спереди" },
  { key: "frontLeftView", label: "Спереди-слева" },
  { key: "frontRightView", label: "Спереди-справа" },
  { key: "leftSideView", label: "Левый бок" },
  { key: "rightSideView", label: "Правый бок" },
  { key: "rearView", label: "Сзади" },
  { key: "rearLeftView", label: "Сзади-слева" },
  { key: "rearRightView", label: "Сзади-справа" },
  { key: "roofView", label: "Крыша" },
  { key: "vinCodeView", label: "VIN-код" },
];

export const KASKO_RISKS = [
  { value: "CAR_PROPERTY_DAMAGE", label: "Ущерб имуществу" },
  { value: "CAR_VOLUNTARY_CIVIL_LIABILITY", label: "Добровольная гражданская ответственность" },
  { value: "CAR_CARRIER_CIVIL_LIABILITY", label: "Ответственность перевозчика" },
  { value: "CAR_SEATS_PERSONAL_ACCIDENT", label: "Несчастный случай на местах" },
];

export const WIZARD_STEPS = {
  POLICYHOLDER: 0,
  INSURED: 1,
  SUMMARY: 2,
  INSPECTION: 3,
};

export const STEP_LABELS_BY_PRODUCT = {
  DEFAULT: ["Страхователь", "Объект страхования", "Расчёт и оплата"],
  KASKO_WITH_INSPECTION: ["Страхователь", "Объект страхования", "Расчёт и оплата", "Осмотр"],
};

export function createInitialForm(product = INSURANCE_PRODUCTS.OSAGO) {
  return {
    product,
    validity_period_type: product === INSURANCE_PRODUCTS.VZR ? "ANNEALED_DATE" : "ACTIVATION_DATE",
    duration: product === INSURANCE_PRODUCTS.VZR ? 14 : 365,
    started_at: "",
    ended_at: "",
    policyholder: {
      type: "INDIVIDUAL",
      pin_tin: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      gender: "MALE",
      registration_birth_date: "",
      phone: "",
      email: "",
      document: {
        type: "PASSPORT",
        series: "",
        number: "",
        issuing_authority: "",
        issuing_date: "",
        expired_date: "",
      },
    },
    car: {
      use_purpose_id: "",
      use_with_trailer: false,
      approved_drivers_type: "NO_LIMITS",
      program_id: "",
      insurance_amount: "",
      type: "B",
      steering_location: "LEFT",
      category: "B",
      year: new Date().getFullYear(),
      vin: "",
      chassis_number: "",
      engine_type: "ICE",
      engine_capacity_power: 150,
      brand_name: "",
      model_name: "",
      registration_number: "",
      certificate_number: "",
      certificate_issuing_date: "",
      owner_same_as_policyholder: true,
      selected_risks: ["CAR_PROPERTY_DAMAGE"],
      approved_drivers: [],
    },
    travel: {
      region_id: "",
      program_id: "",
      activity_id: "",
      multi_trip: false,
      insured_days: 90,
      transfer: false,
      age_ticket: false,
      selected_risks: ["TRAVEL_MEDICAL_EXPENSES"],
      travelers: [
        {
          pin_tin: "",
          first_name: "",
          last_name: "",
          middle_name: "",
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
    inspection: {
      inspectionDate: Date.now(),
      comment: "",
      photos: {},
      damageImages: [],
    },
  };
}
