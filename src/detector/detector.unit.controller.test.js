'use strict';

const DetectorController = require('./detector.controller');
const fs = require('fs');
const path = require('path');

describe('DetecttorController', () => {
    const mockFile = {
        fieldname: 'picture',
        originalname: 'WIN_20210422_22_16_55_Pro.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'D:\\Maestria\\tercero\\IA\\Proyecto Final\\server_api_ia\\src\\detector\\image_test',
        filename: 'image_test.jpg',
        path: 'D:\\Maestria\\tercero\\IA\\Proyecto Final\\server_api_ia\\src\\detector\\image_test\\image_test.jpg',
        size: 152072
    }

    let detectorController;
    const req = {
        file: mockFile
    };
    const next = jest.fn();

    const mockService = {
        analizeImage: jest.fn(),
        deleteImage: jest.fn(),
        saveImage: jest.fn(),
        getImages: jest.fn(),
        deleteImageFromDb: jest.fn()
    }

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    beforeAll(async () => {
        detectorController = new DetectorController(mockService);
    });

    describe('POST - process image', () => {
        const response = 'Image analized!';
        beforeAll(async () => {
            detectorController.detectorService.analizeImage.mockResolvedValue(response);
            await detectorController.processImage(req, res, next)
        });
        test('should return a success message and status 200', () => {
            expect(res.json).toBeCalledWith({ response });
            expect(res.status).toBe(200);
        });
    });

});