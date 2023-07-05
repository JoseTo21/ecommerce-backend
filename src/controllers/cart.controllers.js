const catchError = require("../utils/catchError");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");

const getAll = catchError(async (req, res) => {
  const user = req.user;
  const results = await Cart.findAll({
    include: [
      {
        model: Product,
        include: [Category, ProductImg],
      },
    ],
    where: { userId: user.id },
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const userId = req.user.id;
  const { quantity, productId } = req.body;
  const body = { userId, quantity, productId };
  const result = await Cart.create(body);
  return res.status(201).json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await Cart.destroy({ where: { id, userId } });
  if (!result) res.sendStatus(404);
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  delete req.body.userId;
  delete req.body.productId;
  const result = await Cart.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  remove,
  update,
};
