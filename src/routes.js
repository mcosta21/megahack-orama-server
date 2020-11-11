import { Router } from 'express';

import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';

import authMiddleware from './middlewares/auth';

const routes = Router();

//user
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.create);

// auth
routes.post('/auth', AuthController.store);

// everything bellow it needs a validation token to work
routes.use(authMiddleware);

// testing if token works
routes.get('/test', (req, res) => {
  return res.status(200).json({ okay: true });
});

export default routes;