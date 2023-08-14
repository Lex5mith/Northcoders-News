const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const { getArticleId } = require("./controllers/article-controller")

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId)

app.use((error, request, response, next) => {
  response.status(500).send({ msg: "500 error" });
});

module.exports = app;
