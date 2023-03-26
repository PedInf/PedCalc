// JS code to work with the HTML & CSS Code of Pediatric Calculators Project

/////////////////DOB & Age Calculation//////////////////////
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
  }
});

// Calculate age function from DOB
function calculateAge(date) {
  const today = moment();
  const birthDate = moment(date, 'DD/MMM/YYYY');
  const age = today.diff(birthDate, 'years', true);
  return age;
}

//////////////Displaying the detailed Medication Information/////////////////