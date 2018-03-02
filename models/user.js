'use strict';
var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,99],
          msg: 'Invalid user name. Must be between 1 and 99 chars.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,99],
          msg: "Password must be at least 8 characters"
        }
      }
    },
    zipcode: {
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: /^\d{5}$/,
          msg: 'Zipcode must be 5 digits'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(pendingUser, options) {
        if (pendingUser && pendingUser.password) {
          var hash = bcrypt.hashSync(pendingUser.password, 10); //storing hashed password if it exists
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.event, {through: models.events_users});
  };
  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  };

  user.prototype.toJSON = function() {
    var userData = this.get();
    delete userData.password;
    return userData;
  };

  return user;
};
