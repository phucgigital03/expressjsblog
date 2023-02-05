const express = require('express');
const siteRouter = express.Router();

const siteController = require('../app/controller/siteController');

siteRouter.get('/css/app.css', siteController.css);
siteRouter.get('/search', siteController.search);
siteRouter.get('/', siteController.home);

module.exports = siteRouter;