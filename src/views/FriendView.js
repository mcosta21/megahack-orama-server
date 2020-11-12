import connection from '../database/connection';

export default {
  async render(friend) {
    const friendOne = await connection('user').where('id', friend.friendOneId)
      .select('*');
    const friendTwo = await connection('user').where('id', friend.friendTwoId)
      .select('*');

    return {
      friendOne: {
        id: friendOne[0].id,
        firstName: friendOne[0].firstName,
        lastName: friendOne[0].lastName,
      },
      friendTwo: {
        id: friendTwo[0].id,
        firstName: friendTwo[0].firstName,
        lastName: friendTwo[0].lastName,
      },
    }
  },

  renderMany(friends) {
    return friends.map(friend => this.render(friend));
  }
}