const User = require("../../models/User");

const user = async () => {
  const userCreate = {
    firstName: "Jose",
    lastName: "Toro",
    email: "toro@gmail.com",
    password: "jose123",
    phone: "1234567",
  };

  await User.create(userCreate);
};

module.exports = user;
