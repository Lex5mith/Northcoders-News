const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
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

exports.allArticlesWithCommentCount = () => {
  let queryCommentCountSql = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id 
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
  `;
  return db.query(queryCommentCountSql).then(({ rows }) => {
    
    return rows;
  });
};
