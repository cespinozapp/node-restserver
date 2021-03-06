const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathimg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (!fs.existsSync(pathimg)) {
        let pathimg = path.resolve(__dirname, '../assets/no-image.jpg')
    }

    res.sendFile(pathimg);

})

module.exports = app;