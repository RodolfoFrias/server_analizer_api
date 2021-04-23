'use strict';

const util = require('util');
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs/promises');
const PythonShell = require('python-shell').PythonShell;

module.exports = class {


    analizeImage(file){
        return new Promise((resolve, reject) => {
            const responseObj = {};
            const filePath = path.join(__dirname, '..', '/images/'+file.filename);
            const pythonFilePath = path.join(__dirname, '..', '/util/detection.py');
            console.log('Path: ', pythonFilePath);
            const options = {
                args: [filePath]
            };
    
            PythonShell.run(pythonFilePath, options, async function (err, results) {
              if (err) reject(err);
              // results is an array consisting of messages collected during execution 
              console.log('results: %j', results);
              responseObj.foundObjects = results;
              resolve({responseObj, filePath});
            });
        })
    }

    async deleteImage(filePath){
        await fs.unlink(filePath);
        console.log(`File from ${filePath} removed`);
    }


}
