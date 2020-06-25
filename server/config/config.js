// ===================
// Puerto
// ===================

process.env.PORT = process.env.PORT || 8080;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Vencimiento del Token
// 60 * 60 * 24 * 30
process.env.CADUCIDAD = 60 * 60 * 24 * 30

// SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


// Base de Datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;