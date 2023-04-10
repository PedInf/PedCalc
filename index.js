//////////////////Side bar code///////////////////////////
document.getElementById('trigger-area').addEventListener('mouseover', function () {
  document.getElementById('side-nav').style.width = '250px';
});            
document.getElementById('side-nav').addEventListener('mouseleave', function () {
  document.getElementById('side-nav').style.width = '20px';
});

////////////////////////////////////////////////////////////////////
////////Reading Pediatric Medications and Common Medications///////
/// provide the link to the JS libraray that can read excel file
////////////////////////////////////////////////////////////////


// Home Medications
window.addEventListener('DOMContentLoaded', () => {
  const selectHM = document.querySelector('#selectHM');
  const textareaHM = document.querySelector('#textareaHM');
 

  // load the Excel file
  const url = 'ref/data.xlsx';
  const oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'arraybuffer';
  oReq.onload = function(e) {
    const arraybuffer = oReq.response;
    const data = new Uint8Array(arraybuffer);
    const workbook = XLSX.read(data, {type: 'array'});

    // get the data from the "PDC" sheet
    const sheetName = 'PDC';
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const dataArr = [];
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cell = worksheet[XLSX.utils.encode_cell({r: row, c: 0})];
      if (cell && cell.v) {
        dataArr.push({
          key: cell.v,
          value: worksheet[XLSX.utils.encode_cell({r: row, c: 1})]?.v || ''
        });
      }
    }

    // populate the select element
    dataArr.forEach((dataObj) => {
      const option = document.createElement('option');
      option.value = dataObj.key;
      option.text = dataObj.key;
      selectHM.add(option);
    });

    // show the value of cell B2 in the textarea
    const cellB2 = worksheet['B2'];
    textareaHM.value = cellB2 ? cellB2.v : '';

    // update the text area when the selection changes
    selectHM.addEventListener('change', () => {
      const selectedValue = selectHM.value;
      const selectedDataObj = dataArr.find((dataObj) => dataObj.key === selectedValue);
      textareaHM.value = selectedDataObj ? selectedDataObj.value : '';
    });
  };
  oReq.send();
});

//Common Medications
window.addEventListener('DOMContentLoaded', () => {
  const selectCM = document.querySelector('#selectCM');
  const textareaCM = document.querySelector('#textareaCM');

  const url = 'ref/data.xlsx';
  const oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'arraybuffer';

  oReq.onload = function(e) {
    const arraybuffer = oReq.response;
    const data = new Uint8Array(arraybuffer);
    const workbook = XLSX.read(data, {type: 'array'});

    const sheetName = 'CM';
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const dataArr = [];

    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cell = worksheet[XLSX.utils.encode_cell({r: row, c: 0})];
      if (cell && cell.v) {
        dataArr.push({
          key: cell.v,
          value: worksheet[XLSX.utils.encode_cell({r: row, c: 1})]?.v || ''
        });
      }
    }

    dataArr.forEach((dataObj) => {
      const option = document.createElement('option');
      option.value = dataObj.key;
      option.text = dataObj.key;
      selectCM.add(option);
    });

    const cellB2 = worksheet['B2'];
    textareaCM.value = cellB2 ? cellB2.v : '';

    selectCM.addEventListener('change', () => {
      const selectedValue = selectCM.value;
      const selectedDataObj = dataArr.find((dataObj) => dataObj.key === selectedValue);
      textareaCM.value = selectedDataObj ? selectedDataObj.value : '';
    });
  };

  oReq.send();
});

// Convertor
window.addEventListener('DOMContentLoaded', () => {
  const selectConv = document.querySelector('#selectConv');
  const textareaConv = document.querySelector('#textareaConv');

  const url = 'ref/data.xlsx';
  const oReq = new XMLHttpRequest();
  oReq.open('GET', url, true);
  oReq.responseType = 'arraybuffer';

  oReq.onload = function(e) {
    const arraybuffer = oReq.response;
    const data = new Uint8Array(arraybuffer);
    const workbook = XLSX.read(data, {type: 'array'});

    const sheetName = 'Conv';
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const dataArr = [];

    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cell = worksheet[XLSX.utils.encode_cell({r: row, c: 0})];
      if (cell && cell.v) {
        dataArr.push({
          key: cell.v,
          value: worksheet[XLSX.utils.encode_cell({r: row, c: 1})]?.v || ''
        });
      }
    }

    dataArr.forEach((dataObj) => {
      const option = document.createElement('option');
      option.value = dataObj.key;
      option.text = dataObj.key;
      selectConv.add(option);
    });

    const cellB2 = worksheet['B2'];
    textareaConv.value = cellB2 ? cellB2.v : '';

    selectConv.addEventListener('change', () => {
      const selectedValue = selectConv.value;
      const selectedDataObj = dataArr.find((dataObj) => dataObj.key === selectedValue);
      textareaConv.value = selectedDataObj ? selectedDataObj.value : '';
    });
  };

  oReq.send();
});


/////////////////DOB & Age Calculation//////////////////////
////////////////////////////////////////////////////////////
const datepicker = new Pikaday({
  field: document.getElementById('datepicker'),  
  toString(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
  onSelect: function(date) {
    const today = moment();
    const selectedDate = moment(date, 'DD/MMM/YYYY');
    if (selectedDate.isAfter(today)) {
      // alert("Date of Birth (DOB) can't be in the future. ");
      const message = "Date of Birth (DOB) can't be in the future. ";
      const dialog = document.createElement('dialog');
      dialog.innerHTML = `
        <p>${message}</p>
        <button>Close</button>
      `;
      dialog.querySelector('button').addEventListener('click', () => {
        dialog.close();
      });
      document.body.appendChild(dialog);
      dialog.showModal();
      return;
    }
    const age = calculateAge(date);
    document.getElementById('age').value = age.toFixed(2);
    // This line will call the functions depending on the change in age
    onInputChange();
  }
});

// Calculate age function from DOB
function calculateAge(date) {
  const today = moment();
  const birthDate = moment(date, 'DD/MMM/YYYY');
  const age = today.diff(birthDate, 'years', true);
  return age;
}
/////////////////////////////////////////////////////////
///////////////////IV fkuids and DKA Calculations////////
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
    document.getElementById("15%input")
  ];

  for (let i = 0; i < rates.length; i++) {
    const rate = infusionRate + parseInt((rates[i] * limitedBodyWeight * 1000) / 24);
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
          kCorrectionInput.value = "Add 80 mEq/L or give 0.5-1.0 mEq/kg as oral K solution";
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

    totFluidInput.value = totDKAIVFluids.toFixed(2);
    fluidMlHrInput.value = (fluOver === "24 Hours" ? (totDKAIVFluids / 23) : (totDKAIVFluids / 47)).toFixed(2);
  }
}

