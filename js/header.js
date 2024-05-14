document.addEventListener("DOMContentLoaded", loadHeaderContainer);

function loadHeaderContainer() {
  var headerContainer = document.getElementById("header-container");
  const inSubfolder = isPageInSubfolder(); // calling the function that detects if the HTML file is in a subfolder
  const basePath = constructBasePath(); // Get the base path of the project
  const headerPath = constructHeaderPath(inSubfolder, basePath); // Construct the correct path to the header file

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

function constructBasePath() {
  let basePath = window.location.pathname;
  // If the code is hosted on GitHub Pages, adjust basePath
  if (window.location.hostname === 'github.com') {
    basePath = "/PedCalc/";
  } else {
    basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
  }
  return basePath;
}

function constructHeaderPath(inSubfolder, basePath) {
  // Construct the path based on whether the page is in a subfolder and the base path
  return (inSubfolder ? '../' : '') + basePath + 'header.html';
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
