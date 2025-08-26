'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Matatus', 'name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Matatus', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Regular'
    });

    await queryInterface.addColumn('Matatus', 'capacity', {
      type: Sequelize.INTEGER,
      defaultValue: 14
    });

    await queryInterface.addColumn('Matatus', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Active'
    });

    await queryInterface.addColumn('Matatus', 'amenities', {
      type: Sequelize.JSON,
      defaultValue: {}
    });

    await queryInterface.addColumn('Matatus', 'departureSchedule', {
      type: Sequelize.JSON,
      defaultValue: {}
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Matatus', 'departureSchedule');
    await queryInterface.removeColumn('Matatus', 'amenities');
    await queryInterface.removeColumn('Matatus', 'status');
    await queryInterface.removeColumn('Matatus', 'capacity');
    await queryInterface.removeColumn('Matatus', 'type');
    await queryInterface.removeColumn('Matatus', 'name');
  }
};
