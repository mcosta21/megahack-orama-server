import { Router } from 'express';

import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';
import CategoryController from './controllers/CategoryController';
import SerieController from './controllers/SerieController';
import FriendController from './controllers/FriendController';

import authMiddleware from './middlewares/auth';

const routes = Router();

// user
routes.get('/users/:id', UserController.show);
routes.get('/users', UserController.index);
routes.post('/users', UserController.create);

// auth
routes.post('/auth', AuthController.store);

// everything bellow it needs a validation token to work
routes.use(authMiddleware);

// category
routes.get('/categories/:id', CategoryController.show);
routes.get('/categories', CategoryController.index);
routes.post('/categories', CategoryController.create);
routes.put('/categories', CategoryController.update);
routes.delete('/categories/:id', CategoryController.destroy);

// serie
routes.get('/series/:id', SerieController.show);
routes.get('/series', SerieController.index);
routes.post('/series', SerieController.create);
routes.put('/series', SerieController.update);
routes.delete('/series/:id', SerieController.destroy);

// friend
routes.get('/friends/:id', FriendController.index);
routes.post('/friends', FriendController.create);
routes.delete('/friends', FriendController.destroy);

export default routes;