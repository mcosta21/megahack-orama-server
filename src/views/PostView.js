export default {
  render(data) {
    return {
      post: {
        id:  data.postId,
        datePost: new Date(data.datePost),
        title: data.title,
        description: data.description,
      },
      investment: {
        id: data.investmentId,
        startDate: new Date(data.startDate),
        expirationDate: new Date(data.expirationDate),
        serieId: data.serieId,
      },
    }
  }
}