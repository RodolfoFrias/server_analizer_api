'use strict';

const express = require('express');

const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');

const app = express();
const multer = require('multer');
const path = require('path');
const detectorRoutes = require('./detector/detector.router');
const dotenv = require('dotenv');

const storage = multer.diskStorage({
    destination:function (req,file,cb){//Indica la carpeta de destino
        cb(null,path.join(__dirname,'/images'));
    },
    filename:function(req,file,cb){//Indica el nombre del archivo
        console.log('Imag received - ', file);
        cb(null,`${file.fieldname}.${file.mimetype.split('/')[1]}`);
    }
});

let databaseUri = 'mongodb://localhost:27017/analizer';
let appId = 'myAppId';
let masterKey = 'myMasterKey';
let serveURL = 'http://localhost:3000/parse';
let appName = 'server-analizer';
let user = 'admin';
let pass = 'cliente';

if(process.env.ENV === 'production'){
  console.log('Mode production ON');
  databaseUri = process.env.MONGODB_URI;
  appId = process.env.APP_ID;
  masterKey = process.env.MASTER_KEY;
  serveURL = process.env.SERVER_URL;
  appName = process.env.APP_NAME;
  user = process.env.USERNAME;
  pass = process.env.PASSWORD;
}

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: appId,
  masterKey: masterKey, //Add your master key here. Keep it secret!
  serverURL: serveURL,  // Don't forget to change to https if needed
  // liveQuery: {
  //   classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  // }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey
const trustProxy = true;
const dashboard = new ParseDashboard({
  "apps":[
    {
      "serverURL": serveURL,
      "appId": appId,
      "masterKey": masterKey,
      "appName": appName
    }
  ],
  "users":[
    {
      "user": user,
      "pass": pass
    }
  ]
}, { 
  allowInsecureHTTP: true,
  trustProxy: 1
 });


app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

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