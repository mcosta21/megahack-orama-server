import connection from '../database/connection';

export default {
  async render(friend) {
    const friendOne = await connection('user').where('id', friend.friendOneId)
      .select('firstName');
    const friendTwo = await connection('user').where('id', friend.friendTwoId)
      .select('firstName');

    return {
      friendOne: friendOne[0].firstName,
      friendTwo: friendTwo[0].firstName,
    }
  },

  renderMany(friends) {
    return friends.map(friend => this.render(friend));
  }
}