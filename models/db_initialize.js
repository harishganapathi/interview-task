var config = require("../config/globals_config")
const async = require('async');
var db = config.mysql.getClient();
var Users = db.import('./user');

function models_sync() {
    async.series([
        function (cb) {
            Users.sync().then(() => {
                console.log("Users table sync done.");
                cb(null)
            }).catch((err) => {
                console.log("Error creating Users table", err);
                cb(err);
            });
        },
    ], function (err, result) {
        console.log("Database sync complete");
    });
}

module.exports = {
    models_sync: models_sync
};
