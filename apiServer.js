const { spawn } = require('child_process');
const express =  require('express');
const cors = require('cors');
const fs = require('fs');

//const ser = require('./serializeAPI.js');

const app = express();
app.use(cors());
const port = 3000;


app.get('/serialize', (req, res) => {
    // let compiler = ser.startCompiler();
    // res.send(compiler);
    let compiler = spawn(process.env.TROUPE + '/bin/troupec', ['--json']);
    res.send(compiler);
});

function readWriteSync(file) {
    var data = fs.readFileSync(file, 'utf-8');
    var dataFixed = data.replace("module.exports = Top ", "");
    fs.writeFileSync(file, dataFixed, 'utf-8');
    console.log('readFileSync complete');
}

app.get('/compile', (req, res) => {
    
    
    let p = spawn(process.env.TROUPE + '/bin/troupec', ['./webTestFiles/test1.trp']);
    readWriteSync('./out/out.js');
    res.sendFile(__dirname + '/out/out.js');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
