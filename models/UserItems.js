module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user_items",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      user_id: DataTypes.STRING,
      item_id: DataTypes.STRING,
      amount_have: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
      amount_need: {
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
