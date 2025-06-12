// Initialize and add the map
function initMap() {
  // The location of hotel
  const hotel = { lat: 15.296722510545417, lng: 73.9694485846559 };
  const center = { lat: 15.296722510545417, lng: 73.977 };
  // The map, centered at hotel
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: hotel,
  });
  // The marker, positioned at hotel
  const marker = new google.maps.Marker({
    position: hotel,
    map: map,
  });
}


window.onload = function () {
  let slides = document.getElementsByClassName("carousel-item");
  let dots = document.getElementsByClassName("dot");
  let interval = 2000;
  function addActive(slide) {
    slide.classList.add("active");
  }

  function removeActive(slide) {
    slide.classList.remove("active");
  }

  setInterval(function () {
    for (let i = 0; i < slides.length; i++) {
      if (i + 1 == slides.length) {
        setTimeout(function () {
          removeActive(slides[i]);
          removeActive(dots[i]);
          addActive(dots[0]);
          addActive(slides[0]);
        }, interval);
        break;
      }
      if (slides[i].classList.contains("active")) {
        setTimeout(function () {
          removeActive(slides[i]);
          removeActive(dots[i]);
          addActive(slides[i + 1]);
          addActive(dots[i + 1]);
        }, interval);
        break;
      }
    }
  }, 0);
};


// ---------------------------------------------------------------------Go To Top Function ----------------------------------------------------------------------------------------
//Get the button
let goTopButton = document.getElementById("btn-back-to-top");


// When the user clicks on the button, scroll to the top of the document
goTopButton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    goTopButton.style.display = "block";
  } else {
    goTopButton.style.display = "none";
  }
}
//for handling navigation to section head on click
// const navigationHeight = document.querySelector('.primary-navigation').offsetHeight;
// document.documentElement.style.setProperty('--scroll-padding', navigationHeight -1 + 'px');


//-------------------------------------------Gallery Functions---------------------------------------------------


function filterSelection(c) {
  var x = document.getElementsByClassName("gallery-item");
  if (c == "all") {
    c = "";
  }
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (var i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1){ 
      w3AddClass(x[i], "show");
    }
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
let btnContainer = document.getElementById("galleryBtnContainer");
let btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = btnContainer.getElementsByClassName("btn active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
filterSelection.call("") // Execute the function and show all columns