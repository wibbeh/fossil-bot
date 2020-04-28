require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBL_TOKEN, client);
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
    return await Guild_users.findOrCreate({
      where: {
        user_id: _target.id,
        guild_id: _target.lastMessage.channel.guild.id,
      },
    }).then(async function (result) {
      var guild_user = result[0],
        created = result[1];
      return await Users.findOrCreate({
        where: { uid: guild_user.user_id },
      }).then(async function (result) {
        _user = result[0];
        return _user;
      });
    });
  },
});

Reflect.defineProperty(newGuild, "add", {
  value: async function add(guild) {
    return await Guilds.create({ gid: guild.id })
      .then((guilds) => {
        return guilds;
      })
      .catch((guilds) => {
        console.log(guilds);
      });
  },
});

Reflect.defineProperty(newGuild, "blip", {
  value: async function blip(guild) {
    return await Guilds.destroy({
      where: { gid: guild.id },
    })
      .then((guilds) => {
        return guilds;
        //guilds.removeGtou();
      })
      .catch((guilds) => {
        console.log(guilds);
      });
  },
});

Reflect.defineProperty(newUser, "add", {
  value: async function add(target) {
    const guild = await Guilds.findOne({
      where: { gid: target.guild.id },
    }).then(async function (guilds) {
      const usr = await Users.findOrCreate({
        where: { uid: target.id, balance: 10 },
        defaults: { uid: target.id, balance: 10 },
      }).then(function (result) {
        var u = result[0],
          created = result[1];
        guilds.addGtou(u);
      });
    });
  },
});

Reflect.defineProperty(newUser, "remove", {
  value: async function remove(target) {
    const guild = await Guilds.findOne({
      where: { gid: target.guild.id },
    }).then(async function (guilds) {
      const usr = await Users.findOne({
        where: { uid: target.id, balance: 10 },
      }).then(async function (u) {
        if (u) guilds.removeGtou(u);
        return;
      });
    });
  },
});

// Optional events
dbl.on("posted", () => {
  console.log("Server count posted!");
});

dbl.on("error", (e) => {
  console.log(`Oops! ${e}`);
});

client.once("ready", async () => {
  //const storedBalances =
  //storedBalances.forEach((b) => userList.set(b.user_id, b));
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);

  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(() => {
    dbl.postStats(client.guilds.cache.size);
  }, 1800000);
});

client.on("guildCreate", async (guild) => {
  console.log("Joined a new guild: " + guild.name);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
  const boop = await newGuild.add(guild);
});

/*client.on("guildMemberAdd", (member) => {
  // Add member to guild db
  console.log(member.id + ` has joined the guild ` + member.guild.name);
  newUser.add(member);
  console.log(member.id + ` added to guild db`);
});*/

client.on("guildMemberRemove", (member) => {
  // Remove member from guild db
  //console.log(member.id + ` has left the guild ` + member.guild.name);
  newUser.remove(member);
  //console.log(member.id + ` removed from guild db`);
});