/////////////////Growth Percentiles calculation/////////////////////////////////////////////////
// this code listens for changes in the patient et, ht, hc, age geneder and call the functions//
////////////////////////////////////////////////////////////////////////////////////////////////
// document.getElementById("age").addEventListener("input", getVitalSignsForAge);
// document.getElementById("age").addEventListener("input", wtPercentCalc);
// document.getElementById("age").addEventListener("input", htPercentCalc);
// document.getElementById("age").addEventListener("input", bmiPercentCalc);
// document.getElementById("age").addEventListener("input", hcPercentCalc);
// document.getElementById("age").addEventListener("input", wtstatPercentCalc);



// document.getElementById("ptWt").addEventListener("input", wtPercentCalc);
// document.getElementById("ptWt").addEventListener("input", calculateBMI);
// document.getElementById("ptWt").addEventListener("input", bmiPercentCalc);
// document.getElementById("ptWt").addEventListener("input", calculateSA);
// document.getElementById("ptWt").addEventListener("input", wtstatPercentCalc);

// document.getElementById("ptHt").addEventListener("input", htPercentCalc);
// document.getElementById("ptHt").addEventListener("input", calculateBMI);
// document.getElementById("ptHt").addEventListener("input", bmiPercentCalc);
// document.getElementById("ptHt").addEventListener("input", calculateSA);
// document.getElementById("ptHt").addEventListener("input", wtstatPercentCalc);

// document.getElementById("ptHc").addEventListener("input", hcPercentCalc);

// const genderRadios = document.querySelectorAll('input[name="gender"]');
// for (const radio of genderRadios) {
//   radio.addEventListener("change", wtPercentCalc);
//   radio.addEventListener("change", htPercentCalc);
//   radio.addEventListener("change", bmiPercentCalc);
//   radio.addEventListener("change", hcPercentCalc);
//   radio.addEventListener("change", wtstatPercentCalc);
// }


function onInputChange() {
  wtPercentCalc();
  htPercentCalc();
  calculateBMI();
  bmiPercentCalc();
  hcPercentCalc();
  wtstatPercentCalc();
  calculateSA();
  getVitalSignsForAge();
  fifthBpPercentCalculate();
  BpMAPCalculate(); 
  getBloodPressurePercentiles();
}

document.getElementById("age").addEventListener("input", onInputChange);
document.getElementById("ptWt").addEventListener("input", onInputChange);
document.getElementById("ptHt").addEventListener("input", onInputChange);
document.getElementById("ptHc").addEventListener("input", onInputChange);

const genderRadios = document.querySelectorAll('input[name="gender"]');
for (const radio of genderRadios) {
  radio.addEventListener("change", onInputChange);
}

/////////////////////////////////////////////////
// calculate patient's weight percentiles //
///////////////////////////////////////////////////////
async function wtPercentCalc() {
  // First: Check if the weight is not negative, set it to 0 if negative
  const weightInput = document.getElementById("ptWt");
  let weight = parseFloat(weightInput.value);
  if (weight < 0) {
    weightInput.value = 0;
    weight = 0;
  }

  // Second: Check if DOB is entered, exit function if age > 18 years
  const ageInYears = parseFloat(document.getElementById("age").value);
  if (ageInYears === 0 || ageInYears === null || ageInYears > 18) {
    document.getElementById("ptwtpercent").value = "";
    document.getElementById("ptwt3percent").value = "";
    document.getElementById("ptwt50percent").value = "";
    document.getElementById("ptwt97percent").value = "";

      return;
  }

  // Third: Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;
  if (!gender) {
      return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "/ref/data.xlsx";
  const workbook = await readWorkbook(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const sheetName = "wtage";
  const sheet = workbook.Sheets[sheetName];
  const range = gender === "male" ? "B2:B244" : "Q2:Q244";
  const ageRow = findApproximateMatch(sheet, range, ageInMonths);

  // Sixth: Get L, M, S values corresponding to the patient age in months
  const lCol = gender === "male" ? "C" : "R";
  const mCol = gender === "male" ? "D" : "S";
  const sCol = gender === "male" ? "E" : "T";
  const l = sheet[lCol + ageRow].v;
  const m = sheet[mCol + ageRow].v;
  const s = sheet[sCol + ageRow].v;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((weight / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);
  
  // Update the input elements with the calculated values
  document.getElementById("ptwtpercent").value = percentile.toFixed(0);
  document.getElementById("ptwt3percent").value = (m * ((1 + l * s * -1.88079) ** (1 / l))).toFixed(0);
  document.getElementById("ptwt50percent").value = m.toFixed(0);
  document.getElementById("ptwt97percent").value = (m * ((1 + l * s * 1.88079) ** (1 / l))).toFixed(0);
}

function findApproximateMatch(sheet, range, target) {
  const cells = XLSX.utils.decode_range(range);
  for (let row = cells.s.r; row <= cells.e.r; row++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: cells.s.c });
      const cellValue = sheet[cellRef].v;
      if (cellValue >= target) {
          return row + 1; // 1-based row number
      }
  }
  return null;
}

async function readWorkbook(file) {
  const response = await fetch(file);
  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, {type: "array"});
  return workbook;
}


