const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

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
  test("200: returns api documentaion", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        // I think this should work but can't work out why it doesnt, please point me to the right notes to fix it.  
        //for (const key in response.body) {
        //   expect(key).toHaveProperty(['description']);
        // }
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
