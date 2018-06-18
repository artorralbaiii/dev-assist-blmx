'use strict';
/*jshint -W101 */
module.exports = function () {
    var config = {
        env: {
            PORT: 8001,
            MONGO_DB: 'mongodb://admin:passw0rd@ds257470.mlab.com:57470/mock_mf_db',
            NODE_ENV: 'dev'
        }
    };

    return config;
};
/*jshint +W101 */