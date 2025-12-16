var Calc = null;
async function ThreeD() {
    var elt = document.getElementById('Calc');
    Calc = Desmos.Calculator3D(elt);
}
async function TwoD() {
    var elt = document.getElementById('Calc');
    Calc = Desmos.GraphingCalculator(elt);
}