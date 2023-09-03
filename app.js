const express = require("express");
const cors = require("cors");
const { getTopics } = require("./controllers/topics-controller");
const { getApiDocumentation } = require("./controllers/api-controller");
const {
  getArticleById,
  patchArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
  postCommentToArticle,
  deleteCommentByCommentId,
  postArticle,
} = require("./controllers/article-controller");
const { getAllUsers } = require("./controllers/user-controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getApiDocumentation);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.post("/api/articles", postArticle);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/users", getAllUsers);

app.use((request, response) => {
  response.status(404).send({ msg: "Not found" });
});

app.use((error, request, response, next) => {
  // handle caught psql errors
  if (error.code === "23502" || error.code === "22P02") {
    return response.status(400).send({ msg: "Invalid id" });
  }
  if (error.code === "23503") {
    return response.status(404).send({ msg: "Id is not in table" });
  }
  if (error.code === "42703") {
    return response.status(400).send({ msg: `Sort column does not exist` });
  }
  // handle Promise.reject with custom err code / err msg
  if (error.status && error.msg) {
    return response.status(error.status).send({ msg: error.msg });
    // handle anything else going wrong
  } else {
    return response.status(500).send({ msg: "500 error" });
  }
});

module.exports = app;
