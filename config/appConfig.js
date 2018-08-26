module.exports = {
    postgres:
        {
            "username": "postgres",
            "password": "ttest123",
            "database": "ttest",
            "host": "localhost",
            "port": 5432,
            "dialect": "postgres",
            "pool": {
                "max": 20,
                "min": 0,
                "idle": 10000
            },
            "logging": false,
            "define": {
                "timestamps": false,
                "underscored": true
            },
            "isolationLevel": "READ COMMITTED"
        }
};