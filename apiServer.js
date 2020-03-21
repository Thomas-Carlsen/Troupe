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

app.get('/compile', (req, res) => {
    
    //let p = spawn(process.env.TROUPE + '/bin/troupec', ['./webTestFiles/test1.trp']);
    //let file = fs.readFileSync('./out/out.js');
    
    //res.sendFile(__dirname + '/out/out.js');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
