const { request, response } = require("express");
const {allUserData, returnUser} = require("../models/users-model");


const getAllUsers = (request, response, next) => {
  allUserData()
  .then((users) => {
    return response.status(200).send({users})
  })
  .catch((error) => {
    next(error)
  })
}

// const getUserByUsername = (request, response, next) => {
//   returnUser()
//   .then((user) => {
//     return response.status(200).send({user})
//   })
//   .catch((error) => {
//     next(error)
//   })
// }

module.exports = {
    getAllUsers, 
    //getUserByUsername,
}