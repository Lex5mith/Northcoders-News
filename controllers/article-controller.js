const { fetchArticleById } = require("../models/article-model")

const getArticleId = (request, response, next) => {
    const article_id = request.params.article_id
    fetchArticleById(article_id).then((article) => {
        console.log(article, "<<<<article returned to controller")
        return response.status(200).send({article})
    })
}


module.exports = { getArticleId }