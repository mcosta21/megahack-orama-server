export default {
  render(user, token) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      yieldReceived: user.yieldReceived,
      token,
    }
  },
}