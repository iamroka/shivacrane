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

//for handling navigation to section head on click
const navigationHeight = document.querySelector('.primary-navigation').offsetHeight;
document.documentElement.style.setProperty('--scroll-padding', navigationHeight -1 + 'px');