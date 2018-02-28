'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticketmaster_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      purchase_url: {
        type: Sequelize.STRING
      },
      image_url: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      venue: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};