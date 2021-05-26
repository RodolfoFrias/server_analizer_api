'use strict';

module.exports = class {
    constructor(detectorService){
        this.detectorService = detectorService
    }

    async processImage(req, res, next){
        try {
            console.log(req.file)
            let responseObj, filePath;
            if(!req.file){
               throw new Error('Upload an image');
            }
            console.log('ok')
            Promise.all([
                { responseObj, filePath } = await this.detectorService.analizeImage(req.file),
                await this.detectorService.deleteImage(filePath)
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

    async deleteImage(req, res, next){
        try {
            console.log('REQUEST: ', req.query);
            await this.service.deleteImageFromDb(req);
            res.status(200).json({
                message: 'Image deleted!'
            });
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