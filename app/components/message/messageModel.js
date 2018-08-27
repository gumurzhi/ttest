'use strict';

module.exports = function (sequelize, DataTypes) {
    let Message = sequelize.define('Message', {
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
            beforeCreate: function () {
              this.date = new Date();
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
