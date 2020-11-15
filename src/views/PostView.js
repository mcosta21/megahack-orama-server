export default {
  render(post) {
    return {
      id: post.id,
      datePost: new Date(post.datePost),
      title: post.title,
      description: post.description,
      expirationDate: post.expirationDate,
    }
  }
}