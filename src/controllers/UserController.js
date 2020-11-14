import connection from '../database/connection';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

import UserView from '../views/UserView';

class UserController {

	static show = async (req, res) => {
		const { id } = req.params;

		// validate params
		const schema = Yup.object().shape({
			id: Yup.number().required().integer('Usuário inválido.'),
		});

		const values = { id };

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

		// get user from database
		const [ user ] = await connection('user').where('id', id).select('*');

		if(user === undefined) {
			return res.status(203).json({ message: 'Usuário não encontrado.' });
		}

		return res.status(200).json(UserView.render(user));
	}

	static index = async (req, res) => {
		const users = await connection('user').select('*');
		return res.json(UserView.renderMany(users));
	}

	static create = async (req, res) => {
		const { 
			firstName, 
			lastName, 
			email, 
			password,
			passwordConfirmation,
			admin,
		} = req.body;
		
		// validate received data
		const schema = Yup.object().shape({
			firstName: Yup.string().required('Nome inválido.'),
			lastName: Yup.string().required('Sobrenome inválido.'),
			email: Yup.string().email('E-mail inválido.').required('E-mail não informado.'),
			password: Yup.string().required('Senha inválida.').min(6),
			passwordConfirmation: Yup.string().required('Senha inválida.').oneOf([Yup.ref('password')]),
			admin: Yup.boolean(),
		});

		const values = { 
			firstName,
			lastName,
			email,
			password,
			passwordConfirmation,
			yieldReceived: 0,
			admin,
    };

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

		// check if user exists
		const [ user ] = await connection('user').where('email', email).select('id');

		if(user !== undefined) {
			return res.status(203).json({ message: 'Usuário já existe.' });
		}

		// hash password
		const passwordHash = bcrypt.hashSync(password, 8);

		// create user
		const newUser = {
			firstName,
			lastName,
			email,
			password: passwordHash,
			yieldReceived: 0,
			admin: admin? true : false,
		};

		const trx = await connection.transaction();

		const [ id ] = await trx('user').insert(newUser);

		await trx.commit();

		const data = {
			id,
			...newUser,
		}

		return res.status(201).json(UserView.render(data));
	}

	static update = async (req, res) => {
		const { 
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			newYieldReceived,
		} = req.body;
		const id = req.userId;

		// validate
		const schema = Yup.object().shape({
			id: Yup.number().required().integer('Usuário inválido.'),
			newFirstName: Yup.string('Nome inválido.'),
			newLastName: Yup.string('Sobrenome inválido.'),
			newEmail: Yup.string().email('E-mail inválido.'),
			newPassword: Yup.string().min(6),
			newYieldReceived: Yup.number('Valor de rendimento inválido.'),
		});

		const values = { 
			id,
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			newYieldReceived,
    };

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

		let user;

		const trx = await connection.transaction();

		// check what needs to be changed and update
		if(newFirstName !== undefined) {
			user = await trx('user').update('firstName', newFirstName).where('id', id);
		}
		if(newLastName !== undefined) {
			user = await trx('user').update('lastName', newLastName).where('id', id);
		}
		if(newEmail !== undefined) {
			user = await trx('user').update('email', newEmail).where('id', id);
		}
		if(newPassword !== undefined) {
			const passwordHash = bcrypt.hashSync(newPassword, 8); 

			user = await trx('user').update('password', passwordHash).where('id', id);
		}

		if(newYieldReceived !== undefined) {
			user = await trx('user').update('yieldReceived', newYieldReceived).where('id', id);
		}

		[ user ] = await trx('user').where('id', id).select('*');

		await trx.commit();
		
		return res.status(200).json(UserView.render(user));
	}

	static destroy = async (req, res) => {
		const id = req.userId;

		// validate user
		const schema = Yup.object().shape({
			id: Yup.number().required().integer('Usuário inválido.'),
		});

		const values = { id };

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

		const trx = await connection.transaction();

		// delete user
		await trx('user').where('id', id).del();

		await trx.commit();

    return res.status(202).json({ message: 'Usuário removido' });
	}
}

export default UserController;