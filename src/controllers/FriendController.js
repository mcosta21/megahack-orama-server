import connection from '../database/connection';
import * as Yup from 'yup';

import FriendView from '../views/FriendView';

class FriendController {
  static index = async (req, res) => {
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id }))) {
      return res.status(204).json();
    }

    const friends = await connection('friend').select('*').where('friendOneId', id)
      .orWhere('friendTwoId', id);

    return res.status(200).json(await Promise.all(FriendView.renderMany(friends, id)));
  }

  static create = async (req, res) => {
    const { friendId } = req.body;
    const id = req.userId;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
      friendId: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id, friendId }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    if(id === friendId) {
      return res.status(400).json({ error: 'You can not become friends with yourself' });
    }

    // check if friend exists
    const [ user ] = await connection('user').where('id', friendId).select('id');

    if(!user) {
      return res.status(400).json({ error: 'Friend does not exist' });
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

    // create friendship
    const newFriendship = {
      friendOneId: id,
      friendTwoId: friendId,
    }

    await connection('friend').insert(newFriendship);

    return res.status(201).json({ success: true });
  }

  static destroy = async (req, res) => {
    const { friendId } = req.params;
    const id = req.userId;
    
    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
      friendId: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id, friendId }))) {
      return res.status(204).json();
    }

    await connection('friend').where({
      friendOneId: id,
      friendTwoId: friendId,
    }).orWhere({
      friendOneId: friendId,
      friendTwoId: id,
    }).del();

    return res.status(202).json({ success: true });
  }
}

export default FriendController;