client.on("guildDelete", async (guild) => {
  console.log("Left a guild: " + guild.name);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
  const boop = await newGuild.blip(guild);
  console.log(guild.name + `deleted`);
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  //userList.add(message.author.id, 1);
  //console.log(message);
  //if (message.content.endsWith(PREFIX)) return;
  if (!message.content.startsWith(PREFIX)) return;
  //console.log(message);
  if (message.channel.type == "dm") return;
  const input = message.content.slice(PREFIX.length).trim();
  if (!input.length) return;
  if (!input.match(/\w+/)) return;
  const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
  const target = message.mentions.users.first() || message.author;

  console.log(`${target.tag} said ${PREFIX}${command} ${commandArgs}`);

  /*if (target.id == `687803445423374366`) {
    message.channel.send(`Pucker up!`);
  }*/

  if (command === "balance") {
    const _user = await userFunctions.getUser(target);
    return message.channel.send(
      `${target.tag} this bitch got ${_user.dataValues.balance} bells`
    );
  } else if (command == "whostanks") {
    return message.channel.send("J Stanks");
  } else if (command == "communism") {
    //console.log(`test`);
    const guild_id = message.guild.id;
    const guild = await userFunctions.getGuild(guild_id);
    const guildUsers = await guild.getGuildUsers();
    var i = 0;
    var k = 0;
    var length_exceed = 0;
    var indexes = [];
    indexes[0] = 0;
    var index_counter = 0;
    //console.log(guildUsers);

    //const userItemsNeed = await

    var kvpHave = {};
    var kvpNeed = {};

    for (user of guildUsers) {
      //console.log(user);
      const userItemsNeed = await user.getItemsNeedUser();
      //console.log(userItemsNeed);
      if (userItemsNeed.length) {
        for (item of userItemsNeed) {
          const whoHas = await user.getItemsHaveAllItem(item, guild_id);
          //console.log(whoHas);
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
    }
    //console.log(kvpNeed);
    //console.log(kvpHave);

    /*
     * Creates an embed with guilds starting from an index.
     * param {number} start The index to start from.
     */
    const generateEmbed = (start) => {
      i = 0;
      k = 0;
      //indexes[index_counter] = start;
      length_exceed = 0;

      //var sliceNeeds = {};
      //const current = guilds.slice(start, start + 10);
      /* .setTitle(`Fossils for the people`)
      .setAuthor(`hoo HOO!`)
      .setColor("00ff00")
      .setTimestamp()
      .setFooter(`Originally sent:`);*/

      // you can of course customise this embed however you want
      const embed = new Discord.MessageEmbed()
        .setTitle(`Fossils for the people`)
        .setColor("00ff00")
        .setAuthor(`hoo HOO!`);

      /*`Showing guilds ${start + 1}-${start + current.length} out of ${
          guilds.length
        }`*/
      // );
      for (var key in kvpNeed) {
        if (i < 20) {
          if (k >= start) {
            const kvpHaveString = kvpHave[key];
            const kvpNeedString = kvpNeed[key];
            if (
              kvpHave[key] &&
              embed.length <
                6000 - (kvpNeedString.length * 23 + kvpHaveString.length + 30)
            ) {
              embed.addFields(
                {
                  name: `${key}:`,
                  value: `Who needs: ${kvpNeedString}\n Who has: ${kvpHaveString}`,
                }
                //{ name: '\u200B', value: '\u200B' },
                //{ name: 'Needs:', value: `${need_list}`, },
                //{ name: 'Inline field title', value: 'Some value here', inline: true },
              );
              i++;
            } else if (kvpHave[key]) {
              length_exceed = 1;
            }
          }
          k++;
        } else {
          length_exceed = 1;
        }
      }

      return embed;
    };

    // edit: you can store the message author like this:
    const author = message.author;

    // send the embed with the first 10 guilds
    message.channel.send(generateEmbed(0)).then((dmessage) => {
      // exit if there is only one page of guilds (no need for all of this)
      if (!length_exceed) return;
      // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
      dmessage.react("➡️");
      const collector = dmessage.createReactionCollector(
        // only collect left and right arrow reactions from the message author
        (reaction, user) =>
          ["⬅️", "➡️"].includes(reaction.emoji.name) && user.id === author.id,
        // time out after a minute
        { time: 60000 }
      );

      //let currentIndex = 0;
      collector.on("collect", (reaction) => {
        // remove the existing reactions
        dmessage.reactions.removeAll().then(async () => {
          // increase/decrease index
          if (reaction.emoji.name === "⬅️") {
            index_counter -= 1;
          } else {
            index_counter += 1;
            indexes[index_counter] = indexes[index_counter - 1] + i;
          }

          // edit message with new embed
          dmessage.edit(generateEmbed(indexes[index_counter]));
          // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
          if (index_counter !== 0) await dmessage.react("⬅️");
          // react with right arrow if it isn't the end
          if (length_exceed) dmessage.react("➡️");
        });
      });
    });
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
          value: `Add fossils to your "HAVE" list. Usage: "!have fossil1, fossil2, fossil3...."\nEx: !have Amber, Ptera Body`,
        },
        //{ name: '\u200B', value: '\u200B' },

        {
          name: "!need",
          value: `Add fossils to your "NEED" list. Usage: "!have fossil1, fossil2, fossil3...."\nEx: !need Mammoth Torso, T. Rex skull`,
        },
        {
          name: "!bury",
          value: `Removes fossils from your inventory. Usage: "!bury fossil1, fossil2, fossil3...."\nEx: !bury Amber`,
        },
        {
          name: "!inventory",
          value: `Displays all fossils on YOUR HAVE and NEED lists`,
        },
        {
          name: "!whohas",
          value: `Check which users currently have a specific fossil. Usage: !whohas fossil1\nEx: !whohas Ptera Body`,
        },
        {
          name: "!butwhataboutMYneeds",
          value: `Attempts to find a user who currently has each fossil on YOUR need list`,
        },
        {
          name: "!communism",
          value: `Attempts to match up all HAVE and NEED lists`,
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
      //console.log(addedList);
    }
  } else if (command === "inventory") {
    //const user = await Users.findOne({ where: { uid: target.id } });
    const user = await userFunctions.getUser(target);
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
          addedList[str] = addedList[str]
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        }
        message.channel.send(addedList.join(", "));
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
          addedList[str] = addedList[str]
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        }
        message.channel.send(addedList.join(", "));
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
          addedList[str] = addedList[str]
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        }
        message.channel.send(addedList.join(", "));
      }
    }
    //`Wuh-oh... I can\'t seem to find ${arg} in our collection!`

    //var argUp = arg.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
  } else if (command === "butwhataboutMYneeds") {
    const user = await userFunctions.getUser(target);
    //const userItems = await user.getUserItems();
    const userItemsNeed = await user.getItemsNeedUser();
    //console.log(userItemsNeed);
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
    //console.log(kvp);
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
  } else if (command === "oldcommunism") {
    const guild_id = message.guild.id;
    const guild = await userFunctions.getGuild(guild_id);
    const guildUsers = await guild.getGuildUsers();
    var i = 1;
    //console.log(guildUsers);

    //const userItemsNeed = await

    const kvpHave = {};
    const kvpNeed = {};

    for (user of guildUsers) {
      //console.log(user);
      const userItemsNeed = await user.getItemsNeedUser();
      //console.log(userItemsNeed);
      if (userItemsNeed.length) {
        for (item of userItemsNeed) {
          const whoHas = await user.getItemsHaveAllItem(item, guild_id);
          //console.log(whoHas);
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
    }

    const editedEmbed = new Discord.MessageEmbed()
      .setTitle(`Fossils for the people`)
      .setAuthor(`hoo HOO!`)
      .setColor("00ff00")
      .setTimestamp()
      .setFooter(`Originally sent:`);
    for (var key in kvpNeed) {
      if (i < 25) {
        const kvpHaveString = kvpHave[key];
        const kvpNeedString = kvpNeed[key];
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
