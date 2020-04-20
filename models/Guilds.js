module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "guilds",
    {
      gid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
