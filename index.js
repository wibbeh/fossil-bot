require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
//const fs = require("fs")
const { Users, Items, UserItems, Guilds, Guild_users } = require("./dbObjects");
const { Op } = require("sequelize");
const userList = new Discord.Collection();
const newGuild = new Discord.Collection();
const newUser = new Discord.Collection();
const guildMembers = new Discord.Collection();
const userFunctions = new Discord.Collection();
const PREFIX = "!";

Reflect.defineProperty(userFunctions, "getGuild", {
  value: async function getGuild(guild_id) {
    return Guilds.findOne({
      where: { gid: guild_id },
    }).then((guild) => {
      return guild;
    });
  },
});

Reflect.defineProperty(userFunctions, "getUser", {
  value: async function add(_target) {
    return Users.findOne({
      where: { uid: _target.id },
    }).then((user) => {
      if (user) {
        //user.balance += Number(amount);
        return user;
      } else {
        return Users.create({
          uid: _target.id,
          balance: 10,
        }).then(function (_newUser) {
          const _guild = Guilds.findOne({
            where: { gid: _target.lastMessage.channel.guild.id },
          }).then(function (thisGuild) {
            _newUser.addUtog(thisGuild);
          });
          return _newUser;
        });
      }
    });
  },
});

Reflect.defineProperty(newGuild, "add", {
  value: async function add(guild) {
    const boop = await Guilds.create({ gid: guild.id })
      .then(async function (guilds) {
        guild.members.fetch().then(async function (m) {
          m.map(async function (mem) {
            const usr = await Users.findOrCreate({
              where: { uid: mem.id, balance: 10 },
              defaults: { uid: mem.id, balance: 10 },
            }).then(function (result) {
              var u = result[0],
                created = result[1];
              guilds.addGtou(u);
            });
          });
        });
      })
      .catch((guilds) => {
        console.log(guilds);
      });
    return boop;
  },
});

Reflect.defineProperty(newGuild, "blip", {
  value: async function blip(guild) {
    const boop = await Guilds.destroy({
      where: { gid: guild.id },
    }).catch((guilds) => {
      console.log(guilds);
    });
    return boop;
  },
});

Reflect.defineProperty(newUser, "add", {
  value: async function add(target) {
    const usr = await Users.create({ uid: target.id, balance: 10 })
      .then(function (u) {
        u.addUtog(target.lastMessage.channel.guild.id);
      })
      .catch((u) => {
        console.log(u);
      });
  },
});

client.once("ready", async () => {
  //const storedBalances =
  //storedBalances.forEach((b) => userList.set(b.user_id, b));

  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildCreate", async (guild) => {
  console.log("Joined a new guild: " + guild.name);
  const boop = await newGuild.add(guild);
});

client.on("guildMemberAdd", (member) => {
  // Add member to guild db
  console.log(member.id + ` has joined the guild ` + member.guild.name);
  newUser.add(member.id);
  console.log(member.id + ` added to guild db`);
});

