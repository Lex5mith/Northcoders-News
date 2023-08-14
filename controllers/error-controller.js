const handle400s = (error, request, response, next) => {
  if (error.code === "23502") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
};

const handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

module.exports = { handle400s, handleCustomErrors };
