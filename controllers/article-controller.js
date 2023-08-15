const { request, response } = require("express");
const { allArticlesWithCommentCount } = require("../models/article-model");
const { fetchArticleById } = require("../models/article-model");

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
      return response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

const postCommentToArticle = (request, response, next) => {}

module.exports = { getArticleById, getAllArticles, postCommentToArticle };
