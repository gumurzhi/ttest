'use strict';

const STATUS = {
    OPEN: 'open',
    CLOSED: 'closed'
};
module.exports = function (sequelize, DataTypes) {
    let Deal = sequelize.define('deal', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        state: {
            type: DataTypes.ENUM(STATUS.OPEN, STATUS.CLOSED),
            defaultValue: STATUS.OPEN
        }
    }, {
        underscored: true
    });


    Deal.associate = function (models) {
        Deal.hasMany(models.messageModel, {as: 'messages', onDelete: 'CASCADE'});
    };

    return Deal;
};
