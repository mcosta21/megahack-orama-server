export default {
  render(id, name) {
    return {
      id,
      name,
    }
  },

  renderMany(categories) {
    return categories.map(category => this.render(category.id, category.name));
  }
}