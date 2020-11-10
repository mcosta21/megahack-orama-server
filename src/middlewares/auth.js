import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization) {
    return res.status(401).json({ error: 'Token not found' });
  }

  const [bearer, token] = authorization.split(' ');

  if(bearer !== 'Bearer') {
    return res.statu(401).json({ error: 'Token does not match Bearer' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    next();
  } catch(err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
}