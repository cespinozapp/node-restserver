const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {

    //taer todos los productos
    //populate: usuario y categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    let condicion = { disponible: true };

    Producto.find(condicion, 'nombre precioUni descripcion disponible categoria usuario')
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments(condicion, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            });

        });

});

// Obtener un producto
app.get('/productos/:id', verificaToken, (req, res) => {

    //populate: usuario y categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

// Obtener un producto
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    //populate: usuario y categoria

    let termino = req.params.termino;

    let regex = RegExp(termino, 'i', );

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos
            });

        });

});


// Crear un producto
app.post('/productos', verificaToken, (req, res) => {

    //grabar un usuario
    //grabar una categoria

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: body.usuario
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

// Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });

    //grabar un usuario y categoria
    //grabar una categoria

});

// Eliminar un producto
app.delete('/productos/:id', verificaToken, (req, res) => {

    //disponible pasa a false

    let id = req.params.id;

    let disponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, disponible, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });

});

module.exports = app;