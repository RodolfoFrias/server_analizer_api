'use strict';

module.exports = class {
    constructor(detectorService){
        this.service = detectorService
    }

    async processImage(req, res, next){
        try {
            let responseObj, filePath;
            if(!req.file){
               throw new Error('Upload an image');
            }
            Promise.all([
                { responseObj, filePath } = await this.service.analizeImage(req.file),
                await this.service.deleteImage(filePath)
            ]);
            res.status(200).json(responseObj); 
        } catch (error) {
            console.log(error);
            if(!error.statusCode){
                error.statusCode = 500;
            }
            res.status(error.statusCode).json(
                {
                    message: 'Something went wrong', 
                    status: error.statusCode
                }
            );
        }
    }

    async getImages(req, res, next){
        try {
            const response = await this.service.getImages();
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            if(!error.statusCode){
                error.statusCode = 500;
            }
            res.status(error.statusCode).json(
                {
                    message: 'Something went wrong', 
                    status: error.statusCode
                }
            );
        }
    }

}