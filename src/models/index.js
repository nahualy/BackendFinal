import sequelize from '../config/database.js';
import Role from './Role.js';
import User from './User.js';
import Provider from './Provider.js';

Role.hasMany(User, {
  foreignKey: 'role',
  as: 'users',
});

User.belongsTo(Role, {
  foreignKey: 'role',
  as: 'roleDetails',
});

const models = {
  sequelize,
  Role,
  User,
  Provider,
};

export { sequelize, Role, User, Provider };
export default models;
