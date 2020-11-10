import connection from '../database/connection';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

import UserView from '../views/UserView';

class UserController {

	static show = async (req, res) => {
		const { id } = req.params;

		// validate params
		const schema = Yup.object().shape({
			id: Yup.number().required().integer(),
		});

		if(!(await schema.isValid({ id }))) {
			return res.status(400).json({ error: 'Id not valid' });
		}

		// get user from database
		const user = await connection('user')
												.where('id', id)
												.select('*');
		if(user[0] === undefined) {
			return res.status(400).json({ error: 'User not found' });
		}
		return res.status(200).json(UserView.render(user[0]));
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
			yieldReceived
		} = req.body;
		
		// validate received data
		const schema = Yup.object().shape({
			firstName: Yup.string().required(),
			lastName: Yup.string().required(),
			email: Yup.string().email().required(),
			password: Yup.string().required().min(6),
			passwordConfirmation: Yup.string().required().oneOf([Yup.ref('password')]),
			yieldReceived: Yup.number().required(),
		});

		if(!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation failed' });
		}

		// check if user exists
		const user = await connection('user').where('email', email).select('*');
		console.log(user);
		if(user[0] !== undefined) {
			return res.status(400).json({ error: 'User already exists' });
		}

		// hash password
		const passwordHash = bcrypt.hashSync(password, 8);

		// create user
		const newUser = {
			firstName,
			lastName,
			email,
			password: passwordHash,
			yieldReceived,
		};
		
		const [ id ] = await connection('user').insert(newUser);

		return res.json(UserView.render(newUser));
	}
}

export default UserController;