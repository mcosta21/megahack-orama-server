import connection from '../database/connection';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import authConfig from '../config/auth';
import AuthView from '../views/AuthView';

class AuthController {
  static store = async (req, res) => {
    const { 
      email,
      password,
    } = req.body;

    // validate
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if(!(await schema.isValid({ email, password }))) {
      return res.status(400).json({ error: 'Validation failed' })
    }

    const user = await connection('user').where('email', email).select('*');

    if(user[0] === undefined) {
      return res.status(400).json({ error: 'User not found' });
    }

    // check password
    const passwordMatch = bcrypt.compareSync(password, user[0].password);

    if(!passwordMatch) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // generate token
    const { id } = user[0].id;

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json(AuthView.render(user[0], token));
  }
}

export default AuthController;