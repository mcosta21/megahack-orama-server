const connection = require('../database/connection');

module.exports = {

    async show(request, response) {
        const { id } = request.params;
        const user = await connection('user')
                            .where('id', id)
                            .select('*');
        return response.json(user);
    },

    async index(request, response) {
        const users = await connection('user').select('*');
        return response.json(users);
    },

    async create(request, response) {
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

