const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const getAll = catchError(async (req, res) => {
  const userId = req.user.id;
  const results = await Purchase.findAll({
    where: { userId },
    include: [Product],
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findAll({
    where: { userId },
    attributes: ["userId", "productId", "quantity"],
    raw: true,
  });

  const result = await Purchase.bulkCreate(cart);

  await Cart.destroy({ where: { userId } });
  return res.status(201).json(result);
});

module.exports = {
  getAll,
  create,
};
