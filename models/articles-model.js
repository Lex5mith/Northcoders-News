const db = require("../db/connection");
const data = require("../db/data/test-data");

const allArticles = () => {
  let baseSqlString = `SELECT articles.articles.artice_id, title, 
  FROM articles
  JOIN on comments.article_id = articles.article_id`;
  return db.query(baseSqlString).then(({ rows }) => {
    //   console.log(rows);
    return rows;
  });
};

module.exports = allTopics;