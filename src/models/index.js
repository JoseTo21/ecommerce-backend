const Product = require("./Product");
const Category = require("./Category");

Product.belongsTo(Category);
Category.hasMany(Product);
