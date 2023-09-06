const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  const baseArticleSql = `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id, comments.comment_id`;

  return db.query(baseArticleSql, [article_id]).then((result) => {
    const article = result.rows;
    return article[0];
  });
};

exports.allArticlesWithCommentCount = (
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  const columnHeadings = ["created_at", "comment_count", "votes"];

  //reject promises here to gaurd against SQL injection
  if (order !== "DESC" && order !== "ASC") {
    return Promise.reject({ status: 400, msg: "Order must be ASC or DESC" });
  }
  if (!columnHeadings.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: `Sort column does not exist` });
  }
  const queryValues = [];

  let queryCommentCountSql = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryCommentCountSql += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  if (sort_by && order) {
    queryCommentCountSql += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;
  }

  return db.query(queryCommentCountSql, queryValues).then(({ rows }) => {
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

exports.checkCommentExists = (comment_id) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE comment_id = $1`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(
      `SELECT * FROM topics
    WHERE slug = $1`,
      [topic]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.addArticleComment = (article_id, requestBody) => {
  return db
    .query(
      `INSERT INTO comments
  (article_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *;`,
      [article_id, requestBody.username, requestBody.body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $2
      WHERE article_id = $1
      RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `
  DELETE from comments WHERE comment_id = $1`,
      [comment_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.createArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `INSERT INTO articles
    (author, title, body, topic, article_img_url )
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
