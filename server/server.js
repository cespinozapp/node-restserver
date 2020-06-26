require('./config/config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//console.log(path.resolve(__dirname, '../public'));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos Online');

    });


app.listen(process.env.PORT, () => {
    console.log(`Escuchando en puerto ${ process.env.PORT }`);
})