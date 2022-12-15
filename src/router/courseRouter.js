const express = require('express');
const courseRouter = express.Router();

const courseController = require('../app/controller/courseController');

courseRouter.post('/handleActions', courseController.handleActions);
courseRouter.patch('/storeUpdate', courseController.storeUpdate);
courseRouter.get('/create', courseController.create);
courseRouter.post('/storeCreate', courseController.storeCreate);
courseRouter.get('/:id/update', courseController.update);
courseRouter.delete('/:id/sortDelete', courseController.sortDelete);
courseRouter.delete('/:id/destroy', courseController.destroy);
courseRouter.patch('/:id/restore', courseController.restore);
courseRouter.get('/:slug', courseController.show);

module.exports = courseRouter;