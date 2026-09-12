import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

export const ROLE_NAMES = [
  'SuperAdmin',
  'Gerente',
  'Vendedor',
  'GestorInventario',
  'Admin',
  'Seller',
  'Analyst',
];

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [ROLE_NAMES],
    },
  },
  menu: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: 'role',
  timestamps: true,
});

export default Role;
