'use strict';
module.exports = (sequelize, DataTypes) => {
  var event = sequelize.define('event', {
    ticketmaster_id: DataTypes.STRING,
    name: DataTypes.STRING,
    venue: DataTypes.STRING,
    date: DataTypes.STRING
  }, {});
  event.associate = function(models) {
    // associations can be defined here
  };
  return event;
};