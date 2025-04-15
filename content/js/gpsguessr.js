let country = "";
let countryGuess = "";
const country_list = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua and; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre and; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts and; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad and; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "U.S. Virgin Islands", "Yemen", "Zambia", "Zimbabwe"];
triesLeft = 2;
resetTo = 2;
numberRight = 0;

//Get country with Cords
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
                countryName = data.countryName;
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
    if (input.toLowerCase() === country.toLowerCase()) {
        alert("Right On");
        GetLatAndLong();
        triesLeft = resetTo;
        numberRight += 1;
        document.getElementById("RightCounter").innerHTML = `Number Right: ${numberRight}`;
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

//Mode 2 Start----------
function PickNew() {
    country = country_list[Math.floor(Math.random() * country_list.length)];
    document.getElementById("Country").innerHTML = "Country: " + country;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function Mode2guess() {
    alert(country);
    Lat = document.getElementById("latInput").value;
    Long = document.getElementById("longInput").value;
    countryGuess = GetLoc(Lat, Long);
    alert(countryGuess);
    if (countryGuess.toLowerCase() === country.toLowerCase()) {
        alert("Yay");
    } else {
        alert("Nope")
    }
}
//Mode 2 End------------

//Hide and unhide
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