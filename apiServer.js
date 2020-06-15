const { spawn, execSync } = require('child_process');
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
    try {
        execSync(process.env.TROUPE + '/bin/troupec ' + process.argv[2]);
        readWriteSync('./out/out.js');
        res.sendFile(__dirname + '/out/out.js');
    } catch(error) {
        console.log(process.env.TROUPE);
        let m = error.message.split("\n")
        m.shift()
        res.status(400).send("Troupe compilation failed:\n" + m.join("\n"));

        //console.dir(e);
        console.log("Server still running")

    }
});


app.listen(port, () => {
    console.log(`API Server listening on port ${port}!`)
});
