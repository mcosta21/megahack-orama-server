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
      email: Yup.string().email('E-mail inválido').required('E-mail não informado.'),
      password: Yup.string().required('Senha não informada.')
      .min(6, 'Senha deve conter no mínimo 6 caracteres.'),
    });
    
    const values = { email, password };

    if(!(await schema.isValid(values))) {
      const validation = await schema.validate(values, { abortEarly: false })
      .catch(err => {
        const errors = err.errors.map(message => {
          return { "message": message } 
        });
        return errors;
      }); 

      return res.status(203).json(validation);
    }

    // get user
    const [ user ] = await connection('user').where('email', email).select('*');

    if(user === undefined) {
      return res.status(203).json({ message: 'Usuário não encontrado.' });
    }

    // check password
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if(!passwordMatch) {
      return res.status(203).json({ message: 'Senha incorreta.' });
    }

    // generate token
    const { id } = user;  

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.status(201).json(AuthView.render(user, token));
  }
}

export default AuthController;