'use strict';

const router = require('express').Router();
const DetectorService = require('./detector.service');
const DetectorController = require('./detector.controller');
const Image = Parse.Object.extend('Image');

const initRouter = (controller) => {
    router.post('/process-image', controller.processImage.bind(controller));
    router.get('/images', controller.getImages.bind(controller));
    return router;
}

module.exports = initRouter(
    new DetectorController(new DetectorService(Image))
)