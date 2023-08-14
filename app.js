const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const { getArticleById } = require("./controllers/article-controller");
const { getApiDocumentation } = require("./controllers/api-controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api", getApiDocumentation);

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    response.status(500).send({ msg: "500 error" });
  }
});

module.exports = app;
