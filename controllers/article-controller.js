const { fetchArticleById } = require("../models/article-model");

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  if (/[A-Za-z]/g.test(article_id)) {
    return response
      .status(400)
      .send({ msg: "Invalid id, article Id must be a number" });
  }

  fetchArticleById(article_id)
    .then((article) => {
      if (article) {
        return response.status(200).send({ article });
      }
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} does not exist`,
        });
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getArticleById };
