require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()
//const fs = require("fs")
const { Users, CurrencyShop } = require('./dbObjects')
const { Op } = require('sequelize')
const currency = new Discord.Collection()
const PREFIX = '!'

Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0 ;
	},
});

async function getUser(uid, message) {
    try {
        const userByName = await client.users.fetch(uid);
		//const member = await guild.users.fetch(uid);
		const userTag = userByName.tag;
		if(message)return message.channel.send("<@" + uid + ">");
		return userByName.tag;
		//return userTag;
    } catch (e) {
        console.error(e);
    }
}

client.once('ready', async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.author.bot) return;
	currency.add(message.author.id, 1);

	if (!message.content.startsWith(PREFIX)) return;
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
	const target = message.mentions.users.first() || message.author;
	console.log(`${target.tag} said ${PREFIX}${command} ${commandArgs}`);

	if (command === 'balance') {
		
		return message.channel.send(`${target.tag} this bitch got ${currency.getBalance(target.id)} fossils`);
	}else if (command == 'whostanks'){
		return message.channel.send('J Stanks'); 
	}else if (command == 'help'){
		const editedEmbed = new Discord.MessageEmbed()
            .setTitle(`Fossil Bot Cheat Sheet`)
            .setAuthor(`hoo HOO!`)
            .setColor('00ff00')
			.setTimestamp()
			.setDescription(`Commands:`)
			.setFooter(`Originally sent:`)
			.addFields(
				{ name: '!museum:', value: `Displays list of all fossils available in the museum`, },
				{ name: '!have', value: `Add fossils to your "HAVE" list. Usage: "!have fossil1, fossil2, fossil3...."` },
				//{ name: '\u200B', value: '\u200B' },
				
				{ name: '!need', value: `Add fossils to your "NEED" list. Usage: "!have fossil1, fossil2, fossil3...."` },
				{ name: '!bury', value: `Removes fossils from your inventory. Usage: "!bury fossil1, fossil2, fossil3...."` },
				{ name: '!inventory', value: `Displays all fossils on YOUR HAVE and NEED lists` },
				{ name: '!whohas <fossil>', value: `Check which users currently have a specific fossil. Usage: !whohas fossil1` },
				{ name: '!butwhataboutMYneeds', value: `Attempts to find a user who currently has each fossil on YOUR need list` },
				{ name: '!communism', value: `Attempts to match up all HAVE and NEED lists (WIP)` },
				{ name: '!whostanks', value: `tells the truth` },
				//{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
            //.setDescription(`${item_list}`)
            //.addField('to', newContent)
			message.channel.send(editedEmbed);
	}else if (command == 'whohas'){
		

		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } });
		if (!item) return message.channel.send('That fossil doesn\'t exist.');

		const user = await Users.findOne({ where: { user_id: target.id } });
		//const user_list = await UserItems.findAll({ where: { amount_have: { [Op.eq]: 1 } } });

		const user_list = await user.getItemsHaveAll(item);

		//return message.channel.send(`${target.tag} these dudes ${user_list.map(t => `${getUser(`${t.user_id}`)}`).join(', ')}`);
		message.channel.send(`The following users have a(n) ${item.name}:`)
		return user_list.map(t => `${getUser(`${t.user_id}`, message)}`);
		//return message.channel.send(`You've successfully done the thing ${item.name}`);


    }else if (command === 'inventory') {
		
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items_have = await user.getItemsHave();
		const items_need = await user.getItemsNeed();

		if (!items_have.length && !items_need.length) return message.channel.send(`${target.tag} ain't got no fossils!`);
		const have_list = `${items_have.map(t => `${t.item.name}`).join(', ')}`
		const need_list = `${items_need.map(t => `${t.item.name}`).join(', ')}`
		
		//const have_list_css = String("```yaml\n${have_list}```");
		const editedEmbed = new Discord.MessageEmbed()
            .setTitle(`${target.tag}'s Inventory:`)
            .setAuthor(`hoo HOO!`)
            .setColor('00ff00')
            .setTimestamp()
			.setFooter(`Originally sent:`)
			.addFields(
				{ name: 'Has:', value: `${have_list ? have_list : `Nothing. Zip. Zero. Zilch`}` },
				//{ name: '\u200B', value: '\u200B' },
				{ name: 'Needs:', value: `${need_list ? need_list : `Nothing. Zip. Zero. Zilch`}`, },
				//{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
            //.setDescription(`${item_list}`)
            //.addField('to', newContent)
			message.channel.send(editedEmbed);
			

		

	} else if (command === 'transfer') {
		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
		const transferTarget = message.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
		if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you don\'t have that much.`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
	} else if (command === 'bury') {
		//
		var argArr = commandArgs.split(",");
		var addedList = [];
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		if (argArr.length > 1) message.channel.send(`Hoo! More than one, I see!`);
		for (const arg of argArr){
			const item = await user.getFossilItem(arg.trim());
			if (!item){
				message.channel.send(`Wuh-oh... I can\'t seem to find ${arg} in our collection!`);
			}
			else{
				await user.removeFossil(item);
				var argUp = arg.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
				addedList.push(argUp);
			}
		}
		//const item = await CurrencyShop.findOne({ where: { name: { [Op.ilike]: commandArgs } } });
		
		//if (item.cost > currency.getBalance(message.author.id)) {
		//	return message.channel.send(`You don't have enough bells, ${message.author}`);
		//}

		
		//currency.add(message.author.id, -item.cost);
		//await user.addHave(item);

		return message.channel.send(`The following fossil(s) have been buried: ${addedList}`);
	} else if (command === 'have') {
		//
		var argArr = commandArgs.split(",");
		var addedList = [];
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		if (argArr.length > 1) message.channel.send(`Hoo! More than one, I see!`);
		for (const arg of argArr){
			const item = await user.getFossilItem(arg.trim());
			if (!item){
				message.channel.send(`Wuh-oh... I can\'t seem to find ${arg} in our collection!`);
			}
			else{
				await user.addHave(item);
				var argUp = arg.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
				addedList.push(argUp);
			}
		}
		//const item = await CurrencyShop.findOne({ where: { name: { [Op.ilike]: commandArgs } } });
		
		//if (item.cost > currency.getBalance(message.author.id)) {
		//	return message.channel.send(`You don't have enough bells, ${message.author}`);
		//}

		
		//currency.add(message.author.id, -item.cost);
		//await user.addHave(item);

		return message.channel.send(`The following fossil(s) have been added to your inventory: ${addedList}`);
	} else if (command === 'need') {

		var argArr = commandArgs.split(",");
		var addedList = [];
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		if (argArr.length > 1) message.channel.send(`Hoo! More than one, I see!...you greedy bitch`);
		for (const arg of argArr){
			const item = await user.getFossilItem(arg.trim());
			if (!item){
				message.channel.send(`Wuh-oh... I can\'t seem to find ${arg} in our collection!`);
			}
			else{
				await user.addNeed(item);
				var argUp = arg.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
				addedList.push(argUp);
			}
		}
		//const item = await CurrencyShop.findOne({ where: { name: { [Op.ilike]: commandArgs } } });
		
		//if (item.cost > currency.getBalance(message.author.id)) {
		//	return message.channel.send(`You don't have enough bells, ${message.author}`);
		//}

		
		//currency.add(message.author.id, -item.cost);
		//await user.addHave(item);

		return message.channel.send(`The following fossil(s) have been added to your NEED list: ${addedList}`);
		//const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } });
		//if (!item) return message.channel.send('That fossil doesn\'t exist.');
		//if (item.cost > currency.getBalance(message.author.id)) {
		//	return message.channel.send(`You don't have enough bells, ${message.author}`);
		//}

		//const user = await Users.findOne({ where: { user_id: message.author.id } });
		//currency.add(message.author.id, -item.cost);
		//await user.addNeed(item);

		//return message.channel.send(`You've successfully added a(n) ${item.name} to your NEED list!`);


	} else if (command === 'butwhataboutMYneeds') {
		
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items_need = await user.getItemsNeed();
		if (!items_need.length){
			return message.channel.send('Looks like you already have everything!');
		}
		var kvp = {};
		
		for (const item_name of items_need.map(t => `${t.item.name}`)){
			const item_id = await CurrencyShop.findOne({ where: { name: { [Op.like]: item_name } } });
			const user_list = await user.getItemsHaveAll(item_id);
			if (user_list.length){
				//message.channel.send(`The following users have a(n) ${item_name}:`)
				//user_list.map(t => `${getUser(`${t.user_id}`, message)}`);
				//"<@" + uid + ">"
				kvp[`${item_name}`] = user_list.map(t => `${"<@" + t.user_id + ">"}`);
				//kvpconsole.log(kvp[`${item_name}`]);
			}				
		}
		const editedEmbed = new Discord.MessageEmbed()
            .setTitle(`Big ol' list of shit having`)
            .setAuthor(`hoo HOO!`)
            .setColor('00ff00')
            .setTimestamp()
			.setFooter(`Originally sent:`)
			for(var key in kvp){
				editedEmbed.addFields(
					{ name: `${key}`, value: `${kvp[key]}` },
					//{ name: '\u200B', value: '\u200B' },
					//{ name: 'Needs:', value: `${need_list}`, },
					//{ name: 'Inline field title', value: 'Some value here', inline: true },
				)
					
				

			}
			
            //.setDescription(`${item_list}`)
            //.addField('to', newContent)
			return message.channel.send(editedEmbed);

		} else if (command === 'communism') {
			
			const user = await Users.findOne({ where: { user_id: target.id } });
			const items_need = await user.getItemsNeedAll();
			if (!items_need.length){
				return message.channel.send('Looks like everyone already has everything!');
			}
			var kvpNeed = new Map();
			var kvpHave = new Map();
			
			//for (const item_name of items_need.map(t => `${t.item.name} is needed by \n ${ "<@" + t.user_id + ">"}`)){
			for (const item_name of items_need){
				//var needMention = [];
				//needMention.push(`${"<@" + item_name.user_id + ">"}`);
				if(kvpNeed[`${item_name.item.name}`]){
					kvpNeed[`${item_name.item.name}`] += `${" <@" + item_name.user_id + ">"}`;
				}
				else{
					kvpNeed[`${item_name.item.name}`] = `${"<@" + item_name.user_id + ">"}`;
				}
				//`${needMention}`;//.map(t => `${t.item.name} is needed by \n ${ "<@" + t.user_id + ">"}`)){
				//const item_id = await CurrencyShop.findOne({ where: { name: { [Op.like]: item_name.replace(/ is.*/,'').replace(/\n.*/,'') } } });
				const item_id = await CurrencyShop.findOne({ where: { name: { [Op.like]: item_name.item.name } } });
				const user_list = await user.getItemsHaveAll(item_id);
				if (user_list.length){
					//message.channel.send(`The following users have a(n) ${item_name}:`)
					//user_list.map(t => `${getUser(`${t.user_id}`, message)}`);
					//"<@" + uid + ">"
					kvpHave[`${item_name.item.name}`] = user_list.map(t => `${"<@" + t.user_id + "> "}`);
					
					//kvp[`${item_name}`] = user_list.map(t => `${getUser(t.user_id)}`);
					//kvpconsole.log(kvp[`${item_name}`]);
				}				
			}
			const editedEmbed = new Discord.MessageEmbed()
				.setTitle(`Fossils for the people`)
				.setAuthor(`hoo HOO!`)
				.setColor('00ff00')
				.setTimestamp()
				.setFooter(`Originally sent:`)
				for(var key in kvpNeed){
					if(kvpHave[key]){
					editedEmbed.addFields(
						{ name: `${key}:`, value: `Who needs: ${kvpNeed[key]}\n Who has: ${kvpHave[key]}` },
						//{ name: '\u200B', value: '\u200B' },
						//{ name: 'Needs:', value: `${need_list}`, },
						//{ name: 'Inline field title', value: 'Some value here', inline: true },
					)
					}
				}
				
				//.setDescription(`${item_list}`)
				//.addField('to', newContent)
				return message.channel.send(editedEmbed);		
		
	} else if (command === 'museum') {
		const items = await CurrencyShop.findAll();
		message.channel.send(`We currently have the following exhibits:`);
		return message.channel.send(items.map(i => `${i.name}`).join('\n'), { code: true });
	} else if (command === 'leaderboard') {
		return message.channel.send(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.get(user.user_id).tag)}: ${user.balance}💰`)
				.join('\n'),
			{ code: true }
		);
	}
});


client.login(process.env.BOT_TOKEN)
