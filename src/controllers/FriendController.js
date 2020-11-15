import connection from '../database/connection';
import * as Yup from 'yup';

import FriendView from '../views/FriendView';

class FriendController {
  static index = async (req, res) => {
    const id = req.userId;

    // validate
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

    // get friends
    const friends = await connection('friend').select('*').where('friendOneId', id)
      .orWhere('friendTwoId', id);

    return res.status(200).json(await Promise.all(FriendView.renderMany(friends, id)));
  }

  static create = async (req, res) => {
    const { friendId } = req.body;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer('Usuário inválido.'),
      friendId: Yup.number().required().integer('Amigo inválido.'),
    });

    const values = { id, friendId };

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

    // check if the user id is different from the friend id
    if(id === friendId) {
      return res.status(203).json({ message: 'Você não pode ser seu amigo.' });
    }

    // check if friend exists
    const [ user ] = await connection('user').where('id', friendId).select('id');

    if(!user) {
      return res.status(203).json({ message: 'Usuário não informado.' });
    }

    // check if friendship already exists
    const [ friendship ] = await connection('friend').where({ 
      friendOneId: id,
      friendTwoId: friendId,
    }).orWhere({
      friendOneId: friendId,
      friendTwoId: id,
    }).select('*');

    if(friendship !== undefined) {
      return res.status(204).json();
    }

    const trx = await connection.transaction();

    // create friendship
    const newFriendship = {
      friendOneId: id,
      friendTwoId: friendId,
    }

    await trx('friend').insert(newFriendship);

    await trx.commit();

    return res.status(201).json({ message: 'Amizade criada.' });
  }

  static destroy = async (req, res) => {
    const { friendId } = req.params;
    const id = req.userId;
    
    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer('Usuário inválido.'),
      friendId: Yup.number().required().integer('Amigo inválido.'),
    });

    const values = { id, friendId };

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

    // delete friend
    await trx('friend').where({
      friendOneId: id,
      friendTwoId: friendId,
    }).orWhere({
      friendOneId: friendId,
      friendTwoId: id,
    }).del();

    await trx.commit();

    return res.status(202).json({ message: 'Amigo removido.' });
  }

  static unknownUsers = async (req, res) => {
    const id = req.userId;

    // validate
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

    // get friends
    const friends = await connection('friend').select('*').where('friendOneId', id)
      .orWhere('friendTwoId', id);

    const users = await connection('user').select('user.id', 'user.firstName', 'user.lastName').whereNot('id', id);
    
    if(friends.length === 0){
      return res.status(200).json(users);
      console.log('every')
    }

    console.log('check')
    const unknownUsers = users.filter(user => {
      let unknown = false;

      const teste = friends.map(friend => {
        if(friend.friendOneId != user.id && friend.friendTwoId !== user.id){
          return { firstName: user.firstName, friend: true}
        }
        else {
          return { firstName: user.firstName, friend: false }
        }
      });

    });

    return res.status(200).json(unknownUsers);
  }
}

export default FriendController;