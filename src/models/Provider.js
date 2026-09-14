import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, {
  tableName: 'providers',
  timestamps: true,
});

export default Provider;