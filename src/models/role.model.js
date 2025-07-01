import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Role extends Model {}

  Role.init({
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'role',
    timestamps: false,
  });

  return Role;
}; 