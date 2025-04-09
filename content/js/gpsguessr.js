

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function GetLatAndLong() {
    la = getRandomArbitrary(-90, 90);
    lon = getRandomArbitrary(-90, 90);
    document.getElementById("lat").innerHTML = "Lat = " + la;
    document.getElementById("long").innerHTML = "Long = " + lon;
    GetLoc(la, lon);
}


// Define the API URL
const apiUrl = 'http://api.geonames.org/countryCodeXML?';

// Make a GET request
function GetLoc(lat, long) {
    fetch(apiUrl + "lat=" + lat + "&lng=" + long + "&username=mrmilkyway")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
            GetLatAndLong();
            alert(error);
        });
}