const Sequelize = require("sequelize");
//const { Op } = require("sequelize");
const { Op } = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "acitems.sqlite",
});

const Users = sequelize.import("models/Users");
const Items = sequelize.import("models/Items");
const UserItems = sequelize.import("models/UserItems");
const Guilds = sequelize.import("models/Guilds");
const Guild_users = sequelize.import("models/Guild_users");

Guilds.belongsToMany(Users, {
  as: `gtou`,
  through: Guild_users,
  foreignKey: `guild_id`,
  otherKey: `user_id`,
});

Users.belongsToMany(Guilds, {
  as: `utog`,
  through: Guild_users,
  foreignKey: `user_id`,
  otherKey: `guild_id`,
});

Items.belongsToMany(Users, {
  as: `itou`,
  through: UserItems,
  foreignKey: `item_id`,
  otherKey: `user_id`,
});

Users.belongsToMany(Items, {
  as: `utoi`,
  through: UserItems,
  foreignKey: `user_id`,
  otherKey: `item_id`,
});

//UserItems.belongsTo(Items, { foreignKey: "item_id", as: "item" });
//UserItems.belongsTo(Users, { foreignKey: "user_id", as: "uid" });
//Users.belongsTo(Guilds, { foreignKey: "guild_id", as: "gid" });

Users.prototype.getFossilItem = async function (name) {
  return (fossilName = await Items.findOne({
    where: { name: { [Op.like]: name } },
  }));
};

Users.prototype.addHave = async function (item) {
  const thisUser = this;
  const UserItems = await thisUser.getUtoi({ where: { name: item } });
  //console.log(userItems);

  if (UserItems.length) {
    for (i in UserItems) {
      UserItems[i].dataValues.user_items.amount_have += 1;
      UserItems[i].dataValues.user_items.save();
      return UserItems[i].name;
    }
  } else {
    return await Items.findOne({
      where: { name: { [Op.like]: item } },
    }).then(function (gotItem) {
      if (gotItem) {
        thisUser.addUtoi(gotItem, {
          through: { item_id: gotItem.id, amount_need: 0, amount_have: 1 },
        });
        return gotItem.name;
      }
    });
  }
};

Users.prototype.addNeed = async function (item) {
  const thisUser = this;
  const UserItems = await thisUser.getUtoi({ where: { name: item } });
  //console.log(userItems);

  if (UserItems.length) {
    for (i in UserItems) {
      UserItems[i].dataValues.user_items.amount_need += 1;
      UserItems[i].dataValues.user_items.save();
      return UserItems[i].name;
    }
  } else {
    return await Items.findOne({
      where: { name: { [Op.like]: item } },
    }).then(function (gotItem) {
      if (gotItem) {
        thisUser.addUtoi(gotItem, {
          through: { item_id: gotItem.id, amount_need: 1, amount_have: 0 },
        });
        return gotItem.name;
      }
    });
  }
};

Users.prototype.removeFossil = async function (item) {
  const thisUser = this;
  const UserItems = await thisUser.getUtoi({ where: { name: item } });
  //console.log(userItems);

  if (UserItems.length) {
    for (i in UserItems) {
      UserItems[i].dataValues.user_items.amount_need = 0;
      UserItems[i].dataValues.user_items.amount_have = 0;
      UserItems[i].dataValues.user_items.save();
      return UserItems[i].name;
    }
  } else {
    return false;
  }
};

Users.prototype.getUserItems = async function () {
  //const userItems2 = await this.getUtoi({ where: { amount_have: 2 } });
  const userItems = await this.getUtoi();
  return userItems;
};

Users.prototype.getItemsHaveAllItem = async function (item, guildID) {
  return await Users.findAll({
    include: {
      model: Guilds,
      as: `utog`,
      where: { gid: guildID },
    },
    include: {
      model: Items,
      as: `utoi`,
      where: { name: { [Op.like]: item } },
      through: { where: { amount_have: { [Op.ne]: 0 } } },
    },
  }).then(function (users) {
    return users;
  });
};

Users.prototype.getItemsNeedAll = async function (guildID) {
  return await Users.findAll({
    include: {
      model: Guilds,
      as: `utog`,
      where: { gid: guildID },
    },
    include: {
      model: Items,
      as: `utoi`,
      through: { where: { amount_need: { [Op.ne]: 0 } } },
    },
  }).then(function (users) {
    return users;
  });
};

Users.prototype.getItemsNeedUser = async function () {
  //const userItems = await this.getUtoi({ where: { amount_need: 1 } });
  //return userItems;
  const userItems = await this.getUtoi();
  //const userItems = user.getUtoi();
  return userItems
    .map((i) => (i.user_items.amount_need ? i.name : ``))
    .filter(Boolean);
};

Guilds.prototype.getGuildUsers = async function () {
  return await this.getGtou();
};
Users.prototype.get2GuildUser = function () {
  return Users.findOne({
    where: {
      user_id: this.user_id,
    },
    include: ["gid"],
  });
};

Users.prototype.getGuildUserAll = function () {
  return Users.findAll({
    where: {
      user_id: this.user_id,
    },
    include: [`gid`],
  });
};

module.exports = { Users, Items, UserItems, Guilds, Guild_users };
