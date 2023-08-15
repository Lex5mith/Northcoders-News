const { fetchArticleById } = require("../models/article-model");

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticleById(article_id)
    .then((article) => {
      if (article) {
        return response.status(200).send({ article });
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getArticleById };
