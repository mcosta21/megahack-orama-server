export default {
  render(investment) {
    return {
      serie: {
        id: investment.serieId,
        title: investment.serieTitle,
      },
      id: investment.id,
      startDate: new Date(investment.startDate),
      expirationDate: new Date(investment.expirationDate),
      private: investment.private,
    }
  },

  renderMany(investments) {
    return investments.map(investment => this.render(investment));
  }
}