const { request, response } = require("express");
const {allUserData} = require("../models/users-model");


const getAllUsers = (request, response, next) => {
  allUserData()
  .then((users) => {
    return response.status(200).send({users})
  })
  .catch((error) => {
    next(error)
  })
}

module.exports = {
    getAllUsers,
}