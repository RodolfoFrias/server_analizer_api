'use strict';

const path = require('path');
const fs = require('fs/promises');
const PythonShell = require('python-shell').PythonShell;
module.exports = class {

    constructor(imageClass){
        this.imageClass = imageClass;
    }

    analizeImage(file){
        return new Promise(async (resolve, reject) => {
            const responseObj = {};
            const filePath = path.join(__dirname, '..', '/images/'+file.filename);
            const pythonFilePath = path.join(__dirname, '..', '/util/detection.py');
            console.log('Path: ', pythonFilePath);
            const options = {
                args: [filePath]
            };
    
            PythonShell.run(pythonFilePath, options, async (err, results) => {
              if (err) reject(err);
              // results is an array consisting of messages collected during execution 
              console.log('results: %j', results);
              await this.saveImage(file, results, filePath);
              responseObj.response = 'Image analized!';

              resolve({responseObj, filePath });
            });
        })
    }

    async deleteImage(filePath){
        await fs.unlink(filePath);
        console.log(`File from ${filePath} removed`);
    }

    async saveImage(file, results, filePath){
        const newimage = new this.imageClass();
        const image = await fs.readFile(filePath);
        const dataBase64 = image.toString('base64');
        const parseFile = new Parse.File(file.originalname, { base64: dataBase64 }, file.mimetype);
        newimage.set('file', parseFile);
        newimage.set('description', results);
        return newimage.save();
    }

    async getImages(){
        const query = new Parse.Query(this.imageClass);
        return query.findAll();
    }

    async deleteImageFromDb(requestObject){
        const { imageid } = requestObject.query;
        const query = new Parse.Query(this.imageClass);
        query.equalTo('objectId', imageid);
        const image = await query.first();
        return image.destroy(null, {useMasterKey: true});
    }

}
