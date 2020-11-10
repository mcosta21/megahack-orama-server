import connection from '../database/connection';

class UserController {

    static show = async (request, response) => {
        const { id } = request.params;
        const user = await connection('user')
                            .where('id', id)
                            .select('*');
        return response.json(user);
    }

    static index = async (request, response) => {
        const users = await connection('user').select('*');
        return response.json(users);
    }

    static create = async (request, response) => {
        const { firstName, lastName, email, yieldReceived } = request.body;
        const data = {
            firstName,
            lastName,
            email,
            yieldReceived
        }
        const [ id ] = await connection('user').insert(data);
        return response.json({ id, ...data });
    }

}

export default UserController;