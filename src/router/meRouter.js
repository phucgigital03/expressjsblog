const express = require('express');
const meRouter = express.Router();

const meController = require('../app/controller/meController');

meRouter.get('/mycourses', meController.mycourses);
meRouter.get('/trashCourses', meController.trashCourses);

module.exports = meRouter;