module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "items",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      name: {
        unique: true,
        type: DataTypes.STRING,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
