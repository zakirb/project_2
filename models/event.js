'use strict';
module.exports = (sequelize, DataTypes) => {
  var event = sequelize.define('event', {
    ticketmaster_id: DataTypes.STRING,
    name: DataTypes.STRING,
    purchase_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
    date: DataTypes.STRING,
    venue: DataTypes.STRING,
    location: DataTypes.STRING
  }, {});
  event.associate = function(models) {
    // associations can be defined here
    models.event.belongsToMany(models.user, {through: models.events_users});
  };
  return event;
};