////////////////////////////////////////////
// Height percentiles calculation function//
/////////////////////////////////////////////
async function htPercentCalc() {
  // First: Check if the height is not negative, set it to 0 if negative
  const heightInput = document.getElementById("ptHt");
  let height = parseFloat(heightInput.value);
  if (height < 0) {
    heightInput.value = 0;
    height = 0;
  }

  // Second: Check if DOB is entered, exit function if age > 18 years
  const ageInYears = parseFloat(document.getElementById("age").value);
  if (ageInYears === 0 || ageInYears === null || ageInYears > 18) {
    document.getElementById("pthtpercent").value = "";
    document.getElementById("ptht3percent").value = "";
    document.getElementById("ptht50percent").value = "";
    document.getElementById("ptht97percent").value = "";

    return;
  }

  // Third: Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;
  if (!gender) {
      return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "/ref/data.xlsx";
  const workbook = await readWorkbook(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const sheetName = "statage";
  const sheet = workbook.Sheets[sheetName];
  const range = gender === "male" ? "B2:B244" : "Q2:Q244";
  const ageRow = findApproximateMatch(sheet, range, ageInMonths);

  // Sixth: Get L, M, S values corresponding to the patient age in months
  const lCol = gender === "male" ? "C" : "R";
  const mCol = gender === "male" ? "D" : "S";
  const sCol = gender === "male" ? "E" : "T";
  const l = sheet[lCol + ageRow].v;
  const m = sheet[mCol + ageRow].v;
  const s = sheet[sCol + ageRow].v;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((height / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);
  
  // Update the input elements with the calculated values
  document.getElementById("pthtpercent").value = percentile.toFixed(0);
  document.getElementById("ptht3percent").value = (m * ((1 + l * s * -1.88079) ** (1 / l))).toFixed(0);
  document.getElementById("ptht50percent").value = m.toFixed(0);
  document.getElementById("ptht97percent").value = (m * ((1 + l * s * 1.88079) ** (1 / l))).toFixed(0);
  getBloodPressurePercentiles()
}

//////////////////////////////////////////
// calculate patient's BMI//
//////////////////////////////////////////
function calculateBMI() {
  // Get the weight and height input values
  const weight = parseFloat(document.getElementById("ptWt").value);
  const height = parseFloat(document.getElementById("ptHt").value);
  const ageInYears = parseFloat(document.getElementById("age").value);

  // Check if both weight and height are available
  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0 || ageInYears <= 2) {
    document.getElementById("BMI").value = "";
    return;
  }

  // Calculate the BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Update the BMI value in the element with id "BMI"
  document.getElementById("BMI").value = bmi.toFixed(0);
}

/////////////////////////////////////////////////////////
// calculate patient's BMI percentiles / /
////////////////////////////////////////////////////////////
async function bmiPercentCalc() {
  // First: get the BMI value
  const bmiInput = document.getElementById("BMI");
  let bmi = parseFloat(bmiInput.value);
  

  // Second: Check if DOB is entered, exit function if age > 18 years or the age < 2 years
  const ageInYears = parseFloat(document.getElementById("age").value);
  if (ageInYears === 0 || ageInYears === null || ageInYears >18 || ageInYears <= 2) {
    document.getElementById("ptbmipercent").value = "";
    document.getElementById("ptbmi3percent").value = "";
    document.getElementById("ptbmi50percent").value = "";
    document.getElementById("ptbmi97percent").value = "";

      return;
  }

  // Third: Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;
  if (!gender) {
      return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "/ref/data.xlsx";
  const workbook = await readWorkbook(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const sheetName = "bmiage";
  const sheet = workbook.Sheets[sheetName];
  const range = gender === "male" ? "B2:O220" : "R2:AE220";
  const ageRow = findApproximateMatch(sheet, range, ageInMonths);

  // Sixth: Get L, M, S values corresponding to the patient age in months
  const lCol = gender === "male" ? "C" : "S";
  const mCol = gender === "male" ? "D" : "T";
  const sCol = gender === "male" ? "E" : "U";
  const l = sheet[lCol + ageRow].v;
  const m = sheet[mCol + ageRow].v;
  const s = sheet[sCol + ageRow].v;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((bmi / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);
  
  // Update the input elements with the calculated values
  document.getElementById("ptbmipercent").value = percentile.toFixed(0);
  document.getElementById("ptbmi3percent").value = (m * ((1 + l * s * -1.88079) ** (1 / l))).toFixed(0);
  document.getElementById("ptbmi50percent").value = m.toFixed(0);
  document.getElementById("ptbmi97percent").value = (m * ((1 + l * s * 1.88079) ** (1 / l))).toFixed(0);
}


/////////////////////////////////////////////////////////
// calculate Head Circumference percentiles / /
////////////////////////////////////////////////////////////
async function hcPercentCalc() {
  // First: Check if the Head Circumference is not negative, set it to 0 if negative
  const hcInput = document.getElementById("ptHc");
  let hc = parseFloat(hcInput.value);
  if (hc < 0) {
    hcInput.value = 0;
    hc = 0;
  }

  // Second: Check if DOB is entered, exit function if age > 18 years
  const ageInYears = parseFloat(document.getElementById("age").value);
  if (ageInYears === 0 || ageInYears === null || ageInYears >3) {
    document.getElementById("pthcpercent").value = "";
    document.getElementById("pthc3percent").value = "";
    document.getElementById("pthc50percent").value = "";
    document.getElementById("pthc97percent").value = "";
  
      return;
  }

  // Third: Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;
  if (!gender) {
      return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "/ref/data.xlsx";
  const workbook = await readWorkbook(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const sheetName = "hcageinf";
  const sheet = workbook.Sheets[sheetName];
  const range = gender === "male" ? "B2:N39" : "Q2:AC39";
  const ageRow = findApproximateMatch(sheet, range, ageInMonths);

  // Sixth: Get L, M, S values corresponding to the patient age in months
  const lCol = gender === "male" ? "C" : "R";
  const mCol = gender === "male" ? "D" : "S";
  const sCol = gender === "male" ? "E" : "T";
  const l = sheet[lCol + ageRow].v;
  const m = sheet[mCol + ageRow].v;
  const s = sheet[sCol + ageRow].v;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((hc / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);
  
  // Update the input elements with the calculated values
  document.getElementById("pthcpercent").value = percentile.toFixed(0);
  document.getElementById("pthc3percent").value = (m * ((1 + l * s * -1.88079) ** (1 / l))).toFixed(0);
  document.getElementById("pthc50percent").value = m.toFixed(0);
  document.getElementById("pthc97percent").value = (m * ((1 + l * s * 1.88079) ** (1 / l))).toFixed(0);
}

//////////////////////////////////////
//////////calculate body surface area //
///////////////////////////////////////
function calculateSA() {
  // Get the weight and height input values
  const weight = parseFloat(document.getElementById("ptWt").value);
  const height = parseFloat(document.getElementById("ptHt").value);

  // Check if both weight and height are available
  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    document.getElementById("bsa").value = "";
    return;
  }

  // Calculate the SA 
  const sa = Math.sqrt(weight * height/ 3600);

  // Update the sa value in the element with id "bsa"
  document.getElementById("bsa").value = sa.toFixed(2);
}



//////////////////////////////////////////////////////
// calculate weight stature percentiles //////////////
//////////////////////////////////////////////////////
async function wtstatPercentCalc() {
  // Get the weight and height input values
  const weight = parseFloat(document.getElementById("ptWt").value);
  const height = parseFloat(document.getElementById("ptHt").value);

  // Check if both weight and height are available
  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    return;
  }
  // Second: Check if DOB is entered, exit function if age > 3 years
  const ageInYears = parseFloat(document.getElementById("age").value);
  if (ageInYears === 0 || ageInYears === null || ageInYears > 3) {
    document.getElementById("ptwtstatpercent").value = "";
    document.getElementById("ptwtstat3percent").value = "";
    document.getElementById("ptwtstat50percent").value = "";
    document.getElementById("ptwtstat97percent").value = "";


      return;
  }

  // Third: Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;
  if (!gender) {
      return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "/ref/data.xlsx";
  const workbook = await readWorkbook(dataFile);

  // Fifth: find Height approximate match  
  const sheetName = "wtstat";
  const sheet = workbook.Sheets[sheetName];
  const range = gender === "male" ? "B2:O47" : "R2:AE47";
  const htRow = findApproximateMatch(sheet, range, height);

  // Sixth: Get L, M, S values corresponding to the patient height
  const lCol = gender === "male" ? "C" : "S";
  const mCol = gender === "male" ? "D" : "T";
  const sCol = gender === "male" ? "E" : "U";
  const l = sheet[lCol + htRow].v;
  const m = sheet[mCol + htRow].v;
  const s = sheet[sCol + htRow].v;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((weight / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);
  
  // Update the input elements with the calculated values
  document.getElementById("ptwtstatpercent").value = percentile.toFixed(0);
  document.getElementById("ptwtstat3percent").value = (m * ((1 + l * s * -1.88079) ** (1 / l))).toFixed(0);
  document.getElementById("ptwtstat50percent").value = m.toFixed(0);
  document.getElementById("ptwtstat97percent").value = (m * ((1 + l * s * 1.88079) ** (1 / l))).toFixed(0);
}

//////////////////////////////////////////////////////////
//////////////Get Normal Vital Signs //////////////
/////////////////////////////////////////////////////
async function getVitalSignsForAge() {
  
  // First: Check if age is available
  const ageInYears = parseFloat(document.getElementById("age").value);
  if (ageInYears === 0 || ageInYears === null) {
    return;
  }

  // Second: Convert the age to months
  const ageInMonths = ageInYears * 12;

  // Read data from the .xlsx file
  const dataFile = "/ref/data.xlsx";
  const workbook = await readWorkbook(dataFile);

  // Get the VitalSigns sheet
  const sheetName = "VitalSigns";
  const sheet = workbook.Sheets[sheetName];

  // Third: Do approximate match of patient age to the age in A2:A302
  const ageRow = findApproximateMatch(sheet, "A2:A302", ageInMonths);

  // Fourth: Get the corresponding values
  const minHR = sheet["B" + ageRow].v;
  const maxHR = sheet["C" + ageRow].v;
  const minRR = sheet["D" + ageRow].v;
  const maxRR = sheet["E" + ageRow].v;

  // Fifth: Display the values
  document.getElementById("hr").value = `${minHR} - ${maxHR}`;
  document.getElementById("rr").value = `${minRR} - ${maxRR}`;
}

////////////////////////////////////////////////
////Blood Pressure Percentiles //////////////
////////////////////////////////////////////////

//// 5% BP calculation///
function fifthBpPercentCalculate() {
  const ageElement = document.getElementById("age");
  const ageInYears = parseFloat(ageElement.value);
  if (!ageInYears || ageInYears <= 0 || ageInYears > 18) {
    document.getElementById("Bp5Percent").value = "";
    return;
  }

  const ageInMonths = ageInYears * 12;

  if (ageInMonths <= 1) {
    document.getElementById("Bp5Percent").value = "60";
  } else if (ageInMonths > 1 && ageInMonths <= 12) {
    document.getElementById("Bp5Percent").value = "70";
  } else if (ageInMonths > 12 && ageInMonths <= 120) {
    document.getElementById("Bp5Percent").value = Math.floor(70 + ageInYears * 2);
  } else {
    document.getElementById("Bp5Percent").value = ">90";
  }
}

//// MAP BP calculation///
function BpMAPCalculate() {
  const ageElement = document.getElementById("age");
  const ageInYears = parseFloat(ageElement.value);
  if (!ageInYears || ageInYears <= 0 || ageInYears > 18) {
    document.getElementById("MAP5Percent").value = "";
    document.getElementById("MAP50Percent").value = "";
    return;
  }

  document.getElementById("MAP5Percent").value = Math.floor(40+ ageInYears * 1.5);
  document.getElementById("MAP50Percent").value = Math.floor(55 + ageInYears * 1.5);
}


///Reading the BP percentiles
let workbookCache = null;

async function readWorkbookOnce(filePath) {
  if (!workbookCache) {
    workbookCache = await readWorkbook(filePath);
  }
  return workbookCache;
}


//////////get the 50%,90%,95%,99% Percentiles //////////////
///////////////////////////////////////////////////////////
// async function getBloodPressurePercentiles() {
//   // Get the age, gender, and height percentile
//   const ageInYears = parseFloat(document.getElementById("age").value);
//   let heightpercent = parseFloat(document.getElementById("pthtpercent").value);

//   if (isNaN(ageInYears) || ageInYears <= 0 || isNaN(heightpercent)) {
//     return;
//   }

//   const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;
//   if (!gender) {
//     return;
//   }

//   if (heightpercent <= 7.5) {
//     heightpercent = "5%";
//   } else if (heightpercent > 7.5 && heightpercent < 17.5) {
//     heightpercent = "10%";
//   } else if (heightpercent >= 17.5 && heightpercent < 37.5) {
//     heightpercent = "25%";
//   } else if (heightpercent >= 37.5 && heightpercent < 62.5) {
//     heightpercent = "50%";
//   } else if (heightpercent >= 62.5 && heightpercent < 82.5) {
//     heightpercent = "75%";
//   } else if (heightpercent >= 82.5 && heightpercent < 92.5) {
//     heightpercent = "90%";
//   } else {
//     heightpercent = "95%";
//   }

//   const age = Math.floor(ageInYears);
//   if (age >= 17.5 || age < 1) {
//     document.getElementById("Bp50Percent").value = "";
//     document.getElementById("Bp90Percent").value = "";
//     document.getElementById("Bp95Percent").value = "";
//     document.getElementById("Bp99Percent").value = "";
//     document.getElementById("dBp50Percent").value = "";
//     document.getElementById("dBp90Percent").value = "";
//     document.getElementById("dBp95Percent").value = "";
//     document.getElementById("dBp99Percent").value = "";
//     return;
//   }

//   // read the data.xlsx file
//   const workbook = await readWorkbook("data.xlsx");
//   const sheet = workbook.Sheets["BP"];

  
//   if (gender === 'Male') {

//     let heightColumn = "";
//     if (heightpercent === "5%") {
//       heightColumn = "E";
//     } else if (heightpercent === "10%") {
//       heightColumn = "F";
//     } else if (heightpercent === "25%") {
//       heightColumn = "G";
//     } else if (heightpercent === "50%") {
//       heightColumn = "H";
//     } else if (heightpercent === "75%") {
//       heightColumn = "I";
//     } else if (heightpercent === "90%") {
//       heightColumn = "J";
//     } else if (heightpercent === "95%") {
//       heightColumn = "K";
//     }

//     //BP 50%
//     systolicRange = ['D2', 'K19'];
//   // I need a code here

//     diastolicRange = ['D78', 'K95'];
//     //I need aa code her to find the 50% of diastolic blood pressure
//   } else {
//     //BP 50%
//     systolicRange = ['P2', 'W19'];
//     diastolicRange = ['P78', 'W95'];
//   }


// }


async function getBloodPressurePercentiles() {  
  const ageInYears = parseFloat(document.getElementById("age").value);
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  // let heightPercentile = parseFloat(document.getElementById("pthtpercent").value);
  let heightPercentile = document.getElementById("pthtpercent").value;
  // const height = parseFloat(document.getElementById("ptHt").value);

  
  if (!ageInYears || !gender || !heightPercentile ||isNaN(heightPercentile) ) {
    document.getElementById("Bp50Percent").value = "";
    document.getElementById("Bp90Percent").value = "";
    document.getElementById("Bp95Percent").value = "";
    document.getElementById("Bp99Percent").value = "";
    document.getElementById("dBp50Percent").value = "";
    document.getElementById("dBp90Percent").value = "";
    document.getElementById("dBp95Percent").value = "";
    document.getElementById("dBp99Percent").value = "";
    return;
  }
  
  if (heightPercentile <= 7.5) {
    heightPercentile = "5%";
      } else if (heightPercentile > 7.5 && heightPercentile < 17.5) {
        heightPercentile = "10%";
      } else if (heightPercentile >= 17.5 && heightPercentile < 37.5) {
        heightPercentile = "25%";
      } else if (heightPercentile >= 37.5 && heightPercentile < 62.5) {
        heightPercentile = "50%";
      } else if (heightPercentile >= 62.5 && heightPercentile < 82.5) {
        heightPercentile = "75%";
      } else if (heightPercentile >= 82.5 && heightPercentile < 92.5) {
        heightPercentile = "90%";
      } else {
        heightPercentile = "95%";
      }

      console.log(heightPercentile);
      const workbook = await readWorkbookOnce('/ref/data.xlsx');
      const sheet = workbook.Sheets['BP']; 

  const bpIds = ['Bp50Percent', 'Bp90Percent', 'Bp95Percent', 'Bp99Percent'];
  const dbpIds = ['dBp50Percent', 'dBp90Percent', 'dBp95Percent', 'dBp99Percent'];

  for (let i = 0; i < 4; i++) {
    const systolic = lookupValue(sheet, gender, 'systolic', i, ageInYears, heightPercentile);
    const diastolic = lookupValue(sheet, gender, 'diastolic', i, ageInYears, heightPercentile);

    document.getElementById(bpIds[i]).value = systolic;
    document.getElementById(dbpIds[i]).value = diastolic;
  }
}

// function lookupValue(sheet, gender, type, percentileIndex, ageInYears, heightPercentile) {

//   const ranges = {
//     'male': {
//       'systolic': ['D2:K19', 'D21:K38', 'D40:K57', 'D59:K76'],
//       'diastolic': ['D78:K95', 'D97:K114', 'D116:K133', 'D135:K152']
//     },
//     'female': {
//       'systolic': ['P2:W19', 'P21:W38', 'P40:W57', 'P59:W76'],
//       'diastolic': ['P78:W95', 'P97:W114', 'P116:W133', 'P135:W152']
//     }
//   };

//   const currentRange = ranges[gender][type][percentileIndex];
//   const [startCell, endCell] = currentRange.split(':');
//   const startCol = startCell.charAt(0);
//   const endCol = endCell.charAt(0);
//   const startRow = parseInt(startCell.slice(1));
//   const endRow = parseInt(endCell.slice(1));

//   for (let row = startRow + 1; row <= endRow; row++) {
//     const ageCellAddress = startCol + row;
//     const ageCellValue = sheet[ageCellAddress]?.v;

//     if (ageCellValue === ageInYears) {
//       const heightPercentilesRow = startRow;
//       for (let col = startCol.charCodeAt(0) + 2; col <= endCol.charCodeAt(0); col++) {
//         const heightPercentileCellAddress = String.fromCharCode(col) + heightPercentilesRow;
//         const heightPercentileCellValue = sheet[heightPercentileCellAddress]?.v;

//         if (heightPercentileCellValue === heightPercentile) {
//           const valueCellAddress = String.fromCharCode(col) + row;
//           const valueCellValue = sheet[valueCellAddress]?.v;
//           return valueCellValue ? Math.round(valueCellValue) : '';
//         }
//       }
//     }
//   }

//   return '';
// }


function lookupValue(sheet, gender, type, percentileIndex, ageInYears, heightPercentile) {
  const ranges = {
    'male': {
      'systolic': ['D2:K19', 'D21:K38', 'D40:K57', 'D59:K76'],
      'diastolic': ['D78:K95', 'D97:K114', 'D116:K133', 'D135:K152']
    },
    'female': {
      'systolic': ['P2:W19', 'P21:W38', 'P40:W57', 'P59:W76'],
      'diastolic': ['P78:W95', 'P97:W114', 'P116:W133', 'P135:W152']
    }
  };

  const currentRange = ranges[gender][type][percentileIndex];
  const [startCell, endCell] = currentRange.split(':');
  const startCol = startCell.charAt(0);
  const endCol = endCell.charAt(0);
  const startRow = parseInt(startCell.slice(1));
  const endRow = parseInt(endCell.slice(1));

  for (let row = startRow + 1; row <= endRow; row++) {
    const ageCellAddress = startCol + row;
    const ageCellValue = sheet[ageCellAddress]?.v;

    if (ageCellValue === ageInYears) {
      const heightPercentilesRow = startRow;
      for (let col = startCol.charCodeAt(0) + 1; col <= endCol.charCodeAt(0); col++) {
        const heightPercentileCellAddress = String.fromCharCode(col) + heightPercentilesRow;
        const heightPercentileCellValue = sheet[heightPercentileCellAddress]?.v;

        if (parseFloat(heightPercentile) === parseFloat(heightPercentileCellValue)) {
          const valueCellAddress = String.fromCharCode(col) + row;
          const valueCellValue = sheet[valueCellAddress]?.v;
          return valueCellValue ? Math.round(valueCellValue) : '';
        }
      }
    }
  }

  return '';
}


/////////////////////////////////////////
///RBC's indicies calculation//////////
///////////////////////////////////////
function calculateIndices() {
  // Get the input elements
  const RBC = document.getElementById("RBC");
  const Hb = document.getElementById("Hb");
  const RDW = document.getElementById("RDW");
  const MCV = document.getElementById("MCV");
  const MCH = document.getElementById("MCH");
  const MCHC = document.getElementById("MCHC");

  // Check if all the required inputs are provided
  if (!RBC.value || !Hb.value || !RDW.value || !MCV.value || !MCH.value || !MCHC.value) {
    alert("Please enter all required values.");
    return;
  }

   // Convert input values to floats
   const rbc = parseFloat(RBC.value);
   const hb = parseFloat(Hb.value);
   const rdw = parseFloat(RDW.value);
   const mcv = parseFloat(MCV.value);
   const mch = parseFloat(MCH.value);
   const mchc = parseFloat(MCHC.value);
 


  // Calculate based on RBCs RBCs count in millions  < 5 IDA , > 5 thalassemia
  const RBCCountResult = document.getElementById("RBCc");
  if (parseFloat(RBC.value) < 5) {
    RBCCountResult.value = "IDA";
    RBCCountResult.style.backgroundColor = "#FFC0C0";
  } else {
    RBCCountResult.value = "β-Thal";
    RBCCountResult.style.backgroundColor = "#80FF80";
  }

  // Calculate based on RDW RDW%. In IDA> 14 , in β-Thal<14.
  const RDWResult = document.getElementById("inRDW");
  if (rdw > 14) {
    RDWResult.value = "IDA";
    RDWResult.style.backgroundColor = "#FFC0C0";
  } else {
    RDWResult.value = "β-Thal";
    RDWResult.style.backgroundColor = "#80FF80";
  }

   // Calculate based on Mentzer MCV/RBC . In IDA> 13 , in β-Thal< 13.Most reliable index(98.7%, 82.3%, 81%)
   const MentzerResult = document.getElementById("Mentzer");
   if (mcv / rbc > 13) {
     MentzerResult.value = "IDA";
     MentzerResult.style.backgroundColor = "#FFC0C0";
   } else {
     MentzerResult.value = "β-Thal";
     MentzerResult.style.backgroundColor = "#80FF80";
   }

  // Calculate based on Shine and Lal, MCV ×MCV x MCH. In IDA> 1530 , in β-Thal< 1530.Lowest reliability
  const ShineLalResult = document.getElementById("ShineLal");
  if (mcv * mcv * mch > 1530) {
    ShineLalResult.value = "IDA";
    ShineLalResult.style.backgroundColor = "#FFC0C0";
  } else {
    ShineLalResult.value = "β-Thal";
    ShineLalResult.style.backgroundColor = "#80FF80";
  }

// Calculate based on England and Fraser
const EnglFrasResult = document.getElementById("EnglFras");
if (mcv - rbc - (5 * hb) - 3.4 > 0) {
  EnglFrasResult.value = "IDA";
  EnglFrasResult.style.backgroundColor = "#FFC0C0";
} else {
  EnglFrasResult.value = "β-Thal";
  EnglFrasResult.style.backgroundColor = "#80FF80";
}


// Calculate based on Srivastava
const SrivastavaResult = document.getElementById("Srivastava");
if (mch / rbc > 3.8) {
  SrivastavaResult.value = "IDA";
  SrivastavaResult.style.backgroundColor = "#FFC0C0";
} else {
  SrivastavaResult.value = "β-Thal";
  SrivastavaResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Green and King (G&K)
const GKResult = document.getElementById("GK");
if (mcv * mcv * rdw / 100 / hb > 65) {
  GKResult.value = "IDA";
  GKResult.style.backgroundColor = "#FFC0C0";
} else {
  GKResult.value = "β-Thal";
  GKResult.style.backgroundColor = "#80FF80";
}

// Calculate based on RDWI
const RDWIResult = document.getElementById("RDWI");
if (mcv * rdw / rbc > 220) {
  RDWIResult.value = "IDA";
  RDWIResult.style.backgroundColor = "#FFC0C0";
} else {
  RDWIResult.value = "β-Thal";
  RDWIResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Ricerca
const RicercaResult = document.getElementById("Ricerca");
if (rdw / rbc > 4.4) {
  RicercaResult.value = "IDA";
  RicercaResult.style.backgroundColor = "#FFC0C0";
} else {
  RicercaResult.value = "β-Thal";
  RicercaResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Ehsani
const EhsaniResult = document.getElementById("Ehsani");
if (mcv - (10 * rbc) > 15) {
  EhsaniResult.value = "IDA";
  EhsaniResult.style.backgroundColor = "#FFC0C0";
} else {
  EhsaniResult.value = "β-Thal";
  EhsaniResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Sirdah
const SirdahResult = document.getElementById("Sirdah");
if (mcv - rbc - (3 * hb) > 27) {
  SirdahResult.value = "IDA";
  SirdahResult.style.backgroundColor = "#FFC0C0";
} else {
  SirdahResult.value = "β-Thal";
  SirdahResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Huber-Herklotz
const HubHerResult = document.getElementById("HubHer");
if (((mch * rdw / 10 / rbc) + rdw) > 20) {
  HubHerResult.value = "IDA";
  HubHerResult.style.backgroundColor = "#FFC0C0";
} else {
  HubHerResult.value = "β-Thal";
  HubHerResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Kerman I
const KermanIResult = document.getElementById("KermanI");
if (mcv * mch/rbc > 300) {
  KermanIResult.value = "IDA";
  KermanIResult.style.backgroundColor = "#FFC0C0";
} else {
  KermanIResult.value = "β-Thal";
  KermanIResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Kerman II
const KermanIIResult = document.getElementById("KermanII");
if ((mcv * mch * 10)/(rbc*mchc) > 85) {
  KermanIIResult.value = "IDA";
  KermanIIResult.style.backgroundColor = "#FFC0C0";
} else {
  KermanIIResult.value = "β-Thal";
  KermanIIResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Bessman
const BessmanResult = document.getElementById("Bessman");
if (rdw >15) {
  BessmanResult.value = "IDA";
  BessmanResult.style.backgroundColor = "#FFC0C0";
} else {
  BessmanResult.value = "β-Thal";
  BessmanResult.style.backgroundColor = "#80FF80";
}

// Calculate based on DasGupta
const DasGuptaResult = document.getElementById("DasGupta");
if (((1.89*rbc)-(0.33*rdw) - 3.28) < 0) {
  DasGuptaResult.value = "IDA";
  DasGuptaResult.style.backgroundColor = "#FFC0C0";
} else {
  DasGuptaResult.value = "β-Thal";
  DasGuptaResult.style.backgroundColor = "#80FF80";
}

// Calculate based on TMCHD
const TMCHDResult = document.getElementById("TMCHD");
if (mch/mcv > 0.34) {
  TMCHDResult.value = "IDA";
  TMCHDResult.style.backgroundColor = "#FFC0C0";
} else {
  TMCHDResult.value = "β-Thal";
  TMCHDResult.style.backgroundColor = "#80FF80";
}

// Calculate based on TMDHL
const TMDHLResult = document.getElementById("TMDHL");
if (mch * rbc/mcv <1.75) {
  TMDHLResult.value = "IDA";
  TMDHLResult.style.backgroundColor = "#FFC0C0";
} else {
  TMDHLResult.value = "β-Thal";
  TMDHLResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Keikhaei
const KeikhaeiResult = document.getElementById("Keikhaei");
if (hb * rdw * 100 / rbc / rbc / mchc > 21) {
  KeikhaeiResult.value = "IDA";
  KeikhaeiResult.style.backgroundColor = "#FFC0C0";
} else {
  KeikhaeiResult.value = "β-Thal";
  KeikhaeiResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Nishad
const NishadResult = document.getElementById("Nishad");
if (0.615 * mcv + 0.518 * mch + 0.446 * rdw > 59) {
  NishadResult.value = "IDA";
  NishadResult.style.backgroundColor = "#FFC0C0";
} else {
  NishadResult.value = "β-Thal";
  NishadResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Wongprachum
const WongprachumResult = document.getElementById("Wongprachum");
if (mcv * rdw / rbc - 10 * hb > 104) {
  WongprachumResult.value = "IDA";
  WongprachumResult.style.backgroundColor = "#FFC0C0";
} else {
  WongprachumResult.value = "β-Thal";
  WongprachumResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Sehgal
const SehgalResult = document.getElementById("Sehgal");
if (mcv * mcv / rbc < 972) {
  SehgalResult.value = "IDA";
  SehgalResult.style.backgroundColor = "#FFC0C0";
} else {
  SehgalResult.value = "β-Thal";
  SehgalResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Pornprasert
const PornprasertResult = document.getElementById("Pornprasert");
if (mchc > 31) {
  PornprasertResult.value = "IDA";
  PornprasertResult.style.backgroundColor = "#FFC0C0";
} else {
  PornprasertResult.value = "β-Thal";
  PornprasertResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Sirachainan
const SirachainanResult = document.getElementById("Sirachainan");
if (1.5 * hb - 0.05 * mcv < 14) {
  SirachainanResult.value = "IDA";
  SirachainanResult.style.backgroundColor = "#FFC0C0";
} else {
  SirachainanResult.value = "β-Thal";
  SirachainanResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Bordbar
const BordbarResult = document.getElementById("Bordbar");
if (Math.abs(80 - mcv) * Math.abs(27 - mch) < 44.76) {
  BordbarResult.value = "IDA";
  BordbarResult.style.backgroundColor = "#FFC0C0";
} else {
  BordbarResult.value = "β-Thal";
  BordbarResult.style.backgroundColor = "#80FF80";
}

// Calculate based on Matos and Carvalho
const MatCarResult = document.getElementById("MatCar");
if (1.91 * rbc + 0.44 * mchc < 23.85) {
  MatCarResult.value = "IDA";
  MatCarResult.style.backgroundColor = "#FFC0C0";
} else {
  MatCarResult.value = "β-Thal";
  MatCarResult.style.backgroundColor = "#80FF80";
}

// Calculate based on CRUISE
const CRUISEResult = document.getElementById("CRUISE");
if (mchc + 0.603 * rbc + 0.523 * rdw < 42.63) {
  CRUISEResult.value = "IDA";
  CRUISEResult.style.backgroundColor = "#FFC0C0";
} else {
  CRUISEResult.value = "β-Thal";
  CRUISEResult.style.backgroundColor = "#80FF80";
}

// Get all the result elements by their IDs
const resultIds = [
  "RBCc", "inRDW", "Mentzer", "ShineLal", "EnglFras", "Srivastava", "GK", "RDWI", "Ricerca",
  "Ehsani", "Sirdah", "HubHer", "KermanI", "KermanII", "Bessman", "DasGupta", "TMCHD", "TMDHL",
  "Keikhaei", "Nishad", "Wongprachum", "Sehgal", "Pornprasert", "Sirachainan", "Bordbar", "MatCar",
  "CRUISE"
];

// Count IDA and β-Thal occurrences
let idaCount = 0;
let thalCount = 0;
resultIds.forEach(id => {
  const resultElement = document.getElementById(id);
  if (resultElement.value === "IDA") {
    idaCount++;
  } else if (resultElement.value === "β-Thal") {
    thalCount++;
  }
});

// Display the counts in their respective elements
const idaProbElement = document.getElementById("idaprob");
idaProbElement.value = `IDA count: ${idaCount}`;
idaProbElement.style.backgroundColor = "#FFC0C0";

const thalProbElement = document.getElementById("thalprob");
thalProbElement.value = `β-Thal count: ${thalCount}`;
thalProbElement.style.backgroundColor = "#80FF80";

}



/////////////////////////////////////////////////////////////////////
/////////////poisoning page codes//////////////
/////////////////////////////////////////////////////////////////////

function initializePoisonScript() {
  console.log('DOMContentLoaded fired');
  function getColumnIndexFromRadioButtonValue(value) {
    const mapping = {
      "Mydriasis": "B",
      "Miosis": "C",
      "Tachycardia": "D",
      "Bradycardia": "E",
      "Hypertension": "F",
      "Hypotension": "G",
      "Tachypnea": "H",
      "Bradypnea": "I",
      "Hyperthermia": "J",
      "Hypothermia": "K",
      "Metabolic Acidosis": "L",
      "Metabolic Alkalosis": "M",
      "Respiratory Acidosis": "N",
      "Respiratory Alkalosis": "O",
      "Depression": "P",
      "Agitation": "Q",
      "Hyperglycemia": "R",
      "Hypoglycemia": "S",
      "Red": "T",
      "Pale": "U",
      "Cyanotic": "V",
      "Seizure": "W",
      "Tremor": "X",
      "Rigidity": "Y",
      "Choreoathetosis": "Z",
      "Weakness": "AA",
      "Hypokalemia": "AB",
      "Hyperkalemia": "AC",
      "Increased >13": "AD",
      "Decreased <6": "AE",
      "Hepatotoxicity": "AF",
      "Methemoglobinemia": "AG",
      "Rhabdomyolysis": "AH",
      "Nystagmus": "AI",
    };
    return mapping[value];
  }

  function processSelections() {
    const resultTextarea = document.getElementById("poisonResult");

    console.log("Result textarea:", resultTextarea);
    resultTextarea.value = "Processing...";

    const selectedColumns = [];
    const radioGroups = document.querySelectorAll('input[type="radio"]:checked');
    radioGroups.forEach(radio => {
      if (radio.value !== "Not Sure") {
          const column = getColumnIndexFromRadioButtonValue(radio.value);
          console.log("Radio value:", radio.value, "Column index:", column);
          selectedColumns.push(column);
      }
      });

    console.log("Selected Columns:", selectedColumns);
    fetch("ref/data.xlsx")
      .then(response => {
        if (!response.ok) {
          throw new Error("Error: Unable to load the data.");
        }
        return response.arrayBuffer();
      })
      .then(data => {
        const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
        const sheet = workbook.Sheets["poison"];

        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const poisonSet = new Set();
        console.log("Rows:", rows);

        for (let i = 1; i < rows.length; i++) {
          let row = rows[i];
          for (let column of selectedColumns) {
            const columnIndex = XLSX.utils.decode_col(column);
            const poison = row[columnIndex];
            if (poison && !poisonSet.has(poison)) {
              console.log("Found poison:", poison, "in row:", row);
              poisonSet.add(poison);
            }
          }
        }

        const filteredPoisons = Array.from(poisonSet).filter(poison =>
          selectedColumns.every(column => {
            const columnIndex = XLSX.utils.decode_col(column);
            return rows.some(row => row[columnIndex] === poison);
          })
        );
        console.log("Filtered Poisons:", filteredPoisons);
      if (filteredPoisons.length === 0) {
      console.log("No poisons matched the selected criteria.");
      }
      resultTextarea.value = filteredPoisons.join('\r\n');

        
      },100)
      .catch(error => {
        resultTextarea.value = error.message;
      });
  }

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", processSelections);
  });

  // Initialize the results
  processSelections();
}