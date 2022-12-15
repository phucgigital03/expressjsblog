const express = require('express');
const siteRouter = express.Router();

const siteController = require('../app/controller/siteController');

siteRouter.get('/search', siteController.search);
siteRouter.get('/', siteController.home);

module.exports = siteRouter;