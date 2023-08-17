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
          expect(response.body["GET /api/articles"].queries).toEqual([
            "author",
            "topic",
            "sort_by",
            "order",
          ]);
          expect(
            response.body["GET /api/articles/:article_id"].description
          ).toEqual(
            "returns one article including comment count when given a valid id"
          );
          expect(
            response.body["GET /api/articles/:article_id/comments"].description
          ).toEqual("returns an array of comments when given a valid id");
          expect(
            response.body["POST /api/articles/:article_id/comments"].description
          ).toEqual("returns the comment that has been added to the article");
          expect(
            response.body["PATCH /api/articles/:article_id"].description
          ).toEqual(
            "updates the vote count in an article with a valid id, works for both positive and negative integers"
          );
          expect(
            response.body["DELETE /api/comments/:comment_id"].description
          ).toEqual("deletes the given comment by comment_id");
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
            author: "butter_bridge",
            title: "Another article about Mitch",
            article_id: 13,
            body: "There will never be enough articles about Mitch!",
            topic: "mitch",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "0",
          });
        });
    });
    test("404: responds with error when given an unknown article id", () => {
      return request(app)
        .get("/api/articles/5000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual(`Not found`);
        });
    });
    test("400: responds with error when given an unknown article id", () => {
      return request(app)
        .get("/api/articles/bananas")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Invalid id");
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

  describe("GET getAllCommentsByArticleId", () => {
    test("200: responds with an array of comments for the given article_id with the correct properties", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toEqual([
            {
              comment_id: 16,
              body: "This is a bad article name",
              article_id: 6,
              author: "butter_bridge",
              votes: 1,
              created_at: "2020-10-11T15:23:00.000Z",
            },
          ]);
        });
    });

    test("200: responds with empty comment array if article exists, but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });

    test("404: responds with error if article does not exist", () => {
      return request(app)
        .get("/api/articles/5000/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not found");
        });
    });

    test("400: responds with error when given an invalid article id", () => {
      return request(app)
        .get("/api/articles/bananas/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Invalid id");
        });
    });
  });

  describe("POST postCommentToArticle", () => {
    test("201: responds with the comment data that has beed added", () => {
      return request(app)
        .post("/api/articles/6/comments")
        .send({
          username: "lurker",
          body: "adding my first comment :-)",
        })
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toEqual({
            comment_id: 19,
            body: "adding my first comment :-)",
            article_id: 6,
            author: "lurker",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("404: responds with a 404 error and message if article does not exist", () => {
      return request(app)
        .post("/api/articles/5000/comments")
        .send({
          username: "lurker",
          body: "adding my first comment :-)",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Id is not in table");
        });
    });
    test("404: responds with a 400 error and message if username does not exist", () => {
      return request(app)
        .post("/api/articles/6/comments")
        .send({
          username: "bob",
          body: "adding my first comment :-)",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Id is not in table");
        });
    });
    test("400: responds with a 400 error and message if bad request body sent", () => {
      return request(app)
        .post("/api/articles/6/comments")
        .send({
          username: null,
          body: "adding my first comment :-)",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Invalid id");
        });
    });
  });

  describe("PATCH: /api/articles/:article_id", () => {
    test("201: reponds with the updated article", () => {
      return request(app)
        .patch(`/api/articles/6`)
        .send({
          inc_votes: 3,
        })
        .expect(201)
        .then((response) => {
          const { article } = response.body;
          expect(article).toEqual({
            comment_id: 16,
            body: "This is a bad article name",
            article_id: 6,
            author: "butter_bridge",
            votes: 4,
            created_at: "2020-10-11T15:23:00.000Z",
          });
        });
    });
    test("201: responds with the correctly incremented vote count when passed a positive integer", () => {
      return request(app)
        .patch(`/api/articles/6`)
        .send({
          inc_votes: 3,
        })
        .expect(201)
        .then((response) => {
          expect(response.body.article.votes).toEqual(4);
        });
    });
    test("201: responds with the correctly decremented vote count when passed a negative integer", () => {
      return request(app)
        .patch(`/api/articles/6`)
        .send({
          inc_votes: -3,
        })
        .expect(201)
        .then((response) => {
          expect(response.body.article.votes).toEqual(-2);
        });
    });
    test("404: responds with a 404 error and message if article does not exist", () => {
      return request(app)
        .patch("/api/articles/10000")
        .send({
          inc_votes: -3,
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not found");
        });
    });
    test("400: responds with a 400 error and message if non number value entered to inc_votes", () => {
      return request(app)
        .patch("/api/articles/6")
        .send({
          inc_votes: "null",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Invalid id");
        });
    });
  });

  describe("DELETE: /api/comments/:comment_id", () => {
    test("204: deleted the comment and responds with status 204 and no content", () => {
      return request(app)
        .delete(`/api/comments/6`)
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });
    test("404: responds with a 404 error and message if comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/10000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not found");
        });
    });
    test("400: responds with a 400 error and message if non number value entered to comment_id", () => {
      return request(app)
        .delete("/api/comments/bananas")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Invalid id");
        });
    });
  });

  describe("GET getAllUsers", () => {
    test("200: responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
    test("200: all users are returned", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;
          expect(users).toHaveLength(4);
        });
    });
  });

  describe("GET articles queries", () => {
    test("200: articles can be queried by topic, all articles with that topic should be returned", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("200: responds with empty article array if topic exists, but has no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual([]);
        });
    });
    test("200: articles can be queried by topic, sorted by a specified field and ordered either ascending or descending", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=votes&order=ASC")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("votes");
          expect(articles[0].votes).toEqual(0);
          expect(articles[11].votes).toEqual(100);
          expect(articles).toBeSortedBy("votes", { ascending: true });
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("404: responds with a 404 error and message if topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=coconut")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not found");
        });
    });
    test("400: responds with a 400 error and message if sort_by given an invalid value", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=coconuts")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Sort column does not exist");
        });
    });

    test("400: responds with a 400 error and message if order given an invalid value", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=votes&order=carrots")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual(`Order must be ASC or DESC`);
        });
    });
  });
});
