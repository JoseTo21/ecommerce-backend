const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
require("../models");

URL_LOGIN = "/api/v1/users/login";
BASE_URL = "/api/v1/purchase";
let TOKEN;
let userId;
let product;

beforeAll(async () => {
  const user = { email: "toro@gmail.com", password: "jose123" };

  const res = await request(app).post(URL_LOGIN).send(user);

  TOKEN = res.body.token;
  userId = res.body.user.id;
});

test("POST -> 'URL_BASE' should return status code 200 and res.body.quantity === body.quantity", async () => {
  const productBody = {
    title: "Iphone 12",
    description: "lorem12",
    price: "123.78",
  };

  product = await Product.create(productBody);

  const cartBody = {
    quantity: 3,
    userId,
    productId: product.id,
  };

  await Cart.create(cartBody);

  const res = await request(app)
    .post(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(201);
  expect(res.body[0].quantity).toBe(cartBody.quantity);
});

test("GET -> 'BASE_URL' should return status code 200 and res.body.length == 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);

  await product.destroy();
});
