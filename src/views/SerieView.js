import connection from '../database/connection';

export default {
  async render(serie) {
    const [ category ] = await connection('category').where('id', serie.categoryId).select('name');

    return {
      id: serie.id,
      cost: serie.cost,
      yield: serie.yield,
      duration: serie.duration,
      title: serie.title,
      description: serie.description,
      category: {
        id: serie.categoryId,
        name: category.name,
      }
    }
  },

  renderMany(series) {
    return series.map(serie => this.render(serie));
  }
}