client.on("guildDelete", async (guild) => {
  console.log("Left a guild: " + guild.name);
  const boop = await newGuild.blip(guild);
  console.log(boop);
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  //userList.add(message.author.id, 1);

  if (!message.content.startsWith(PREFIX)) return;

  const input = message.content.slice(PREFIX.length).trim();
  if (!input.length) return;
  const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
  const target = message.mentions.users.first() || message.author;

  console.log(`${target.tag} said ${PREFIX}${command} ${commandArgs}`);

  if (command === "balance") {
    const _user = await userFunctions.getUser(target);
    return message.channel.send(
      `${target.tag} this bitch got ${_user.dataValues.balance} bells`
    );
  } else if (command == "whostanks") {
    return message.channel.send("J Stanks");
  } else if (command == "test") {
    console.log(`test`);

    console.log(kvpHave.join(", "));
    console.log(kvpNeed).join(", ");
  } else if (command == "help") {
    const editedEmbed = new Discord.MessageEmbed()
      .setTitle(`Fossil Bot Cheat Sheet`)
      .setAuthor(`hoo HOO!`)
      .setColor("00ff00")
      .setTimestamp()
      .setDescription(`Commands:`)
      .setFooter(`Originally sent:`)
      .addFields(
        {
          name: "!museum:",
          value: `Displays list of all fossils available in the museum`,
        },
        {
          name: "!have",
          value: `Add fossils to your "HAVE" list. Usage: "!have fossil1, fossil2, fossil3...."`,
        },
        //{ name: '\u200B', value: '\u200B' },

        {
          name: "!need",
          value: `Add fossils to your "NEED" list. Usage: "!have fossil1, fossil2, fossil3...."`,
        },
        {
          name: "!bury",
          value: `Removes fossils from your inventory. Usage: "!bury fossil1, fossil2, fossil3...."`,
        },
        {
          name: "!inventory",
          value: `Displays all fossils on YOUR HAVE and NEED lists`,
        },
        {
          name: "!whohas <fossil>",
          value: `Check which users currently have a specific fossil. Usage: !whohas fossil1`,
        },
        {
          name: "!butwhataboutMYneeds",
          value: `Attempts to find a user who currently has each fossil on YOUR need list`,
        },
        {
          name: "!communism",
          value: `Attempts to match up all HAVE and NEED lists (WIP)`,
        }
        //{ name: 'Inline field title', value: 'Some value here', inline: true },
      );
    //.setDescription(`${item_list}`)
    //.addField('to', newContent)
    message.channel.send(editedEmbed);
  } else if (command == "whohas") {
    var argArr = commandArgs.split(",");
    const _user = await userFunctions.getUser(target);
    const addedList = [];
    //console.log(_user);
    if (argArr.length > 1) {
      message.channel.send(`Hoo! More than one, I see!`);
    }
    if (argArr.length > 0) {
      for (_item in argArr) {
        addedList.push(
          await _user.getItemsHaveAllItem(
            argArr[_item].toUpperCase().trim(),
            message.guild.id
          )
        );
      }
      if (addedList.length) {
        for (thing of addedList) {
          if (thing.length) {
            const users_to_send = thing.map((u) => `${"<@" + u.uid + ">"}`);
            message.channel.send(
              `The following users have a(n) ${thing[0].utoi[0].name}`
            );
            message.channel.send(users_to_send);
          } else {
            message.channel.send(
              `Wuh-oh... It doesn\'t look like anyone has a(n) "${
                argArr[addedList.indexOf(thing)]
              }" `
            );
          }
        }
      }
      console.log(addedList);
    }
  } else if (command === "inventory") {
    const user = await Users.findOne({ where: { uid: target.id } });
    const userItems = await user.getUserItems();

    if (!userItems.length)
      return message.channel.send(`${target.tag} ain't got no fossils!`);
    const have_list = userItems
      .map((t) => (t.user_items.amount_have ? t.name : ``))
      .filter(Boolean); //.join(", ")}`;
    const need_list = userItems
      .map((t) => (t.user_items.amount_need ? t.name : ``))
      .filter(Boolean);

    //const have_list_css = String("```yaml\n${have_list}```");
    const editedEmbed = new Discord.MessageEmbed()
      .setTitle(`${target.tag}'s Inventory:`)
      .setAuthor(`hoo HOO!`)
      .setColor("00ff00")
      .setTimestamp()
      .setFooter(`Originally sent:`)
      .addFields(
        {
          name: "Has:",
          value: `${
            have_list.length ? have_list : `Nothing. Zip. Zero. Zilch`
          }`,
        },
        //{ name: '\u200B', value: '\u200B' },
        {
          name: "Needs:",
          value: `${
            need_list.length ? need_list : `Nothing. Zip. Zero. Zilch`
          }`,
        }
      );
    message.channel.send(editedEmbed);
  } else if (command === "bury") {
    var argArr = commandArgs.split(",");
    const _user = await userFunctions.getUser(target);
    const addedList = [];
    //console.log(_user);
    if (argArr.length > 1) {
      message.channel.send(`Hoo! More than one, I see!`);
    }
    if (argArr.length > 0) {
      for (_item in argArr) {
        if (await _user.removeFossil(argArr[_item].toUpperCase().trim())) {
          addedList.push(argArr[_item].toUpperCase().trim());
        } else {
          message.channel.send(
            `Wuh-oh... I can\'t seem to find "${argArr[_item]}" in your inventory!`
          );
        }
      }

      message.channel.send(`The following fossil(s) have been buried:`);
      if (addedList.length) {
        for (str in addedList) {
          message.channel.send(
            addedList[str]
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ")
          );
        }
      }
    }

    //
  } else if (command === "have") {
    var argArr = commandArgs.split(",");
    const _user = await userFunctions.getUser(target);
    const addedList = [];
    //console.log(_user);
    if (argArr.length > 1) {
      message.channel.send(`Hoo! More than one, I see!`);
    }
    if (argArr.length > 0) {
      for (_item in argArr) {
        if (await _user.addHave(argArr[_item].toUpperCase().trim())) {
          addedList.push(argArr[_item].toUpperCase().trim());
        } else {
          message.channel.send(
            `Wuh-oh... I can\'t seem to find "${argArr[_item]}" in our collection!`
          );
        }
      }

      message.channel.send(
        `The following fossil(s) have been added to your inventory:`
      );
      if (addedList.length) {
        for (str in addedList) {
          message.channel.send(
            addedList[str]
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ")
          );
        }
      }
    }
  } else if (command === "need") {
    var argArr = commandArgs.split(",");
    const _user = await userFunctions.getUser(target);
    const addedList = [];
    //console.log(_user);
    if (argArr.length > 1) {
      message.channel.send(`Hoo! More than one, I see!`);
    }
    if (argArr.length > 0) {
      for (_item in argArr) {
        if (await _user.addNeed(argArr[_item].toUpperCase().trim())) {
          addedList.push(argArr[_item].toUpperCase().trim());
        } else {
          message.channel.send(
            `Wuh-oh... I can\'t seem to find "${argArr[_item]}" in our collection!`
          );
        }
      }

      message.channel.send(
        `The following fossil(s) have been added to your inventory:`
      );
      if (addedList.length) {
        for (str in addedList) {
          message.channel.send(
            addedList[str]
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ")
          );
        }
      }
    }
    //`Wuh-oh... I can\'t seem to find ${arg} in our collection!`

    //var argUp = arg.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
  } else if (command === "butwhataboutMYneeds") {
    const user = await userFunctions.getUser(target);
    //const userItems = await user.getUserItems();
    const userItemsNeed = await user.getItemsNeedUser();
    console.log(userItemsNeed);
    if (!userItemsNeed.length)
      return message.channel.send(
        `${target.tag}, looks like you don't need anything!`
      );
    var kvp = {};
    for (item in userItemsNeed) {
      if (userItemsNeed[item]) {
        const have_list = await user.getItemsHaveAllItem(
          userItemsNeed[item],
          target.lastMessage.channel.guild.id
        );
        //console.log(have_list);
        if (have_list.length) {
          kvp[`${userItemsNeed[item]}`] = have_list.map(
            (t) => `${"<@" + t.uid + ">"}`
          );
        }
      }
    }
    console.log(kvp);
    const editedEmbed = new Discord.MessageEmbed()
      .setTitle(`MY needs`)
      .setAuthor(`hoo HOO!`)
      .setColor("00ff00")
      .setTimestamp()
      .setFooter(`Originally sent:`);
    for (var key in kvp) {
      editedEmbed.addFields(
        { name: `${key}`, value: `Who has: ${kvp[key]}` }
        //{ name: '\u200B', value: '\u200B' },
        //{ name: 'Needs:', value: `${need_list}`, },
        //{ name: 'Inline field title', value: 'Some value here', inline: true },
      );
    }

    //.setDescription(`${item_list}`)
    //.addField('to', newContent)
    return message.channel.send(editedEmbed);
  } else if (command === "communism") {
    const guild_id = message.guild.id;
    const guild = await userFunctions.getGuild(guild_id);
    const guildUsers = await guild.getGuildUsers();
    var i = 1;
    console.log(guildUsers);

    //const userItemsNeed = await

    const kvpHave = {};
    const kvpNeed = {};

    for (user of guildUsers) {
      console.log(user);
      const userItemsNeed = await user.getItemsNeedUser();
      console.log(userItemsNeed);
      for (item of userItemsNeed) {
        const whoHas = await user.getItemsHaveAllItem(item, guild_id);
        console.log(whoHas);
        if (whoHas.length) {
          kvpHave[item] = whoHas.map((t) => `${"<@" + t.uid + ">"}`);

          if (kvpNeed[item]) {
            const tmp = [];
            tmp.push(kvpNeed[item]);
            tmp.push(`${"<@" + user.uid + ">"}`);
            kvpNeed[item] = tmp.filter(Boolean);
          } else {
            kvpNeed[item] = `${"<@" + user.uid + ">"}`;
          }
        }
      }
    }

    const editedEmbed = new Discord.MessageEmbed()
      .setTitle(`Fossils for the people`)
      .setAuthor(`hoo HOO!`)
      .setColor("00ff00")
      .setTimestamp()
      .setFooter(`Originally sent:`);
    for (var key in kvpNeed) {
      if (i < 25) {
        const kvpHaveString = kvpNeed[key];
        const kvpNeedString = kvpHave[key];
        if (
          kvpHave[key] &&
          editedEmbed.length <
            6000 - (kvpNeedString.length * 23 + kvpHaveString.length + 30)
        ) {
          editedEmbed.addFields(
            {
              name: `${key}:`,
              value: `Who needs: ${kvpNeedString}\n Who has: ${kvpHaveString}`,
            }
            //{ name: '\u200B', value: '\u200B' },
            //{ name: 'Needs:', value: `${need_list}`, },
            //{ name: 'Inline field title', value: 'Some value here', inline: true },
          );
          i++;
        }
      }
    }

    //.setDescription(`${item_list}`)
    //.addField('to', newContent)
    return message.channel.send(editedEmbed);
  } else if (command === "museum") {
    const itemList = await Items.findAll();
    message.channel.send(`We currently have the following exhibits:`);
    return message.channel.send(itemList.map((i) => `${i.name}`).join("\n"), {
      code: true,
    });
  }
});

client.login(process.env.BOT_TOKEN);
