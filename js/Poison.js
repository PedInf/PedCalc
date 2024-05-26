function initializePoisonScript() {
  function processSelections() {
    const resultTextarea = document.getElementById("poisonResult");

    resultTextarea.value = "Processing...";
    const selectedPoisons = [];
    const radioGroups = document.querySelectorAll('input[type="radio"]:checked');
    radioGroups.forEach((radio) => {
      if (radio.value !== "Not Sure") {
        selectedPoisons.push(radio.value);
      }
    });

    fetch("ref/poison.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error: Unable to load the data.");
        }
        return response.json(); // Parse JSON data
      })
      .then((data) => {
        // Get the poisons for all selected symptoms
        const selectedSubstances = selectedPoisons.map((poison) => data[poison]);
      
        // Find the intersection of poisons for all selected symptoms
        let filteredSubstances = selectedSubstances.reduce((acc, substances) => {
          if (acc.length === 0) {
            return substances;
          } else {
            return acc.filter((substance) => substances.includes(substance));
          }
        }, []);
      
        // Ensure that all selected symptoms are present in the filtered substances
        filteredSubstances = filteredSubstances.filter((substance) => {
          return selectedPoisons.every((poison) => data[poison].includes(substance));
        });
      
        if (filteredSubstances.length === 0) {
          // Handle case when no matching data is found
          resultTextarea.value = "";
        } else {
          resultTextarea.value = filteredSubstances.join("\r\n");
        }
      })          
      
  }

  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", processSelections);
  });

  // Initialize the results
  processSelections();
}
