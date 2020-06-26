const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

let app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const usuario = require('../models/usuario');
const { db } = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'Ningun archivo fue subido.'
            });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(500).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            },
            tipo
        })
    }

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'JPG', 'PNG', 'GIF'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(500).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            },
            extension
        })
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`./uploads/${ tipo }/${ nombreArchivo }`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })


        // Aqui la imagen esta cargada
        if (tipo === 'usuarios')
            ImagenUsuario(id, res, nombreArchivo);
        else
            ImagenProducto(id, res, nombreArchivo);

    });
});

function ImagenUsuario(id, res, nombreArchivo) {

    let tipo = 'usuarios';

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borrarArchivo(nombreArchivo, tipo);

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {

            borrarArchivo(nombreArchivo, tipo);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })

        }

        borrarArchivo(usuarioDB.img, tipo);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                archivo: nombreArchivo
            });

        });

    });
}

function ImagenProducto(id, res, nombreArchivo) {

    let tipo = 'productos';

    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borrarArchivo(nombreArchivo, tipo);

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {

            borrarArchivo(nombreArchivo, tipo);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })

        }

        borrarArchivo(productoDB.img, tipo);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                usuario: productoGuardado,
                archivo: nombreArchivo
            });

        });

    });

}

function borrarArchivo(nombreArchivo, tipo) {

    let pathurl = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);

    if (fs.existsSync(pathurl)) {
        fs.unlinkSync(pathurl);
    }

}

module.exports = app;