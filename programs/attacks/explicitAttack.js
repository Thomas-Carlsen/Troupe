let pub;
function computeStuf(secret) {
    pub = secret;
}
axios.get('http://localhost:6660/receiveSecret?secret='+secret);