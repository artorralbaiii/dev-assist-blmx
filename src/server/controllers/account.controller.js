'use strict';

var Customer = require('../models/customer');

module.exports = () => {
    var ctrl = {
        createAccount: createAccount
    };

    return ctrl;

    // Implementations

    function createAccount(req, res, next) {
        var body = req.body;

        var customers = [];


        for (i = 0; i < body.custCount; i++) {
            var newCustomer = new Customer( {
                name: dName,
                status: dStatus,
                product: dProduct,
                balance: dBalance,
                transactions: []
            });

            for (i = 0; i < body.transCount; i++) {
                var trans = {
                    transType: transType,
                    amount: amount,
                    transData: transDate
                };
                newCustomer.transactions.push(trans);
            }

            customers.push(newCustomer);
        }

        newCustomer.save(function (err, records) {
            if (err) {
                return next(err);
            }

            res.json({
                success: true,
                message: 'Records successfully created.',
                data: records
            });

        });
    }

};