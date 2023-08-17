const { request, response } = require("express");
const {
  allArticlesWithCommentCount,
  addArticleComment,
  fetchArticleById,
  allCommentsForArticle,
  checkArticleExists,
  updateArticleById,
  removeComment,
  checkCommentExists,
} = require("../models/article-model");

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

const getAllCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [
    allCommentsForArticle(article_id),
    checkArticleExists(article_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      return response.status(200).send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
};

const postCommentToArticle = (request, response, next) => {
  const { article_id } = request.params;
  addArticleComment(article_id, request.body)
    .then((comment) => {
      return response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

const patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  const promises = [
    checkArticleExists(article_id),
    updateArticleById(article_id, inc_votes),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const article = resolvedPromises[1];
      return response.status(201).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

const deleteCommentByCommentId = (request, response, next) => {
  const {comment_id} = request.params
  const promises = [
    checkCommentExists(comment_id),
    removeComment(comment_id)
  ]

  Promise.all(promises)
  .then((resolvedPromises) => {
    return response.status(204).send()
  })
  .catch((error) => {
    next(error);
  });
}



module.exports = {
  getArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
  postCommentToArticle,
  patchArticleById,
  deleteCommentByCommentId, 
};
