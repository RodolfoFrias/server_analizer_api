'use strict';

const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const detectorRoutes = require('./detector/detector.router');

const storage = multer.diskStorage({
    destination:function (req,file,cb){//Indica la carpeta de destino
        cb(null,path.join(__dirname,'/images'));
    },
    filename:function(req,file,cb){//Indica el nombre del archivo
        console.log('Imag received - ', file);
        cb(null,`${file.fieldname}.${file.mimetype.split('/')[1]}`);
    }
});

//Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, responseType');  
    next();
});

app.use(express.json());
app.use(express.urlencoded());
app.use(multer({storage}).single('picture'));

app.use(detectorRoutes);

module.exports = app;