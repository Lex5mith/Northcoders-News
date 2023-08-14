const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const {
  handle400s,
  handleCustomErrors,
} = require("./controllers/error-controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use(handle400s);

app.use(handleCustomErrors);

app.use((error, request, response, next) => {
  response.status(500).send({ msg: "500 error" });
});

module.exports = app;
