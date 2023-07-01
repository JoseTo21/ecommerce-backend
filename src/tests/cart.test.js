const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

const URL_LOGIN = "/api/v1/users/login";
const BASE_RUL = "/api/v1/cart";
let TOKEN;
let userId;
let product;
let cartId;

beforeAll(async () => {
  const user = {
    email: "toro@gmail.com",
    password: "jose123",
  };

  const res = await request(app).post(URL_LOGIN).send(user);

  TOKEN = res.body.token;
  userId = res.body.user.id;
});

test("POST -> 'BASE_URL', should return status code 201 and res.body.quantity === body.quantity", async () => {
  const productBody = {
    title: "Xiaomi 12",
    description: "lorem12",
    price: "189.98",
  };

  product = await Product.create(productBody);

  const cartBody = {
    quantity: 1,
    userId,
    productId: product.id,
  };

  const res = await request(app)
    .post(BASE_RUL)
    .send(cartBody)
    .set("Authorization", `Bearer ${TOKEN}`);

  cartId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.quantity).toBe(cartBody.quantity);
});

test("GET -> 'BASE_URL' should return status code 200 and res.body.legnth = 1", async () => {
  const res = await request(app)
    .get(BASE_RUL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT -> 'BASE_URL/:id', should return status code 200 and res.body.quantity === body.quantity", async () => {
  const cartBody = {
    quantity: 2,
  };

  const res = await request(app)
    .put(`${BASE_RUL}/${cartId}`)
    .send(cartBody)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(cartBody.quantity);
});

test("DELETE -> 'BASE_URL/:id' should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_RUL}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await product.destroy();
});
