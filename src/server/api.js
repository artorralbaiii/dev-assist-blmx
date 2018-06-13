'use strict';

var accountCtrl = require('./controllers/account.controller')();

module.exports = (express) => {

    var api = express.Router();

    api.get('/account', accountCtrl.createAccount);

    return api;
};