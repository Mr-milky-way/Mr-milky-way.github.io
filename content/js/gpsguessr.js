let country = "";
triesLeft = 2;
numberRight = 0;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

async function GetLatAndLong() {
    la = getRandomArbitrary(-90, 90);
    lon = getRandomArbitrary(-180, 180);
    country = GetLoc(la, lon);
    if (country === "ocean") {
        document.getElementById("lat").innerHTML = "Lat = " + la;
        document.getElementById("long").innerHTML = "Long = " + lon;
    } else {
        document.getElementById("lat").innerHTML = "Lat = " + la;
        document.getElementById("long").innerHTML = "Long = " + lon;
    }
}


const apiUrl = 'https://secure.geonames.org/countryCodeJSON?';

function GetLoc(lat, long) {
    fetch(`${apiUrl}lat=${lat}&lng=${long}&username=mrmilkyway`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.countryName && data.countryCode) {
                console.log("Country Name:", data.countryName);
                console.log("Country Code:", data.countryCode);
                countryName = data.countryName;
            } else {
                console.log("In the ocean");
                countryName = "ocean";
                GetLatAndLong();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    return countryName;
}



function guess() {
    country = GetLoc(la, lon);
    input = document.getElementById("input").value;
    if (input.toLowerCase() === country.toLowerCase()) {
        alert("Right On");
        GetLatAndLong();
        triesLeft = 2;
        numberRight += 1;
        document.getElementById("RightCounter").innerHTML = `Number Right: ${numberRight}`;
    } else {
        alert("Nope")
        if (triesLeft <= 0) {
            GetLatAndLong();
            triesLeft = 2;
            document.getElementById("GuessNumber").innerHTML = `Tries left: ${triesLeft + 1}`;
        } else {
            triesLeft -= 1;
            document.getElementById("GuessNumber").innerHTML = `Tries left: ${triesLeft + 1}`;
        }
    }
}