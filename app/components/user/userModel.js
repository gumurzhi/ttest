'use strict';

const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('user', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^[A-Z0-9._%-]+@[A-Z0-9.-]+(\.[A-Z]{2,4})?$/i,
                    msg: 'username must be valid email'
                }
            }
        },
        password: {type: DataTypes.STRING, field: 'password_hash', allowNull: false, defaultValue: ''},
    }, {
        underscored: true,
        hooks: {
            // beforeCreate: function (user, options, fn) {
            //     if (user.email) {
            //         user.email = user.email.toLowerCase();
            //     }
            //     user.username = user.username.toLowerCase();
            //
            //     if (user.getDataValue('password_hash') && !user.passwordHash) {
            //         user.passwordHash = user.getDataValue('password_hash');
            //     }
            //     if (user.salt && user.passwordHash) {
            //         return Promise.resolve(user);
            //     }
            //
            //     return user.generateSalt().then(function (salt) {
            //         return user.generateHash(salt, user._plainPassword).then(function (passwordHash) {
            //             user.salt = salt;
            //             user.passwordHash = passwordHash;
            //             Promise.resolve(user);
            //         });
            //     });
            // },

        },
        getterMethods: {
            isAdmin() {
                return this.role === ROLES.ADMIN;
            }
        },
        setterMethods: {
            password: function (password) {
                this._plainPassword = password;
            }
        },
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    });


    // User.prototype.updateTenantName = function (name) {
    //     if (this.isRegularUser) {
    //         return Promise.reject({status: 403, message: 'Not enough rights to update tenant name'});
    //     }
    //
    //     return this.getTenant()
    //         .then(tenant => tenant.update({ name }));
    // };

    User.associate = function (models) {
        User.hasMany(models.messageModel, {as: 'messages'});
    };
    return User;
};
