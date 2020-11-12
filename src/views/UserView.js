export default {
  render(user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      yieldReceived: user.yieldReceived,
    }
  },

  renderMany(users) {
    return users.map(user => this.render(user));
  }
}