const express = require('express');
const router = express.Router();

const siteController = require('../app/controller/siteController');

router.get('/search', siteController.search);
router.get('/', siteController.home);

module.exports = router;