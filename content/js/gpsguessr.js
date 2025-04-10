

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function GetLatAndLong() {
    la = getRandomArbitrary(-90, 90);
    lon = getRandomArbitrary(-90, 90);
    GetLoc(la, lon);
    document.getElementById("lat").innerHTML = "Lat = " + la;
    document.getElementById("long").innerHTML = "Long = " + lon;
}


const apiUrl = 'http://api.geonames.org/countryCodeXML?';

function GetLoc(lat, long) {
    fetch(`${apiUrl}lat=${lat}&lng=${long}&username=mrmilkyway`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            const countryName = xmlDoc.querySelector("countryName")?.textContent;
            const countryCode = xmlDoc.querySelector("countryCode")?.textContent;

            if (countryName && countryCode) {
                console.log("Country Name:", countryName);
                console.log("Country Code:", countryCode);
            } else {
                console.warn("Could not extract country information from XML");
                GetLatAndLong();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (typeof GetLatAndLong === 'function') {
                GetLatAndLong();
            }
            alert(error);
        });
}
