let x = [1];
let last = 1;
let lastIt = 1
let y = [1];
let allNumbers = [];
let highestdiff = 0;
let highestdiffstartunmber = 0;

test = true;

function isEven(n) {
    return n % 2 == 0;
}

function isOdd(n) {
    return Math.abs(n % 2) == 1;
}


function start() {
    input = document.getElementById("input").value;
    y = [input];
    startnumber = input;
    allNumbers.push(input);
    Run();
}

function Run() {
    done = false;
    input = document.getElementById("input").value;
    let current = parseInt(input);
    if (current === 1) {
        done = true;
        if (lastIt < 100000) {
            Find();
        }
        return;
    } else if (isEven(current)) {
        current = current / 2;
    } else if (isOdd(current)) {
        current = (current * 3) + 1
    }

    if (current - startnumber > highestdiff) {
        highestdiff = current - startnumber;
        highestdiffstartunmber = startnumber;
    }
    document.getElementById("input").value = current;
    document.getElementById("high").innerHTML = "Highest Difference: " + highestdiff;
    document.getElementById("highStart").innerHTML = "Highest Difference Start Number: " + highestdiffstartunmber;
    y.push(current);
    last = last + 1;
    x.push(last);
    TESTER = document.getElementById('tester');
    Plotly.newPlot(TESTER, [{
        x: x,
        y: y
    }], {
        margin: { t: 0 }
    });
    if (allNumbers.includes(current)) {
        Find();
        return;
    }
    allNumbers.push(current);
    setTimeout(Run, 1);
}


function Find() {
    input = document.getElementById("input").value = lastIt;
    lastIt += 1;
    start();
}