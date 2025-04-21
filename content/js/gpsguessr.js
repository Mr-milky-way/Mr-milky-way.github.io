let country = "";
let countryGuess = "";
let altnames = "";
let CC = "";
triesLeft = 2;
resetTo = 2;
numberRight = 0;

//Get alternate names
async function getCountryAlternateNames(countryCode) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const data = await response.json();

        return {
            translations: data[0].translations,
            altSpellings: data[0].altSpellings,
            demonym: data[0].demonyms?.eng?.f || '',
            officialName: data[0].name.official
        };
    } catch (error) {
        console.error('Error fetching country data:', error);
        return null;
    }
}

//Get country with Cords
const LocapiUrl = 'https://secure.geonames.org/countryCodeJSON?';

function GetLoc(lat, long) {
    fetch(`${LocapiUrl}lat=${lat}&lng=${long}&username=mrmilkyway`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.countryName && data.countryCode) {
                countryName = data.countryName;
                CC = data.countryCode;
                getCountryAlternateNames(countryCode).then(names => {
                    altnames = names.altSpellings.map(v => v.toLowerCase());
                });
            } else if (data.status.value === 19) {
                alert("We are down RN sorry");
            }
            else {
                countryName = "ocean";
                GetLatAndLong();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    return countryName;
}

//Mode 1 Start----------
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
    document.getElementById("RightCounter").innerHTML = `Number Right: ${numberRight}`;
    document.getElementById("GuessNumber").innerHTML = `Tries left: ${triesLeft + 1}`;
}

async function GetLatAndLongNew() {
    la = getRandomArbitrary(-90, 90);
    lon = getRandomArbitrary(-180, 180);
    country = GetLoc(la, lon);
    if (country === "ocean") {
    } else {
        document.getElementById("lat").innerHTML = "Lat = " + la;
        document.getElementById("long").innerHTML = "Long = " + lon;
    }
    triesLeft = resetTo;
    numberRight = 0;
    document.getElementById("RightCounter").innerHTML = `Number Right: ${numberRight}`;
    document.getElementById("GuessNumber").innerHTML = `Tries left: ${triesLeft + 1}`;
}

function Mode1guess() {
    country = GetLoc(la, lon);
    input = document.getElementById("input").value;
    document.getElementById("input").value = "";
    if (input.toLowerCase() === country.toLowerCase() || altnames.includes(input.toLowerCase()) || input.toLowerCase() === CC.toLowerCase()) {
        alert("Right On");
        GetLatAndLong();
        triesLeft = resetTo;
        numberRight += 1;
        document.getElementById("RightCounter").innerHTML = `Number Right: ${numberRight}`;
        document.getElementById("GuessNumber").innerHTML = `Tries left: ${triesLeft + 1}`;
    } else {
        alert("Nope")
        if (triesLeft <= 0) {
            GetLatAndLong();
            triesLeft = resetTo;
            numberRight = 0;
            document.getElementById("RightCounter").innerHTML = `Number Right: ${numberRight}`;
            document.getElementById("GuessNumber").innerHTML = `Tries left: ${triesLeft + 1}`;
        } else {
            triesLeft -= 1;
            document.getElementById("GuessNumber").innerHTML = `Tries left: ${triesLeft + 1}`;
        }
    }
}
//Mode 1 End------------



//Hide and unhide
/*
function unhidemode1() {
    var x = document.getElementById("Mode1");
    var y = document.getElementById("modeSet");
    x.hidden = false;
    y.hidden = true;
}

function unhidemode2() {
    var x = document.getElementById("Mode2");
    var y = document.getElementById("modeSet");
    x.hidden = false;
    y.hidden = true;
}

function hidemodes() {
    var x = document.getElementById("Mode1");
    var y = document.getElementById("Mode2");
    x.hidden = true;
    y.hidden = true;
}
*/