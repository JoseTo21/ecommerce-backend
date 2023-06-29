const request = require("supertest");
const app = require("../app");

const URL_LOGIN = "/api/v1/users/login";
const BASE_URL = "/api/v1/categories";

let categoryId;

beforeAll(async () => {
  const user = { email: "toro@gmail.com", password: "jose123" };

  const res = await request(app).post(`${URL_LOGIN}`).send(user);

  TOKEN = res.body.token;
});

test("POST -> 'BASE_RUL' should return status code 201 and res.body.name === category.name", async () => {
  const category = {
    name: "Phones",
  };

  const res = await request(app)
    .post(`${BASE_URL}`)
    .set("Authorization", `Bearer ${TOKEN}`)
    .send(category);

  categoryId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.name).toBe(category.name);
});

test("GET ALL -> 'BASE_URL' should return status code 200 and res.body === res.body.length is 1", async () => {
  const res = await request(app).get(BASE_URL);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'BASE_URL' should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${categoryId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
