/////////////////DOB & Age Calculation//////////////////////
////////////////////////////////////////////////////////////
const datepicker = new Pikaday({
  field: document.getElementById("datepicker"),
  toString(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
  onSelect: function (date) {
    const today = moment();
    const selectedDate = moment(date, "DD/MMM/YYYY");
    if (selectedDate.isAfter(today)) {
      // alert("Date of Birth (DOB) can't be in the future. ");
      const message = "Date of Birth (DOB) can't be in the future. ";
      const dialog = document.createElement("dialog");
      dialog.innerHTML = `
          <p>${message}</p>
          <button>Close</button>
        `;
      dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
      });
      document.body.appendChild(dialog);
      dialog.showModal();
      return;
    }
    const age = calculateAge(date);
    document.getElementById("age").value = age.toFixed(2);
    // This line will call the functions depending on the change in age
    onInputChange();
  },
});

// Calculate age function from DOB
function calculateAge(date) {
  const today = moment();
  const birthDate = moment(date, "DD/MMM/YYYY");
  const age = today.diff(birthDate, "years", true);
  return age;
}

////////////////////////////////////////////////////////////////////////////////////////////////
// this code listens for changes in the patient wt, ht, hc, age, geneder and call the functions//
////////////////////////////////////////////////////////////////////////////////////////////////

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
  IdealwtCalc()
}

document.getElementById("age").addEventListener("input", onInputChange);
document.getElementById("ptWt").addEventListener("input", onInputChange);
document.getElementById("ptHt").addEventListener("input", onInputChange);
document.getElementById("ptHc").addEventListener("input", onInputChange);

const genderRadios = document.querySelectorAll('input[name="gender"]');
for (const radio of genderRadios) {
  radio.addEventListener("change", onInputChange);
}

function findApproximateMatch(jsonData, gender, target, property) {
  for (let i = 0; i < jsonData.length; i++) {
    const record = jsonData[i];
    if ((gender === null || record.Sex === (gender === "male" ? 1 : 2)) && record[property] >= target) {
      return i;
    }
  }
  return null;
}


