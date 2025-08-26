import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('Matatus', 'name', {
    type: DataTypes.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('Matatus', 'type', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Regular'
  });

  await queryInterface.addColumn('Matatus', 'capacity', {
    type: DataTypes.INTEGER,
    defaultValue: 14
  });

  await queryInterface.addColumn('Matatus', 'status', {
    type: DataTypes.STRING,
    defaultValue: 'Active'
  });

  await queryInterface.addColumn('Matatus', 'amenities', {
    type: DataTypes.JSON,
    defaultValue: {}
  });

  await queryInterface.addColumn('Matatus', 'departureSchedule', {
    type: DataTypes.JSON,
    defaultValue: {}
  });

  await queryInterface.addColumn('Matatus', 'price', {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('Matatus', 'name');
  await queryInterface.removeColumn('Matatus', 'type');
  await queryInterface.removeColumn('Matatus', 'capacity');
  await queryInterface.removeColumn('Matatus', 'status');
  await queryInterface.removeColumn('Matatus', 'amenities');
  await queryInterface.removeColumn('Matatus', 'departureSchedule');
  await queryInterface.removeColumn('Matatus', 'price');
}
