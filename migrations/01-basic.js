'use strict';

module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `create
	            table
		            "users" ( id uuid not null,
		            "firstname" character varying( 255 ) not null,
		            "lastname" character varying( 255 ) not null,
		            "email" character varying( 255 ) not null,
		            "password" character varying( 255 ) not null,
            		constraint "users_pkey" primary key ( id ) ) with ( oids = false );
	            alter table
		        "users" owner to postgres;
	            alter table
		            "users" add unique ( "email" );`
        )
            .then(() => queryInterface.sequelize.query(
                `create
	                table
		                "messages" ( id uuid not null,
		                "date" date not null,
		                "text" character varying( 255 ) not null,
		                "price" int not null,
		                "deal_id" uuid not null,
		                "sender_id" uuid not null,
		                "receiver_id" uuid not null,
		            constraint "messages_pkey" primary key ( id ) ) with ( oids = false );
	                alter table
		            "messages" owner to postgres;`
                )
            )
            .then(() => queryInterface.sequelize.query(
                    `CREATE TYPE st AS ENUM ('open', 'closed', 'rejected');
                      create
	                    table
		                    "deals" ( id uuid not null,
		                    "state" st default 'open',
		                constraint "deals_pkey" primary key ( id ) ) with ( oids = false );
	                    alter table
		                "deals" owner to postgres;
		                `
                )
            )
    },

    down(queryInterface) {

        return queryInterface.sequelize.query(
            'DROP TABLE users;'
        )
            .then(() => queryInterface.sequelize.query(
                'DROP TABLE messages;'))
            .then(() => queryInterface.sequelize.query(
                'DROP TABLE deals;'))
    }
};
