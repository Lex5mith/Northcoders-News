const { request, response } = require("express");
const { allArticlesWithCommentCount } = require("../models/article-model");
const { fetchArticleById } = require("../models/article-model");
const { allCommentsForArticle } = require("../models/article-model");

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticleById(article_id)
    .then((article) => {
      if (article) {
        return response.status(200).send({ article });
      }
    })
    .catch((error) => {
      next(error);
    });
};

const getAllArticles = (request, response, next) => {
  allArticlesWithCommentCount()
    .then((articles) => {
      // console.log("controller", articles);
      return response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

const getAllCommentsByArticleId =(request, response, next) => {
 const  { article_id } = request.params
  allCommentsForArticle(article_id)
  .then((comments) => {
    return response.status(200).send({ comments })
  })
  .catch((error) => {
    next(error)
  })
}

module.exports = { getArticleById, getAllArticles, getAllCommentsByArticleId };
