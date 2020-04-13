const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = sequelize.import('models/CurrencyShop');
sequelize.import('models/Users');
sequelize.import('models/UserItems');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [

		CurrencyShop.upsert({ name: 'ACANTHOSTEGA', cost: 0 }),

		CurrencyShop.upsert({ name: 'AMBER', cost: 0 }),

		CurrencyShop.upsert({ name: 'AMMONITE', cost: 0 }),

		CurrencyShop.upsert({ name: 'Ankylo Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Ankylo Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Ankylo Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'ANOMALOCARIS', cost: 0 }),

		CurrencyShop.upsert({ name: 'ARCHAEOPTERYX', cost: 0 }),

		CurrencyShop.upsert({ name: 'Archelon Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Archelon Tail', cost: 0 }),
		CurrencyShop.upsert({ name: 'AUSTRALOPITH', cost: 0 }),
		CurrencyShop.upsert({ name: 'Brachio Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Brachio Chest', cost: 0 }),
		CurrencyShop.upsert({ name: 'Brachio Pelvis', cost: 0 }),
		CurrencyShop.upsert({ name: 'Brachio Tail', cost: 0 }),
		CurrencyShop.upsert({ name: 'COPROLITE', cost: 0 }),

		CurrencyShop.upsert({ name: 'Deinony Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Deinony Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Deinony Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'Dimetrodon Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Dimetrodon Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Dimetrodon Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'DINOSAUR TRACK', cost: 0 }),

		CurrencyShop.upsert({ name: 'Diplo Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Diplo Neck', cost: 0 }),
		CurrencyShop.upsert({ name: 'Diplo Chest', cost: 0 }),
		CurrencyShop.upsert({ name: 'Diplo Pelvis', cost: 0 }),
		CurrencyShop.upsert({ name: 'Diplo Tail', cost: 0 }),
		CurrencyShop.upsert({ name: 'Diplo Tail Tip', cost: 0 }),

		CurrencyShop.upsert({ name: 'DUNKLEOSTEUS', cost: 0 }),

		CurrencyShop.upsert({ name: 'EUSTHENOPTERON', cost: 0 }),

		CurrencyShop.upsert({ name: 'Iguanodon Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Iguanodon Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Iguanodon Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'JURAMAIA', cost: 0 }),

		CurrencyShop.upsert({ name: 'Mammoth Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Mammoth Torso', cost: 0 }),

		CurrencyShop.upsert({ name: 'Megacero Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Megacero Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Megacero Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'Megalo Left Side', cost: 0 }),
		CurrencyShop.upsert({ name: 'Megalo Right Side', cost: 0 }),

		CurrencyShop.upsert({ name: 'MYLLOKUNMINGIA', cost: 0 }),

		CurrencyShop.upsert({ name: 'Ophthalmo Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Ophthalmo Torso', cost: 0 }),

		CurrencyShop.upsert({ name: 'Pachy Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Pachy Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'Parasaur Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Parasaur Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Parasaur Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'Plesio Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Plesio Neck', cost: 0 }),
		CurrencyShop.upsert({ name: 'Plesio Torso', cost: 0 }),

		CurrencyShop.upsert({ name: 'Ptera Body', cost: 0 }),
		CurrencyShop.upsert({ name: 'Left Ptera Wing', cost: 0 }),
		CurrencyShop.upsert({ name: 'Right Ptera Wing', cost: 0 }),

		CurrencyShop.upsert({ name: 'Quetzal Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Left Quetzal Wing', cost: 0 }),
		CurrencyShop.upsert({ name: 'Right Quetzal Wing', cost: 0 }),

		CurrencyShop.upsert({ name: 'Sabertooth Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Sabertooth Torso', cost: 0 }),

		CurrencyShop.upsert({ name: 'SHARK-TOOTH PATTERN', cost: 0 }),

		CurrencyShop.upsert({ name: 'Spino Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Spino Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Spino Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'Stego Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Stego Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Stego Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'T. Rex Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'T. Rex Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'T. Rex Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'Tricera Skull', cost: 0 }),
		CurrencyShop.upsert({ name: 'Tricera Torso', cost: 0 }),
		CurrencyShop.upsert({ name: 'Tricera Tail', cost: 0 }),

		CurrencyShop.upsert({ name: 'TRILOBITE', cost: 0 }),
	];
	console.log('got to shop init');
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);