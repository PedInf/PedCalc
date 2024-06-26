  // Loading the header for all pages, then triggering the dropdown menu to be ready for click or touch
 //////////////////////////////////////////////////////////////////////////////////////////////////////
  document.addEventListener("DOMContentLoaded", loadHeaderContainer);

function loadHeaderContainer() {
    var headerContainer = document.getElementById("header-container");

    // Construct the absolute path to the header.html based on the root URL of the GitHub Pages site
    var headerPath = 'https://pedinf.github.io/PedCalc/header.html';

    fetch(headerPath)
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
            initializeDropdown(); // Call the function after loading the header
        })
        .catch(err => {
            console.warn("Something went wrong with loading the header:", err);
        });
}



// handles the home button toggles in windows screens and mobile devices
////////////////////////////////////////////////////////////////////////
function initializeDropdown() {
    function toggleDropdown(event) {
      event.stopPropagation();
      event.preventDefault();
      var dropdown = document.querySelector(".dropdown-content");
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
      } else {
        dropdown.style.display = "block";
      }
    }
  
    function closeDropdown() {
      var dropdown = document.querySelector(".dropdown-content");
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
      }
    }
  
    var homeBtn = document.getElementById("home-btn-title");
    if ('ontouchstart' in window) {
      homeBtn.addEventListener("touchstart", toggleDropdown);
    } else {
      homeBtn.addEventListener("click", toggleDropdown);
    }
  
    document.addEventListener("click", closeDropdown);
  }
  
 

  
