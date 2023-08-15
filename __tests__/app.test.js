const request = require("supertest");
const endpointDocumentation = require("../endpoints.json");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("app.js tests", () => {
  describe("GET getApiDocumentation", () => {
    test("200: returns api documentaion", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(endpointDocumentation);
          expect(response.body["GET /api"].description).toEqual(
            "serves up a json representation of all the available endpoints of the api"
          );
          expect(response.body["GET /api/topics"].description).toEqual(
            "serves an array of all topics"
          );
          expect(response.body["GET /api/articles"].description).toEqual(
            "serves an array of all articles"
          );
          expect(
            response.body["GET /api/articles/:article_id"].description
          ).toEqual("returns one article when given a valid id");
        });
    });
  });

  describe("GET getTopics", () => {
    test("200: responds with a status 200", () => {
      return request(app).get("/api/topics").expect(200);
    });

    test("200: all topics are returned", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });

  describe("GET getArticlesById", () => {
    test("200: responds with the correct article object on the response body", () => {
      return request(app)
        .get("/api/articles/13")
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toEqual({
            article_id: 13,
            title: "Another article about Mitch",
            topic: "mitch",
            author: "butter_bridge",
            body: "There will never be enough articles about Mitch!",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("404: responds with error when given an unknown article id", () => {
      return request(app)
        .get("/api/articles/5000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual(`Article 5000 does not exist`);
        });
    });
    test("400: responds with error when given an unknown article id", () => {
      return request(app)
        .get("/api/articles/bananas")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Invalid id, id must be a number");
        });
    });
  });

  describe("GET getAllArticles", () => {
    test("200: responds with the correctly formatted article objects on the response body including the comment count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(String));
          });
        });
    });
    test("200: articles are returned in descending date order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});
describe.only("GET getAllCommentsByArticleId", () => {
  test("200: responds with an array of comments for the given article_id with the correct properties", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      // .then((response) => {
      //   const { article } = response.body;
      //   expect(article).toEqual({
      //     article_id: 13,
      //     title: "Another article about Mitch",
      //     topic: "mitch",
      //     author: "butter_bridge",
      //     body: "There will never be enough articles about Mitch!",
      //     created_at: "2020-10-11T11:24:00.000Z",
      //     votes: 0,
      //     article_img_url:
      //       "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      //   });
      });
  });
  // test("404: responds with error when given an unknown article id", () => {
  //   return request(app)
  //     .get("/api/articles/5000")
  //     .expect(404)
  //     .then((response) => {
  //       expect(response.body.msg).toEqual(`Article 5000 does not exist`);
  //     });
  // });
  // test("400: responds with error when given an unknown article id", () => {
  //   return request(app)
  //     .get("/api/articles/bananas")
  //     .expect(400)
  //     .then((response) => {
  //       expect(response.body.msg).toEqual("Invalid id, id must be a number");
  //     });
//   });
// });
