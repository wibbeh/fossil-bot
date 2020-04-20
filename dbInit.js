const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "acitems.sqlite",
});

const Items = sequelize.import("models/Items");
sequelize.import("models/Users");
sequelize.import("models/UserItems");
sequelize.import("models/Guilds");
sequelize.import("models/Guild_users");

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
  .sync({ force })
  .then(async () => {
    const item = [
      Items.upsert({ name: "ACANTHOSTEGA", cost: 0 }),

      Items.upsert({ name: "AMBER", cost: 0 }),

      Items.upsert({ name: "AMMONITE", cost: 0 }),

      Items.upsert({ name: "Ankylo Skull", cost: 0 }),
      Items.upsert({ name: "Ankylo Torso", cost: 0 }),
      Items.upsert({ name: "Ankylo Tail", cost: 0 }),

      Items.upsert({ name: "ANOMALOCARIS", cost: 0 }),

      Items.upsert({ name: "ARCHAEOPTERYX", cost: 0 }),

      Items.upsert({ name: "Archelon Skull", cost: 0 }),
      Items.upsert({ name: "Archelon Tail", cost: 0 }),
      Items.upsert({ name: "AUSTRALOPITH", cost: 0 }),
      Items.upsert({ name: "Brachio Skull", cost: 0 }),
      Items.upsert({ name: "Brachio Chest", cost: 0 }),
      Items.upsert({ name: "Brachio Pelvis", cost: 0 }),
      Items.upsert({ name: "Brachio Tail", cost: 0 }),
      Items.upsert({ name: "COPROLITE", cost: 0 }),

      Items.upsert({ name: "Deinony Skull", cost: 0 }),
      Items.upsert({ name: "Deinony Torso", cost: 0 }),
      Items.upsert({ name: "Deinony Tail", cost: 0 }),

      Items.upsert({ name: "Dimetrodon Skull", cost: 0 }),
      Items.upsert({ name: "Dimetrodon Torso", cost: 0 }),
      Items.upsert({ name: "Dimetrodon Tail", cost: 0 }),

      Items.upsert({ name: "DINOSAUR TRACK", cost: 0 }),

      Items.upsert({ name: "Diplo Skull", cost: 0 }),
      Items.upsert({ name: "Diplo Neck", cost: 0 }),
      Items.upsert({ name: "Diplo Chest", cost: 0 }),
      Items.upsert({ name: "Diplo Pelvis", cost: 0 }),
      Items.upsert({ name: "Diplo Tail", cost: 0 }),
      Items.upsert({ name: "Diplo Tail Tip", cost: 0 }),

      Items.upsert({ name: "DUNKLEOSTEUS", cost: 0 }),

      Items.upsert({ name: "EUSTHENOPTERON", cost: 0 }),

      Items.upsert({ name: "Iguanodon Skull", cost: 0 }),
      Items.upsert({ name: "Iguanodon Torso", cost: 0 }),
      Items.upsert({ name: "Iguanodon Tail", cost: 0 }),

      Items.upsert({ name: "JURAMAIA", cost: 0 }),

      Items.upsert({ name: "Mammoth Skull", cost: 0 }),
      Items.upsert({ name: "Mammoth Torso", cost: 0 }),

      Items.upsert({ name: "Megacero Skull", cost: 0 }),
      Items.upsert({ name: "Megacero Torso", cost: 0 }),
      Items.upsert({ name: "Megacero Tail", cost: 0 }),

      Items.upsert({ name: "Megalo Left Side", cost: 0 }),
      Items.upsert({ name: "Megalo Right Side", cost: 0 }),

      Items.upsert({ name: "MYLLOKUNMINGIA", cost: 0 }),

      Items.upsert({ name: "Ophthalmo Skull", cost: 0 }),
      Items.upsert({ name: "Ophthalmo Torso", cost: 0 }),

      Items.upsert({ name: "Pachy Skull", cost: 0 }),
      Items.upsert({ name: "Pachy Tail", cost: 0 }),

      Items.upsert({ name: "Parasaur Skull", cost: 0 }),
      Items.upsert({ name: "Parasaur Torso", cost: 0 }),
      Items.upsert({ name: "Parasaur Tail", cost: 0 }),

      Items.upsert({ name: "Plesio Skull", cost: 0 }),
      Items.upsert({ name: "Plesio Neck", cost: 0 }),
      Items.upsert({ name: "Plesio Torso", cost: 0 }),

      Items.upsert({ name: "Ptera Body", cost: 0 }),
      Items.upsert({ name: "Left Ptera Wing", cost: 0 }),
      Items.upsert({ name: "Right Ptera Wing", cost: 0 }),

      Items.upsert({ name: "Quetzal Torso", cost: 0 }),
      Items.upsert({ name: "Left Quetzal Wing", cost: 0 }),
      Items.upsert({ name: "Right Quetzal Wing", cost: 0 }),

      Items.upsert({ name: "Sabertooth Skull", cost: 0 }),
      Items.upsert({ name: "Sabertooth Torso", cost: 0 }),

      Items.upsert({ name: "SHARK-TOOTH PATTERN", cost: 0 }),

      Items.upsert({ name: "Spino Skull", cost: 0 }),
      Items.upsert({ name: "Spino Torso", cost: 0 }),
      Items.upsert({ name: "Spino Tail", cost: 0 }),

      Items.upsert({ name: "Stego Skull", cost: 0 }),
      Items.upsert({ name: "Stego Torso", cost: 0 }),
      Items.upsert({ name: "Stego Tail", cost: 0 }),

      Items.upsert({ name: "T. Rex Skull", cost: 0 }),
      Items.upsert({ name: "T. Rex Torso", cost: 0 }),
      Items.upsert({ name: "T. Rex Tail", cost: 0 }),

      Items.upsert({ name: "Tricera Skull", cost: 0 }),
      Items.upsert({ name: "Tricera Torso", cost: 0 }),
      Items.upsert({ name: "Tricera Tail", cost: 0 }),

      Items.upsert({ name: "TRILOBITE", cost: 0 }),
    ];
    console.log("got to item init");
    await Promise.all(item);
    console.log("Database synced");
    sequelize.close();
  })
  .catch(console.error);
