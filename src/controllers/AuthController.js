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
      email: Yup.string().email('E-mail inválido.').required('E-mail não informado.'),
      password: Yup.string().required('Senha deve conter no mínimo 6 caracteres.').min(6),
    });
    
    if(!(await schema.isValid({ email, password }))) {
      
      const validation = await schema.validate().then().catch(err => {
        const errors = [];
        err.errors.map(message => {
          errors.push( {"message": message} )
        });
        return errors;
      });

      return res.status(200).json(validation)
    }

    const [ user ] = await connection('user').where('email', email).select('*');

    if(user === undefined) {
      return res.status(400).json({ error: 'User not found' });
    }

    // check password
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if(!passwordMatch) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // generate token
    const { id } = user;  

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json(AuthView.render(user, token));
  }
}

export default AuthController;