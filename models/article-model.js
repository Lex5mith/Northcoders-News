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

exports.allCommentsForArticle = (article_id) => {
  let query = `SELECT * 
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`;
  return db.query(query, [article_id]).then((result) => {
    const comments = result.rows;
    return comments;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.addArticleComment = (article_id, requestBody) => {
  return db.query(
  `INSERT INTO comments
  (article_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *;`,[article_id, requestBody.username, requestBody.body])
  .then(({rows}) => {
    return rows[0]
  })
}

exports.updateArticleById = (article_id, inc_votes) => {
  console.log(article_id, "<<<<article id in model")
  console.log(inc_votes, "<<<<newVote in model")
  return db.query(
      `
      UPDATE articles
      SET votes = '${inc_votes}'
      WHERE article_id = '${article_id}'
      RETURNING *;`
    )
    .then(({ rows }) => {
      return rows
    })
}