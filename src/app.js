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
        cb(null,`${file.fieldname}.${file.mimetype.split('/')[1]}`);
    }
});

app.use(express.json());
app.use(express.urlencoded());
app.use(multer({storage}).single('picture'));

app.use(detectorRoutes);

module.exports = app;