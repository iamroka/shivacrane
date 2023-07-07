// Initialize and add the map
function initMap() {
    // The location of hotel
    const hotel = { lat: 15.296722510545417, lng:  73.9694485846559};
    const center = { lat: 15.296722510545417, lng:  73.977};
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

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 56 || document.documentElement.scrollTop > 56) {
        document.getElementById("nav-bar").style.background = "#131211";
    } else {
        document.getElementById("nav-bar").style.background = "none";
    }
}
