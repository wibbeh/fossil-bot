module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "guild_users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      user_id: {
        type: DataTypes.STRING,
      },
      guild_id: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
