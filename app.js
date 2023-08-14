const express = require("express");
const { getTopics } = require("./controllers/topics-controller");
const { getApiDocumentation } = require("./controllers/api-controller")

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApiDocumentation);

app.use((error, request, response, next) => {
  console.log (error,'<<<error')
  response.status(500).send({ msg: "500 error" });
});

module.exports = app;