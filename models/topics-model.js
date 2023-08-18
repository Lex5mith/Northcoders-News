const db = require("../db/connection");
const data = require("../db/data/test-data");

const allTopics = () => {
  let baseSqlString = `SELECT * FROM topics`;
  return db.query(baseSqlString).then(({ rows }) => {
    return rows;
  });
};

// const createTopic = (author, title, body, topic, article_img_url) => {
//   return db
//     .query(
//       `INSERT INTO articles
//     (author, title, body, topic, article_img_url )
//     VALUES
//     ($1, $2, $3, $4, $5)
//     RETURNING *;`,
//       [author, title, body, topic, article_img_url]
//     )
//     .then(({ rows }) => {
//       return rows[0];
//     });
// };

module.exports = allTopics;
