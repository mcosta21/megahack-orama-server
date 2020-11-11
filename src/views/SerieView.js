export default {
  render(serie) {
    return {
      id: serie.id,
      cost: serie.cost,
      yield: serie.yield,
      duration: serie.duration,
      title: serie.title,
      description: serie.description,
      categoryId: serie.categoryId,
    }
  },

  renderMany(series) {
    return series.map(serie => this.render(serie));
  }
}