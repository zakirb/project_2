'use strict';
module.exports = (sequelize, DataTypes) => {
  var events_users = sequelize.define('events_users', {
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  events_users.associate = function(models) {
    // associations can be defined here
  };
  return events_users;
};