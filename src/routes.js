const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');

routes.get('/users/:id', UserController.show);
routes.get('/users', UserController.index);
routes.post('/users', UserController.create);

module.exports = routes;