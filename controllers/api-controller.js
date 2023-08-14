const { request, response } = require("express");
const fs = require("fs/promises");
const db = require("../db/connection");

const getApiDocumentation = (request, response, next) => {
  fs.readFile("endpoints.json", "utf-8")
    .then((data) => {
      const parsedDocumentation = JSON.parse(data);
    //   console.log(parsedDocumentation);
      return response.status(200).send(parsedDocumentation);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getApiDocumentation };
