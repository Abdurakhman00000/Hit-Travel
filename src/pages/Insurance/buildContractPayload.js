import { dateToEpochDays, dateToEpochMillis, todayEpochDays } from "../../utils/epochDate";
import { INSURANCE_PRODUCTS } from "./constants";

function buildPolicyholder(policyholder) {
  return {
    type: policyholder.type,
    pin_tin: policyholder.pin_tin,
    first_name: policyholder.first_name,
    last_name: policyholder.last_name,
    middle_name: policyholder.middle_name || undefined,
    gender: policyholder.gender,
    registration_birth_date: dateToEpochDays(policyholder.registration_birth_date),
    phone: policyholder.phone || undefined,
    email: policyholder.email || undefined,
    document: {
      type: policyholder.document.type,
      series: policyholder.document.series || undefined,
      number: policyholder.document.number,
      issuing_authority: policyholder.document.issuing_authority,
      issuing_date: dateToEpochDays(policyholder.document.issuing_date),
      expired_date: policyholder.document.expired_date
        ? dateToEpochDays(policyholder.document.expired_date)
        : undefined,
    },
  };
}

function buildOwner(policyholder) {
  return {
    type: policyholder.type,
    pin_tin: policyholder.pin_tin,
    first_name: policyholder.first_name,
    last_name: policyholder.last_name,
    gender: policyholder.gender,
    registration_birth_date: dateToEpochDays(policyholder.registration_birth_date),
    phone: policyholder.phone || undefined,
  };
}

function buildCarPayload(form, riskType, includeInsuranceAmount) {
  const { car, policyholder } = form;
  const carEntry = {
    car: {
      type: car.type,
      steering_location: car.steering_location,
      category: car.category,
      year: Number(car.year),
      vin: car.vin,
      chassis_number: car.chassis_number || car.vin,
      engine_type: car.engine_type,
      engine_capacity_power: Number(car.engine_capacity_power),
      brand: { name: car.brand_name },
      model: { name: car.model_name },
      registration_certificate: {
        registration_number: car.registration_number,
        number: car.certificate_number,
        issuing_date: dateToEpochDays(car.certificate_issuing_date),
        owner: car.owner_same_as_policyholder
          ? buildOwner(policyholder)
          : buildOwner(policyholder),
      },
    },
  };

  if (includeInsuranceAmount && car.insurance_amount) {
    carEntry.risks = [
      {
        type: riskType,
        insurance_amount: Number(car.insurance_amount),
      },
    ];
  }

  const insuredSubject = {
    use_purpose_id: car.use_purpose_id,
    use_with_trailer: car.use_with_trailer,
    approved_drivers_type: car.approved_drivers_type,
    cars: [carEntry],
  };

  if (form.product === INSURANCE_PRODUCTS.KASKO && car.program_id) {
    insuredSubject.program_id = car.program_id;
  }

  if (
    car.approved_drivers_type === "APPROVED" &&
    car.approved_drivers?.length
  ) {
    insuredSubject.approved_drivers_data = car.approved_drivers.map((driver) => ({
      type: "INDIVIDUAL",
      pin_tin: driver.pin_tin || undefined,
      first_name: driver.first_name,
      last_name: driver.last_name,
      middle_name: driver.middle_name || undefined,
      gender: driver.gender,
      registration_birth_date: dateToEpochDays(driver.registration_birth_date),
      document: {
        type: "DRIVING_LICENCE",
        series: driver.document_series || undefined,
        number: driver.document_number,
        issuing_authority: driver.issuing_authority,
        issuing_date: dateToEpochDays(driver.issuing_date),
        expired_date: driver.expired_date
          ? dateToEpochDays(driver.expired_date)
          : undefined,
        categories: [
          {
            category: car.category,
            issuing_date: dateToEpochDays(driver.issuing_date),
          },
        ],
      },
    }));
  }

  return {
    insured_subject_car: insuredSubject,
    risks: [{ type: riskType }],
  };
}

function buildTravelPayload(form) {
  const { travel } = form;
  const insuredSubject = {
    region_id: travel.region_id,
    travelers_data: travel.travelers.map((traveler) => ({
      type: "INDIVIDUAL",
      pin_tin: traveler.pin_tin || undefined,
      first_name: traveler.first_name,
      last_name: traveler.last_name,
      middle_name: traveler.middle_name || undefined,
      gender: traveler.gender,
      registration_birth_date: dateToEpochDays(traveler.registration_birth_date),
      document: {
        type: traveler.document_type,
        series: traveler.series || undefined,
        number: traveler.number,
        issuing_authority: traveler.issuing_authority,
        issuing_date: dateToEpochDays(traveler.issuing_date),
        expired_date: traveler.expired_date
          ? dateToEpochDays(traveler.expired_date)
          : undefined,
      },
    })),
  };

  if (travel.selected_risks.includes("TRAVEL_MEDICAL_EXPENSES")) {
    insuredSubject.program_id = travel.program_id;
  }

  if (travel.activity_id) {
    insuredSubject.activity_id = travel.activity_id;
  }

  if (travel.multi_trip) {
    insuredSubject.multi_trip = true;
    insuredSubject.insured_days = Number(travel.insured_days);
  }

  const hasBaggageRisks = travel.selected_risks.some((risk) =>
    ["TRAVEL_BAGGAGE", "TRAVEL_TRIP_DELAY_OR_CANCELLATION"].includes(risk)
  );

  if (hasBaggageRisks) {
    insuredSubject.transfer = travel.transfer;
    insuredSubject.age_ticket = travel.age_ticket;
  }

  return {
    insured_subject_travel: insuredSubject,
    risks: travel.selected_risks.map((type) => ({ type })),
  };
}

export function buildContractPayload(form) {
  const payload = {
    sign_date: todayEpochDays(),
    product: form.product === INSURANCE_PRODUCTS.VZR ? "TRAVEL" : "CAR",
    validity_period_type: form.validity_period_type,
    policyholder: buildPolicyholder(form.policyholder),
    insured_objects: [],
  };

  if (form.validity_period_type === "ACTIVATION_DATE") {
    payload.duration = Number(form.duration);
  } else {
    payload.started_at = dateToEpochMillis(form.started_at);
    payload.ended_at = dateToEpochMillis(form.ended_at);
  }

  if (form.product === INSURANCE_PRODUCTS.OSAGO) {
    payload.insured_objects.push(
      buildCarPayload(form, "CAR_MANDATORY_CIVIL_LIABILITY", false)
    );
  } else if (form.product === INSURANCE_PRODUCTS.KASKO) {
    payload.insured_objects.push(
      buildCarPayload(form, "CAR_PROPERTY_DAMAGE", !form.car.program_id)
    );
  } else {
    payload.insured_objects.push(buildTravelPayload(form));
  }

  return payload;
}

export function kaskoRequiresInspection(form) {
  return (
    form.product === INSURANCE_PRODUCTS.KASKO && !form.car.program_id
  );
}
