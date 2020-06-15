var a = document.getElementById('a');
var b = document.getElementById('b');
sec = false;
pub = false
a.addEventListener("click", aCk, true)
b.addEventListener("click", bCk, false)
if (sec)
    a.appendChild(b)
let evt = new MouseEvent('click', {bubbles: true });
b.dispatchEvent(evt);

function aCk() {
    pub = true //states should be mimic as send operations i.e. send is true ow. false
}
function bCk() { }
console.log("sec is", pub);