const { request, response } = require("express");
const db = require("../db/connection");
const allTopics = require("../models/topics-model");

const getTopics = (request, response, next) => {
  allTopics()
    .then((topics) => {
      return response.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getTopics };
