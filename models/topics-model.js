const db = require("../db/connection");
const data = require("../db/data/test-data");

const allTopics = (sort_by = "slug") => {
  const topicObjects = ["slug", "description"];
  const queryValues = [];

  let baseSqlString = `SELECT * FROM topics`;

  if (!topicObjects.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return db.query(baseSqlString).then(({ rows }) => {
      //   console.log(rows);
      return rows;
    });
  }
};

module.exports = allTopics;
