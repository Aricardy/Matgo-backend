import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('Matatus', 'qrCode', {
    type: DataTypes.TEXT,
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('Matatus', 'qrCode');
}
