const Product = require("./Product");
const Category = require("./Category");
const Cart = require("./Cart");
const User = require("./User");

//Product -> //categoryId
Product.belongsTo(Category);
Category.hasMany(Product);

//Cart -> //userId
Cart.belongsTo(User);
User.hasOne(Cart);

//Cart -> //productId
Cart.belongsTo(Product);
Product.hasMany(Cart);