////////////////////////////////////////////////////////////////////////////////////////
//this function to read the json files to be ready and faster to display the percentiles
////////////////////////////////////////////////////////////////////////////////////////
async function readJSONFile(file) {
  const response = await fetch(file);
  const jsonData = await response.json();
  return jsonData;
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
  const gender = document.querySelector('input[name="gender"]:checked')
    ? document.querySelector('input[name="gender"]:checked').value
    : null;
  if (!gender) {
    return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "ref/wtage.json";
  const jsonData = await readJSONFile(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const ageRow = findApproximateMatch(jsonData, gender, ageInMonths, "Age");

  // Sixth: Get L, M, S values corresponding to the patient age in months
  if (ageRow === null) {
    return; // Age not found in the data, exit the function
  }

  const record = jsonData[ageRow];
  const l = record.L;
  const m = record.M;
  const s = record.S;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((weight / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);

  // Update the input elements with the calculated values
  document.getElementById("ptwtpercent").value = percentile.toFixed(0);
  document.getElementById("ptwt3percent").value = (
    m *
    (1 + l * s * -1.88079) ** (1 / l)
  ).toFixed(0);
  document.getElementById("ptwt50percent").value = m.toFixed(0);
  document.getElementById("ptwt97percent").value = (
    m *
    (1 + l * s * 1.88079) ** (1 / l)
  ).toFixed(0);
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
  const gender = document.querySelector('input[name="gender"]:checked')
    ? document.querySelector('input[name="gender"]:checked').value
    : null;
  if (!gender) {
    return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "ref/htage.json";
  const jsonData = await readJSONFile(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const ageRow = findApproximateMatch(jsonData, gender, ageInMonths, "Age");

  // Sixth: Get L, M, S values corresponding to the patient age in months
  if (ageRow === null) {
    return; // Age not found in the data, exit the function
  }

  const record = jsonData[ageRow];
  const l = record.L;
  const m = record.M;
  const s = record.S;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((height / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);

  // Update the input elements with the calculated values
  // Update the input elements with the calculated values
  document.getElementById("pthtpercent").value = percentile.toFixed(0);
  document.getElementById("ptht3percent").value = (m * (1 + l * s * -1.88079) ** (1 / l)).toFixed(0);
  document.getElementById("ptht50percent").value = m.toFixed(0);
  document.getElementById("ptht97percent").value = (m * (1 + l * s * 1.88079) ** (1 / l)).toFixed(0);
  getBloodPressurePercentiles();
}

////////////////////////////////////////////
// Calculate Ideal Body Weight
//////////////////////////////////////

async function IdealwtCalc() {
  // Get the age,weight,height input values 
  const weight = parseFloat(document.getElementById("ptWt").value);
  const height = parseFloat(document.getElementById("ptHt").value);
  const ageInYears = parseFloat(document.getElementById("age").value);

  // Check if age,weight,height available
  if (ageInYears === 0 ||
    ageInYears === null ||
    ageInYears > 18 ||
    weight < 0 ||
    weight === null ||
    height < 0 ||
    height === null) {
    document.getElementById("IdealWt").value = "";
    return;
  }

  // Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked')
    ? document.querySelector('input[name="gender"]:checked').value
    : null;
  if (!gender) {
    return;
  }

  // Read Wt data
  const WtdataFile = "ref/wtage.json";
  const jsonWtData = await readJSONFile(WtdataFile);

  // Convert age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const WtageRow = findApproximateMatch(jsonWtData, gender, ageInMonths, "Age");

  if (WtageRow === null) {
    return;
  }
  // Get the Weight L,M,S values 
  const Wtrecord = jsonWtData[WtageRow];
  const lWt = Wtrecord.L;
  const mWt = Wtrecord.M;
  const sWt = Wtrecord.S;

  // Read the Height file and  Calculate the Height Zscore
  const HtdataFile = "ref/htage.json";
  const jsonHtData = await readJSONFile(HtdataFile);
  const HtageRow = findApproximateMatch(jsonHtData, gender, ageInMonths, "Age");
  if (HtageRow === null) {
    return;
  }

  const Htrecord = jsonHtData[HtageRow];
  const lHt = Htrecord.L;
  const mHt = Htrecord.M;
  const sHt = Htrecord.S;

  // Calculate the Zscore and Ideal body weight based on it 
  const HtzScore = ((height / mHt) ** lHt - 1) / (lHt * sHt);
  IdealWt = mWt * Math.pow((lWt * sWt * HtzScore) + 1, 1 / lWt);
  
  document.getElementById("IdealWt").value = isNaN(IdealWt) ? "" : IdealWt.toFixed(0);

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
  if (
    isNaN(weight) ||
    isNaN(height) ||
    weight <= 0 ||
    height <= 0 ||
    ageInYears <= 2
  ) {
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
  if (
    ageInYears === 0 ||
    ageInYears === null ||
    ageInYears > 18 ||
    ageInYears <= 2
  ) {
    document.getElementById("ptbmipercent").value = "";
    document.getElementById("ptbmi3percent").value = "";
    document.getElementById("ptbmi50percent").value = "";
    document.getElementById("ptbmi97percent").value = "";

    return;
  }

  // Third: Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked')
    ? document.querySelector('input[name="gender"]:checked').value
    : null;
  if (!gender) {
    return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "ref/bmiage.json";
  const jsonData = await readJSONFile(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const ageRow = findApproximateMatch(jsonData, gender, ageInMonths, "Age");

  // Sixth: Get L, M, S values corresponding to the patient age in months
  if (ageRow === null) {
    return; // Age not found in the data, exit the function
  }

  const record = jsonData[ageRow];
  const l = record.L;
  const m = record.M;
  const s = record.S;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((bmi / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);

  // Update the input elements with the calculated values
  // Update the input elements with the calculated values
  document.getElementById("ptbmipercent").value = percentile.toFixed(0);
  document.getElementById("ptbmi3percent").value = (m * (1 + l * s * -1.88079) ** (1 / l)).toFixed(0);
  document.getElementById("ptbmi50percent").value = m.toFixed(0);
  document.getElementById("ptbmi97percent").value = (m * (1 + l * s * 1.88079) ** (1 / l)).toFixed(0);

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
  if (ageInYears === 0 || ageInYears === null || ageInYears > 3) {
    document.getElementById("pthcpercent").value = "";
    document.getElementById("pthc3percent").value = "";
    document.getElementById("pthc50percent").value = "";
    document.getElementById("pthc97percent").value = "";

    return;
  }

  // Third: Check if gender is selected
  const gender = document.querySelector('input[name="gender"]:checked')
    ? document.querySelector('input[name="gender"]:checked').value
    : null;
  if (!gender) {
    return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "ref/hcage.json";
  const jsonData = await readJSONFile(dataFile);

  // Fifth: Convert the age to months and find the approximate match
  const ageInMonths = ageInYears * 12;
  const ageRow = findApproximateMatch(jsonData, gender, ageInMonths, "Age");

  // Sixth: Get L, M, S values corresponding to the patient age in months
  if (ageRow === null) {
    return; // Age not found in the data, exit the function
  }

  const record = jsonData[ageRow];
  const l = record.L;
  const m = record.M;
  const s = record.S;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((hc / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);

  // Update the input elements with the calculated values
  // Update the input elements with the calculated values
  document.getElementById("pthcpercent").value = percentile.toFixed(0);
  document.getElementById("pthc3percent").value = (m * (1 + l * s * -1.88079) ** (1 / l)).toFixed(0);
  document.getElementById("pthc50percent").value = m.toFixed(0);
  document.getElementById("pthc97percent").value = (m * (1 + l * s * 1.88079) ** (1 / l)).toFixed(0);

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
  const sa = Math.sqrt((weight * height) / 3600);

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
  const gender = document.querySelector('input[name="gender"]:checked')
    ? document.querySelector('input[name="gender"]:checked').value
    : null;
  if (!gender) {
    return;
  }

  // Fourth: Read data from the .xlsx file
  const dataFile = "ref/wtht.json";
  const jsonData = await readJSONFile(dataFile);

  // Fifth: find Height approximate match  
  const htRow = findApproximateMatch(jsonData, gender, height, "Height");

  // Sixth: Get L, M, S values corresponding to the patient age in height
  if (htRow === null) {
    return; // height not found in the data, exit the function
  }

  const record = jsonData[htRow];
  const l = record.L;
  const m = record.M;
  const s = record.S;

  // Seventh: Calculate the Zscore and Percentile
  const zScore = ((weight / m) ** l - 1) / (l * s);
  const percentile = 100 * jStat.normal.cdf(zScore, 0, 1);

  // Update the input elements with the calculated values
  document.getElementById("ptwtstatpercent").value = percentile.toFixed(0);
  document.getElementById("ptwtstat3percent").value = (m * (1 + l * s * -1.88079) ** (1 / l)).toFixed(0);
  document.getElementById("ptwtstat50percent").value = m.toFixed(0);
  document.getElementById("ptwtstat97percent").value = (m * (1 + l * s * 1.88079) ** (1 / l)).toFixed(0);

}

//////////////////////////////////////////////////////////
//////////////Get Normal Vital Signs //////////////
/////////////////////////////////////////////////////
async function getVitalSignsForAge() {
  // First: Check if age is available
  const ageInYears = parseFloat(document.getElementById("age").value);
  if (ageInYears === 0 || isNaN(ageInYears)) {
    return;
  }

  // Read data from the JSON file
  const dataFile = "ref/hrrr.json";
  const jsonData = await readJSONFile(dataFile);

  // Second: Convert the age to months
  const ageInMonths = ageInYears * 12;

  // Third: Do approximate match of patient age to the age in jsonData
  const ageRow = findApproximateMatch(jsonData, null, ageInMonths, "age");

  // Fourth: Get the corresponding values
  if (ageRow === null) {
    console.error("Age not found in the data.");
    return;
  }

  const record = jsonData[ageRow];
  const minHR = record.hr1;
  const maxHR = record.hr2;
  const minRR = record.rr1;
  const maxRR = record.rr2;

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
    document.getElementById("Bp5Percent").value = Math.floor(
      70 + ageInYears * 2
    );
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

  document.getElementById("MAP5Percent").value = Math.floor(
    40 + ageInYears * 1.5
  );
  document.getElementById("MAP50Percent").value = Math.floor(
    55 + ageInYears * 1.5
  );
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
async function getBloodPressurePercentiles() {
  const ageInYears = parseFloat(document.getElementById("age").value);
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  let heightPercentile = parseFloat(document.getElementById("pthtpercent").value);

  if (!ageInYears || !gender || isNaN(heightPercentile)) {
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

  // Determine heightPercentile category based on the provided value
  if (heightPercentile <= 7.5) {
    heightPercentile = 5;
  } else if (heightPercentile > 7.5 && heightPercentile < 17.5) {
    heightPercentile = 10;
  } else if (heightPercentile >= 17.5 && heightPercentile < 37.5) {
    heightPercentile = 25;
  } else if (heightPercentile >= 37.5 && heightPercentile < 62.5) {
    heightPercentile = 50;
  } else if (heightPercentile >= 62.5 && heightPercentile < 82.5) {
    heightPercentile = 75;
  } else if (heightPercentile >= 82.5 && heightPercentile < 92.5) {
    heightPercentile = 90;
  } else {
    heightPercentile = 95;
  }

  // Read data from the JSON file
  const dataFile = "ref/bp.json";
  const jsonData = await readJSONFile(dataFile);

  // Find the records based on gender, systolic/diastolic, and ageInYears
  const requiredPercentiles = [50, 90, 95, 99];

  const SysDiasBPRecords = jsonData.filter(
    (record) =>
      (record.Sex === (gender === "male" ? 1 : 2)) &&
      ((record.SysDias === "Systolic" || record.SysDias === "Diastolic")) &&
      record.Age === Math.floor(ageInYears) &&
      requiredPercentiles.includes(record.BPpercentile)
  );

  const setValuesInHTML = (SysDiasBPRecords, percentile) => {
    const systolicRecord = SysDiasBPRecords.find((record) => record.SysDias === "Systolic" && record.BPpercentile === percentile);
    const diastolicRecord = SysDiasBPRecords.find((record) => record.SysDias === "Diastolic" && record.BPpercentile === percentile);

    document.getElementById(`Bp${percentile}Percent`).value = systolicRecord?.[heightPercentile.toString()] ?? "";
    document.getElementById(`dBp${percentile}Percent`).value = diastolicRecord?.[heightPercentile.toString()] ?? "";
  };

  // Loop through the required BP percentiles (50, 90, 95, and 99) and set the values in the HTML
  requiredPercentiles.forEach((percentile) => {
    setValuesInHTML(
      SysDiasBPRecords,
      percentile
    );
  });

}