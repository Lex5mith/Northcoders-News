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
  checkTopicExists,
  createArticle,
} = require("../models/article-model");

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [
    fetchArticleById(article_id),
    checkArticleExists(article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const article = resolvedPromises[0];
      return response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

const getAllArticles = (request, response, next) => {
  const { topic, sort_by, order } = request.query;
  const promises = [allArticlesWithCommentCount(topic, sort_by, order)];

  if (topic) {
    promises.push(checkTopicExists(topic));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
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
  const { comment_id } = request.params;
  const promises = [checkCommentExists(comment_id), removeComment(comment_id)];

  Promise.all(promises)
    .then((resolvedPromises) => {
      return response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

const postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url = "" } = request.body;

  createArticle(author, title, body, topic, article_img_url)
    .then(async (newArticle) => {
      const completeArticle = await fetchArticleById(newArticle.article_id);
      return response.status(201).send({ newArticle: completeArticle });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
  postCommentToArticle,
  patchArticleById,
  deleteCommentByCommentId,
  postArticle,
};
