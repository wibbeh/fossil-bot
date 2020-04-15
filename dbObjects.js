const Sequelize = require("sequelize");
//const { Op } = require("sequelize");
const { Op } = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Users = sequelize.import("models/Users");
const CurrencyShop = sequelize.import("models/CurrencyShop");
const UserItems = sequelize.import("models/UserItems");

UserItems.belongsTo(CurrencyShop, { foreignKey: "item_id", as: "item" });

Users.prototype.getFossilItem = async function (name) {
  return (fossilName = await CurrencyShop.findOne({
    where: { name: { [Op.like]: name } },
  }));
};

Users.prototype.addHave = async function (item) {
  const userItem = await UserItems.findOne({
    where: { user_id: this.user_id, item_id: item.id },
  });

  if (userItem) {
    userItem.amount_have += 1;
    userItem.amount_need = 0;
    return userItem.save();
  }

  return UserItems.create({
    user_id: this.user_id,
    item_id: item.id,
    amount_have: 1,
    amount_need: 0,
  });
};

Users.prototype.addNeed = async function (item) {
  const userItem = await UserItems.findOne({
    where: { user_id: this.user_id, item_id: item.id },
  });

  if (userItem) {
    userItem.amount_need = 1;
    userItem.amount_have = 0;
    return userItem.save();
  }

  return UserItems.create({
    user_id: this.user_id,
    item_id: item.id,
    amount_have: 0,
    amount_need: 1,
  });
};

Users.prototype.removeFossil = async function (item) {
  const userItem = await UserItems.findOne({
    where: { user_id: this.user_id, item_id: item.id },
  });

  if (userItem) {
    userItem.amount_need = 0;
    userItem.amount_have = 0;
    return userItem.save();
  }

  return;
};

Users.prototype.getItemsHave = function () {
  return UserItems.findAll({
    where: {
      user_id: this.user_id,
      amount_have: {
        [Op.ne]: 0,
      },
    },
    include: ["item"],
  });
};

Users.prototype.getItemsHaveAll = function (item) {
  return UserItems.findAll({
    where: { item_id: item.id, amount_have: { [Op.ne]: 0 } },
  });
};

Users.prototype.getItemsNeed = function () {
  return UserItems.findAll({
    where: {
      user_id: this.user_id,
      amount_need: {
        [Op.ne]: 0,
      },
    },
    include: ["item"],
  });
};

Users.prototype.getItemsNeedAll = function () {
  return UserItems.findAll({
    where: {
      amount_need: {
        [Op.ne]: 0,
      },
    },
    include: ["item"],
  });
};

module.exports = { Users, CurrencyShop, UserItems };
