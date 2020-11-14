import connection from '../database/connection';

export default {
  async render(friend, userId) {
    let userFriend;

    if(userId === friend.friendTwoId) {
      [ userFriend ] = await connection('user').where('id', friend.friendOneId);
    }

    else {
      [ userFriend ] = await connection('user').where('id', friend.friendTwoId);
    } 

    return {
      id: userFriend.id,
      firstName: userFriend.firstName,
      lastName: userFriend.lastName,
    }
  },

  renderMany(friends, userId) {
    return friends.map(friend => this.render(friend, userId));
  }
}