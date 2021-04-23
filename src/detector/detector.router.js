'use strict';

const router = require('express').Router();
const DetectorService = require('./detector.service');
const DetectorController = require('./detector.controller');


const initRouter = (controller) => {
    router.post('/process-image', controller.processImage.bind(controller));
    return router;
}

module.exports = initRouter(
    new DetectorController(new DetectorService())
)