import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('order_items', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    order_product_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    salesPrice: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('order_items')
} 