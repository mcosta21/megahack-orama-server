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
		const [ user ] = await connection('user').where('id', id).select('*');

		if(user === undefined) {
			return res.status(400).json({ error: 'User not found' });
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
			yieldReceived,
			admin,
		} = req.body;
		
		// validate received data
		const schema = Yup.object().shape({
			firstName: Yup.string().required(),
			lastName: Yup.string().required(),
			email: Yup.string().email().required(),
			password: Yup.string().required().min(6),
			passwordConfirmation: Yup.string().required().oneOf([Yup.ref('password')]),
			yieldReceived: Yup.number().required(),
			admin: Yup.boolean(),
		});

		if(!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation failed' });
		}

		// check if user exists
		const [ user ] = await connection('user').where('email', email).select('id');

		if(user !== undefined) {
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
			admin: admin? true : false,
		};

		const [ id ] = await connection('user').insert(newUser);

		return res.json(UserView.render(newUser));
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
			id: Yup.number().required().integer(),
			newFirstName: Yup.string(),
			newLastName: Yup.string(),
			newEmail: Yup.string().email(),
			newPassword: Yup.string().min(6),
			newYieldReceived: Yup.number(),
		});

		if(!(await schema.isValid({ 
			id,
			newFirstName,
			newLastName,
			newEmail,
			newPassword,
			newYieldReceived,
		}))) {
			return res.status(400).json({ error: 'Validation failed' });
		}

		let user;

		// check what needs to be changed
		if(newFirstName !== undefined) {
			user = await connection('user').update('firstName', newFirstName).where('id', id);
		}
		if(newLastName !== undefined) {
			user = await connection('user').update('lastName', newLastName).where('id', id);
		}
		if(newEmail !== undefined) {
			user = await connection('user').update('email', newEmail).where('id', id);
		}
		if(newPassword !== undefined) {
			const passwordHash = bcrypt.hashSync(newPassword, 8); 

			user = await connection('user').update('password', passwordHash).where('id', id);
		}

		if(newYieldReceived !== undefined) {
			user = await connection('user').update('yieldReceived', newYieldReceived).where('id', id);
		}

		[ user ] = await connection('user').where('id', id).select('*');
		
		return res.status(200).json(UserView.render(user));

	}

	static destroy = async (req, res) => {
		const id = req.userId;

		// validate user
		const schema = Yup.object().shape({
			id: Yup.number().required().integer(),
		});

		if(!(await schema.isValid({ id }))) {
			return res.status(400).json({ error: 'Validation failed' });
		}

		// delete user
		await connection('user').where('id', id).del();

    return res.status(202).json({ success: true });
	}
}

export default UserController;