import { INSURANCE_PRODUCTS } from "./constants";

function buildDocument(document) {
  if (!document?.number) return undefined;

  return {
    type: document.type,
    series: document.series || undefined,
    number: document.number,
    issuing_authority: document.issuing_authority,
    issuing_date: document.issuing_date,
    expired_date: document.expired_date || undefined,
  };
}

function buildPolicyholder(policyholder) {
  return {
    type: policyholder.type || "INDIVIDUAL",
    pin_tin: policyholder.pin_tin,
    first_name: policyholder.first_name,
    last_name: policyholder.last_name,
    middle_name: policyholder.middle_name || undefined,
    gender: policyholder.gender,
    birth_date: policyholder.registration_birth_date,
    phone: policyholder.phone || undefined,
    email: policyholder.email || undefined,
    document: buildDocument(policyholder.document),
  };
}

function buildDriver(driver, carCategory) {
  return {
    pin_tin: driver.pin_tin || undefined,
    first_name: driver.first_name,
    last_name: driver.last_name,
    middle_name: driver.middle_name || undefined,
    gender: driver.gender,
    birth_date: driver.registration_birth_date,
    document: {
      type: "DRIVING_LICENCE",
      series: driver.document_series || undefined,
      number: driver.document_number,
      issuing_authority: driver.issuing_authority || "МВД КР",
      issuing_date: driver.issuing_date,
      expired_date: driver.expired_date || undefined,
      categories: [
        {
          category: carCategory,
          issuing_date: driver.issuing_date,
        },
      ],
    },
  };
}

function buildCar(form) {
  const { car } = form;
  const payload = {
    type: car.type,
    category: car.category,
    year: Number(car.year),
    vin: car.vin,
    chassis_number: car.chassis_number || car.vin,
    brand: car.brand_name,
    model: car.model_name,
    steering_location: car.steering_location,
    engine_type: car.engine_type,
    engine_capacity_power: Number(car.engine_capacity_power),
    registration_certificate: {
      registration_number: car.registration_number,
      number: car.certificate_number,
      issuing_date: car.certificate_issuing_date,
      series: car.certificate_series || undefined,
    },
  };

  return payload;
}

function buildTraveler(traveler) {
  return {
    pin_tin: traveler.pin_tin || undefined,
    first_name: traveler.first_name,
    last_name: traveler.last_name,
    middle_name: traveler.middle_name || undefined,
    gender: traveler.gender,
    birth_date: traveler.registration_birth_date,
    document: buildDocument({
      type: traveler.document_type,
      series: traveler.series,
      number: traveler.number,
      issuing_authority: traveler.issuing_authority,
      issuing_date: traveler.issuing_date,
      expired_date: traveler.expired_date,
    }),
  };
}

function buildOsagoPayload(form) {
  const { car } = form;
  const payload = {
    use_purpose_id: car.use_purpose_id,
    duration: Number(form.duration),
    approved_drivers_type: car.approved_drivers_type,
    owner_is_policyholder: car.owner_same_as_policyholder !== false,
    policyholder: buildPolicyholder(form.policyholder),
    car: buildCar(form),
  };

  if (
    car.approved_drivers_type === "APPROVED" &&
    car.approved_drivers?.length
  ) {
    payload.car.approved_drivers = car.approved_drivers.map((driver) =>
      buildDriver(driver, car.category)
    );
  }

  return payload;
}

function buildKaskoPayload(form) {
  const { car } = form;
  const payload = {
    duration: Number(form.duration),
    use_purpose_id: car.use_purpose_id,
    use_with_trailer: Boolean(car.use_with_trailer),
    approved_drivers_type: car.approved_drivers_type,
    owner_is_policyholder: car.owner_same_as_policyholder !== false,
    risks: car.selected_risks?.length
      ? car.selected_risks
      : ["CAR_PROPERTY_DAMAGE"],
    policyholder: buildPolicyholder(form.policyholder),
    car: buildCar(form),
  };

  if (car.program_id) {
    payload.program_id = car.program_id;
  } else if (car.insurance_amount) {
    payload.insurance_amount = Number(car.insurance_amount).toFixed(2);
  }

  if (
    car.approved_drivers_type === "APPROVED" &&
    car.approved_drivers?.length
  ) {
    payload.car.approved_drivers = car.approved_drivers.map((driver) =>
      buildDriver(driver, car.category)
    );
  }

  return payload;
}

export function buildHitTravelPayload(form) {
  if (form.product === INSURANCE_PRODUCTS.VZR) {
    const { travel } = form;
    const payload = {
      region_id: travel.region_id,
      program_id: travel.program_id,
      start_date: form.started_at,
      end_date: form.ended_at,
      policyholder: buildPolicyholder(form.policyholder),
      travelers: travel.travelers.map(buildTraveler),
    };

    if (travel.activity_id) {
      payload.activity_id = travel.activity_id;
    }
    if (travel.multi_trip) {
      payload.multi_trip = true;
      payload.insured_days = Number(travel.insured_days);
    }
    if (travel.selected_risks?.length) {
      payload.risks = travel.selected_risks;
    }
    const hasBaggageRisks = travel.selected_risks?.some((risk) =>
      ["TRAVEL_BAGGAGE", "TRAVEL_TRIP_DELAY_OR_CANCELLATION"].includes(risk)
    );
    if (hasBaggageRisks) {
      payload.transfer = travel.transfer;
      payload.age_ticket = travel.age_ticket;
    }

    return payload;
  }

  if (form.product === INSURANCE_PRODUCTS.KASKO) {
    return buildKaskoPayload(form);
  }

  return buildOsagoPayload(form);
}
