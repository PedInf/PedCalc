/////////////////////////////////////////////////////////
//////////////IV fluids Calculation//////////////////////
function calculateIVFluids() {
  const bodyWeightInput = document.getElementById("bWt");
  let bodyWeight = parseFloat(bodyWeightInput.value);

  // Check if the body weight is negative, and set it to 0 if it is
  if (bodyWeight < 0) {
    bodyWeight = 0;
    bodyWeightInput.value = 0;
  }

  let maintenanceFluids = 0;

  if (bodyWeight <= 10) {
    maintenanceFluids = 100 * bodyWeight;
  } else if (bodyWeight <= 20) {
    maintenanceFluids = 1000 + 50 * (bodyWeight - 10);
  } else {
    maintenanceFluids = 1000 + 500 + 25 * (bodyWeight - 20);
  }

  const infusionRate = maintenanceFluids / 24;
  const limitedInfusionRate = Math.min(infusionRate, 100); // Limit the infusion rate to a maximum of 100
  const infusionRateInput = document.querySelector(".MainIVframe input");
  infusionRateInput.value = limitedInfusionRate.toFixed(0);
}

/////////// IV fluids in Dehydration////////////
function calculateDehydrationRates() {
  const bodyWeightInput = document.getElementById("bWt");
  const bodyWeight = parseFloat(bodyWeightInput.value);
  const limitedBodyWeight = Math.min(bodyWeight, 56); // Limit the body weight to a maximum of 56 for calculation

  const infusionRateInput = document.querySelector(".MainIVframe input");
  const infusionRate = parseFloat(infusionRateInput.value);

  const rates = [0.05, 0.1, 0.15];
  const rateInputs = [
    document.getElementById("5%input"),
    document.getElementById("10%input"),
    document.getElementById("15%input"),
  ];

  for (let i = 0; i < rates.length; i++) {
    const rate =
      infusionRate + parseInt((rates[i] * limitedBodyWeight * 1000) / 24);
    rateInputs[i].value = rate;
  }
}
/////////// K correction function///////////////
function updateKCorrection() {
  const potassiumSelect = document.getElementById("initK");
  const selectedValue = potassiumSelect.value;
  const kCorrectionInput = document.getElementById("KCorrec");

  switch (selectedValue) {
    case "mt 6 mEq/L":
      kCorrectionInput.value = "No K needed initially";
      break;
    case "4-6 mEq/L":
      kCorrectionInput.value = "Add 40 mEq/L K";
      break;
    case "3-4 mEq/L":
      kCorrectionInput.value = "Add 60 mEq/L K";
      break;
    case "lt 3 mEq/L":
      kCorrectionInput.value =
        "Add 80 mEq/L or give 0.5-1.0 mEq/kg as oral K solution";
      break;
    default:
      kCorrectionInput.value = "";
  }
}

////////////// insulin dose calculation function///////////////
function updateInsulinDose() {
  const bodyWeightInput = document.getElementById("bWt");
  const bodyWeight = parseFloat(bodyWeightInput.value);

  const inDoseSelect = document.getElementById("InDose");
  const inDose = parseFloat(inDoseSelect.value);

  const inInfInput = document.getElementById("InInf");

  if (!isNaN(bodyWeight) && !isNaN(inDose)) {
    inInfInput.value = (bodyWeight * inDose).toFixed(2);
  } else {
    inInfInput.value = "";
  }
}

/// Calculate DKA total fluids and infusion rate////////////
function calculateTotals() {
  const bodyWeightInput = document.getElementById("bWt");
  const bodyWeight = parseFloat(bodyWeightInput.value);

  const fluOverSelect = document.getElementById("fluOver");
  const fluOver = fluOverSelect.value;

  const bolVolInput = document.getElementById("BolVol");
  const bolVol = parseFloat(bolVolInput.value);

  const infusionRateInput = document.querySelector(".MainIVframe input");
  const infusionRate = parseFloat(infusionRateInput.value);

  if (!isNaN(bodyWeight) && fluOver && !isNaN(bolVol) && !isNaN(infusionRate)) {
    let totDKAIVFluids = bodyWeight * 85;

    if (fluOver === "24 Hours") {
      totDKAIVFluids += infusionRate * 24;
    } else {
      totDKAIVFluids += infusionRate * 24 * 2;
    }

    totDKAIVFluids -= bolVol;

    const totFluidInput = document.getElementById("TotFluid");
    const fluidMlHrInput = document.getElementById("Fluidmlhr");

    totFluidInput.value = totDKAIVFluids.toFixed(0);
    fluidMlHrInput.value = (
      fluOver === "24 Hours" ? totDKAIVFluids / 23 : totDKAIVFluids / 47
    ).toFixed(0);
  }
}
