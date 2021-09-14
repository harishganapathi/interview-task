/* 
   MySQL DB connection
*/

var Sequelize = require('sequelize');

module.exports = function () {
    var host, port, username, password;
    host = "localhost";
    port = 3306;
    username = "root";
    password = "m@yb3";

    var database = "maybe_task";
    var dialect_type = "mysql";

    var sequelize = new Sequelize(database, username, password, {
        host: host,
        port: port,
        dialect: dialect_type,
        operatorsAliases: false,
        logging: true,
        pool: {
            max: 500,
            min: 0,
            idle: 10000
        },
        define: {
            freezeTableName: true,
            charset: 'utf8',
            timestamps: false
        },
        logging: function () { },
        pool: {
            validateConnection: function () {
                logger.info("Connection validated.");
            },
            max: 500,
            min: 0,
            idle: 10000
        },
    });
    sequelize.authenticate().then(function () {
        console.log("MySQL Connected sucessfully");
    }, function (err) {
        console.log("MySQL connection failed", err);
    });

    return {
        getClient: function () {
            return sequelize;
        }
    }
}
