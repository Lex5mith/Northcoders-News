const db = require("../db/connection");
const data = require("../db/data/test-data");

const allTopics = () => {
  let baseSqlString = `SELECT * FROM topics`;
  return db.query(baseSqlString).then(({ rows }) => {
    return rows;
  });
};

module.exports = allTopics;
