const request = require("supertest");
const app = require("../app");

const BASE_URL = "/api/v1/users";
let TOKEN;
let userId;

beforeAll(async () => {
  const user = { email: "toro@gmail.com", password: "jose123" };

  const res = await request(app).post(`${BASE_URL}/login`).send(user);

  TOKEN = res.body.token;
});

test("GET -> 'URL' should return status code 200 and res.body to have length 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("POST -> 'URL' should return status code 201 and res.body to have length 1", async () => {
  const createUser = {
    firstName: "Pepe",
    lastName: "Suarez",
    email: "pesua@gmail.com",
    password: "pepe123",
    phone: "1234567",
  };

  const res = await request(app).post(`${BASE_URL}`).send(createUser);

  userId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.firstName).toBe(createUser.firstName);
});

test("UPDATE/PUT -> 'BASE_URL/:id' should return status code 200 and res.body.firstName === user.name", async () => {
  const user = { firstName: "Jose" };

  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .send(user)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(user.firstName);
});

test("LOGIN-> 'BASE_URL/login' should return status code 200, res.body.user.email ==== loginUser.email", async () => {
  const loginUser = {
    email: "pesua@gmail.com",
    password: "pepe123",
  };

  const res = await request(app).post(`${BASE_URL}/login`).send(loginUser);

  expect(res.status).toBe(200);
  expect(res.body.user.email).toBe(loginUser.email);
  expect(res.body.token).toBeDefined();
});

test("LOGIN-> 'BASE_URL/login' should return status code 401", async () => {
  const loginUser = {
    email: "pesua@gmail.com",
    password: "invalid password",
  };

  const res = await request(app).post(`${BASE_URL}/login`).send(loginUser);

  expect(res.status).toBe(401);
});

test("DELETE -> 'BASE_URL/:id' should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
