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
  if (mcv * mch / rbc > 300) {
    KermanIResult.value = "IDA";
    KermanIResult.style.backgroundColor = "#FFC0C0";
  } else {
    KermanIResult.value = "β-Thal";
    KermanIResult.style.backgroundColor = "#80FF80";
  }

  // Calculate based on Kerman II
  const KermanIIResult = document.getElementById("KermanII");
  if ((mcv * mch * 10) / (rbc * mchc) > 85) {
    KermanIIResult.value = "IDA";
    KermanIIResult.style.backgroundColor = "#FFC0C0";
  } else {
    KermanIIResult.value = "β-Thal";
    KermanIIResult.style.backgroundColor = "#80FF80";
  }

  // Calculate based on Bessman
  const BessmanResult = document.getElementById("Bessman");
  if (rdw > 15) {
    BessmanResult.value = "IDA";
    BessmanResult.style.backgroundColor = "#FFC0C0";
  } else {
    BessmanResult.value = "β-Thal";
    BessmanResult.style.backgroundColor = "#80FF80";
  }

  // Calculate based on DasGupta
  const DasGuptaResult = document.getElementById("DasGupta");
  if (((1.89 * rbc) - (0.33 * rdw) - 3.28) < 0) {
    DasGuptaResult.value = "IDA";
    DasGuptaResult.style.backgroundColor = "#FFC0C0";
  } else {
    DasGuptaResult.value = "β-Thal";
    DasGuptaResult.style.backgroundColor = "#80FF80";
  }

  // Calculate based on TMCHD
  const TMCHDResult = document.getElementById("TMCHD");
  if (mch / mcv > 0.34) {
    TMCHDResult.value = "IDA";
    TMCHDResult.style.backgroundColor = "#FFC0C0";
  } else {
    TMCHDResult.value = "β-Thal";
    TMCHDResult.style.backgroundColor = "#80FF80";
  }

  // Calculate based on TMDHL
  const TMDHLResult = document.getElementById("TMDHL");
  if (mch * rbc / mcv < 1.75) {
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

  // Calculate based on Hisham MCH × RDW / RBC
  const HishamResult = document.getElementById("Hisham");
  if (mch * rdw / rbc > 67) {
    HishamResult.value = "IDA";
    HishamResult.style.backgroundColor = "#FFC0C0";
  } else {
    HishamResult.value = "β-Thal";
    HishamResult.style.backgroundColor = "#80FF80";
  }
  // Get all the result elements by their IDs
  const resultIds = [
    "RBCc", "inRDW", "Mentzer", "ShineLal", "EnglFras", "Srivastava", "GK", "RDWI", "Ricerca",
    "Ehsani", "Sirdah", "HubHer", "KermanI", "KermanII", "Bessman", "DasGupta", "TMCHD", "TMDHL",
    "Keikhaei", "Nishad", "Wongprachum", "Sehgal", "Pornprasert", "Sirachainan", "Bordbar", "MatCar",
    "CRUISE", "Hisham"
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