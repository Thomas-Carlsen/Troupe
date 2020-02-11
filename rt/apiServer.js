const { spawn } = require('child_process');
const { createLogger, format, transports } = require('winston');
const express =  require('express');
const app = express();
const port = 3000;

app.get('/serialize', (req, res) => {
    let compiler = spawn(process.env.TROUPE + '/bin/troupec', ['--json']);
    res.send(compiler);
});

app.get('/logger', (req, res) => {
    res.send({ createLogger, format, transports });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//module.exports = app;