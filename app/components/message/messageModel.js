'use strict';

module.exports = function (sequelize, DataTypes) {
    let Message = sequelize.define('message', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        date: {
            type: DataTypes.DATE
        },
        text: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCreate: function (message) {
                return new Promise((resolve) => {
                    message.date = new Date();
                   return resolve(message);
                });
            },

        }
    });

    Message.associate = function (models) {
        Message.belongsTo(models.dealModel, {as: 'deal'});
        Message.belongsTo(models.userModel, {as: 'sender'});
        Message.belongsTo(models.userModel, {as: 'receiver'});
    };

    return Message;
};
