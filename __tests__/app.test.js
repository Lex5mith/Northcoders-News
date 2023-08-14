const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const endpointDocumentation = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET requests", () => {
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
  test.only("200: responds with the correct article object on the response body", () => {
    return request(app)
      .get("/api/articles/13")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toBe(article);
      })
    })
    
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
      });
  });
});
