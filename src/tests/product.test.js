const request = require("supertest");
const app = require("../app");
require("../models");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");

const URL_LOGIN = "/api/v1/users/login";
const BASE_URL = "/api/v1/products";
let TOKEN;
let category;
let productId;
let productImg;

beforeAll(async () => {
  const user = { email: "toro@gmail.com", password: "jose123" };

  const res = await request(app).post(URL_LOGIN).send(user);

  TOKEN = res.body.token;
});

test("POST -> 'BASE_URL' should return status code 201 and re.body.title === product.tittle", async () => {
  const categoryBody = {
    name: "Tech",
  };

  category = await Category.create(categoryBody);

  const product = {
    title: "xiaomi 12",
    description: "lorem12",
    price: "189.98",
    categoryId: category.id,
  };

  const res = await request(app)
    .post(BASE_URL)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.title).toBe(product.title);
});

test("GET -> 'BASE_URL' should return status code 200, res.body.length is 1, res.body[0] to be defined", async () => {
  const res = await request(app).get(BASE_URL);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].productImgs).toBeDefined();
});

test("GET -> 'BASE_URL?category = category.id' should return status code 200, res.body.length is 1, res.body[0] to be defined", async () => {
  const res = await request(app).get(`${BASE_URL}?category=${category.id}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].productImgs).toBeDefined();
});

test("GET ONE -> 'BASE_URL/:id' should return status code 200 and res.body.title is xiaomi 12", async () => {
  const res = await request(app).get(`${BASE_URL}/${productId}`);

  expect(res.status).toBe(200);
  expect(res.body.title).toBe("xiaomi 12");
  expect(res.body.category).toBeDefined();
  expect(res.body.productImgs).toBeDefined();
});

test("PUT -> 'BASE_URL/:id' should return status code 200 and res.body.title === body.title", async () => {
  const product = {
    title: "xiaomi 12",
  };

  const res = await request(app)
    .put(`${BASE_URL}/${productId}`)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body.title).toBe(product.title);
});

test("POST -> 'BASE_URL/:id/images', should return status code 201, and res.body.length == 1", async () => {
  const productImgBody = {
    url: "http://localhost:8080/api/v1/public/uploads/cocina.jpg",
    filename: "cocina.jpg",
    productId,
  };

  productImg = await ProductImg.create(productImgBody);

  const res = await request(app)
    .post(`${BASE_URL}/${productId}/images`)
    .send([productImg.id])
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'BASE_URL/:id' should return status code 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await category.destroy();
  await productImg.destroy();
});
