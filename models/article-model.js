const db = require("../db/connection");

const fetchArticleById = (article_id) => {
  const baseArticleSql = `SELECT *
    FROM articles
    WHERE article_id = $1`;

  return db.query(baseArticleSql, [article_id]).then((result) => {
    const article = result.rows;

    if (!article.length) {
      return Promise.reject({
        status: 404,
        msg: `Article ${article_id} does not exist`,
      });
    }

    return article[0];
  });
};

module.exports = { fetchArticleById };
