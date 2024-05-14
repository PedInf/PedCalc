document.addEventListener("DOMContentLoaded", loadHeaderContainer);

function loadHeaderContainer() {
  var headerContainer = document.getElementById("header-container");
  const inSubfolder = isPageInSubfolder(); // calling the function that detect if the HTML file in subfolder
  const headerPath = constructHeaderPath(inSubfolder); // Construct the correct path to the header file

  fetch(headerPath) // Fetch the header file using the constructed path
    .then(response => response.text())
    .then(html => {
      headerContainer.innerHTML = html;
      initializeDropdown(); // Call the function after loading the header
    })
    .catch(err => {
      console.warn("Something went wrong with loading the header:", err);
    });
}

function isPageInSubfolder() {
  const currentPath = window.location.pathname.split('/');
  currentPath.pop(); // Remove the current HTML file from the path
  return currentPath.length > 1; // Check if there are any remaining path segments
}

function constructHeaderPath(inSubfolder) {
  // Check if the environment is GitHub Pages
  if (window.location.hostname === 'github.com') {
    return "/PedCalc/header.html";
  } else {
    // Construct the path based on whether the page is in a subfolder
    return (inSubfolder ? '../' : '') + 'header.html';
  }
}

// handles the home button toggles in windows screens and mobile devices
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
