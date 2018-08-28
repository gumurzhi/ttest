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
        password: {type: DataTypes.STRING, field: 'password', allowNull: false, defaultValue: ''},
    }, {
        underscored: true,
        hooks: {
            beforeCreate: function (user, options, fn) {
                if (user.email) {
                    user.email = user.email.toLowerCase();
                }
                return new Promise((resolve, reject) => {
                    bcrypt.hash(user.password, 7, function (err, hash) {
                        // Store hash in your password DB.
                        if (err) reject(err);
                        user.password = hash;
                        resolve(user);
                    });
                })
            },

        },
        // getterMethods: {
        //     isAdmin() {
        //         return this.role === ROLES.ADMIN;
        //     }
        // },
        // setterMethods: {
        //     password: function (password) {
        //         this._plainPassword = password;
        //     }
        // },
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ]
    });

    User.prototype.comparePassword = function comparePassword(testedPassword) {
        let storedHash = this.password;
        return new Promise(function (resolve, reject) {
            bcrypt.compare(testedPassword, storedHash, function (err, res) {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    };
    return User;
};
