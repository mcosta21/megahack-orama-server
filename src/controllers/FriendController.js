import connection from '../database/connection';
import * as Yup from 'yup';

import FriendView from '../views/FriendView';

class FriendController {
  static index = async (req, res) => {
    const { id } = req.params;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id }))) {
      return res.status(204).json();
    }

    const friends = await connection('friend').select('*').where('friendOneId', id)
      .orWhere('friendTwoId', id);

    return res.status(200).json(await Promise.all(FriendView.renderMany(friends)));
  }

  static create = async (req, res) => {
    const { id, friendId } = req.body;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
      friendId: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id, friendId }))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    // check if friendship already exists
    const friendship = await connection('friend').where({ 
      friendOneId: id,
      friendTwoId: friendId,
    }).orWhere({
      friendOneId: friendId,
      friendTwoId: id,
    }).select('*');

    if(friendship[0] !== undefined) {
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
    const { id, friendId } = req.body;

    // validate
    const schema = Yup.object().shape({
      id: Yup.number().required().integer(),
      friendId: Yup.number().required().integer(),
    });

    if(!(await schema.isValid({ id, friendId }))) {
      return res.status(204).json();
    }

    const friends = await connection('friend').select('*').where({
      friendOneId: id,
      friendTwoId: friendId,
    }).orWhere({
      friendOneId: friendId,
      friendTwoId: id,
    });

    if(friends[0] === undefined) {
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