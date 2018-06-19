/* jshint ignore:start */

var Customer = require('../models/customer');
var fs = require('fs');
var Template = require('../models/template');
var random = require('random-name');
var _ = require('underscore');

module.exports = () => {
    var ctrl = {
        createAccount: createAccount,
        dialogHook: dialogHook,
        getTemplates: getTemplates,
        openForm: openForm
    };

    return ctrl;

    // Implementations



    function openForm(req, res) {
        var body = req.body;
        var params = body.queryResult.parameters;

        global._socket.emit('load-form', params);
        res.json({
            message: 'Emitted: load-form'
        });
    }

    function dialogHook(req, res, next) {
        var body = req.body;
        var action = body.queryResult.action;
        var params = {};

        switch (action) {
            case 'OpenFormData': {

                if (body.queryResult.hasOwnProperty('parameters')) {
                    params = body.queryResult.parameters;
                }

                global._socket.emit('load-form', params);
                res.json({
                    message: 'Emitted: load-form'
                });

                break;
            }

            default: {
                res.json({
                    message: 'No Action Found!'
                });
            }
        }

    }

    function getTemplates(req, res, next) {
        Template.find({}, function (err, docs) {
            if (err) {
                return next(err);
            }

            res.json(docs);
        }).sort({ updatedAt: -1 });
    }


    function createAccount(req, res, next) {
        var body = req.body;
        var customers = [];
        var newCustomer = null;
        var name = '';
        var status = '';
        var product = '';
        var balance = 0;
        var transType = '';
        var amount = 0;
        var transDate = new Date();
        var sSQL = 'INSERT INTO customer_info (Name, Status, Product, Balance) Values(';
        var folder = 'sqlfiles';

        for (var i = 0; i < body.custCount; i++) {

            if (body.rndCustName) {
                name = randomData('NAME');
            } else {
                if (i === 0) {
                    name = body.custName;
                } else {
                    name = body.custName + '_' + i;
                }
            }

            sSQL = sSQL + '\'' + name + '\','; 

            if (body.rndStatus) {
                status = randomData('STATUS');
            } else {
                status = body.status;
            }

            sSQL = sSQL + '\'' + status + '\','; 

            if (body.rndProduct) {
                product = randomData('PRODUCT');
            } else {
                product = body.product;
            }

            sSQL = sSQL + '\'' + product + '\','; 

            if (body.rndBalance) {
                balance = randomData('BALANCE');
            } else {
                balance = body.balance;
            }

            sSQL = sSQL + balance + ');'; 

            newCustomer = new Customer({
                name: name,
                status: status,
                product: product,
                balance: balance,
                transactions: []
            });

            for (var j = 0; j < body.transCount; j++) {

                if (body.rndAmt) {
                    amount = randomData('AMOUNT');
                } else {
                    amount = body.amt;
                }

                sSQL = sSQL + 'INSERT INTO Transaction (Amount, TransType, TransDate) VALUES (' + amount + ',';

                if (body.rndTransType) {
                    transType = randomData('TYPE');
                } else {
                    transType = body.type;
                }

                sSQL = sSQL + '\'' + transType + '\','

                if (body.rndAmt) {
                    transDate = randomData('DATE');
                } else {
                    transDate = body.transDate;
                }

                sSQL = sSQL + '\'' + transDate + '\')';

                var trans = {
                    transType: transType,
                    amount: amount,
                    transDate: transDate
                };
                newCustomer.transactions.push(trans);
            }

            customers.push(newCustomer);
        }

        Customer.collection.insert(customers, function (err, docs) {
            if (err) {
                return next(err);
            } else {
                Template.findById(body.templateId, function (err, docTemplate) {
                    if (err) {
                        return next(err);
                    }

                    var template = null;

                    if (docTemplate) {
                        template = docTemplate;
                        template.templateName = body.templateName;
                        template.data = JSON.stringify(body);
                    } else {
                        // body = _.extend(body, {templateId: doc});
                        template = new Template({
                            templateName: body.templateName,
                            data: JSON.stringify(body)
                        });
                    }

                    template.save(function (err, doc) {
                        if (err) {
                            return next(err);
                        }

                        if (!fs.existsSync('./' + folder)) {
                            fs.mkdirSync('./' + folder);
                        }

                        var fileName = './' + folder + '/' + body.templateName + '.sql';

                        fs.writeFile(fileName, sSQL, function (err) {
                            if (err) {
                                return next(err);
                            }

                            res.json({
                                data: docs.ops,
                                file: fileName,
                            });
                        });
                    });
                });
            }
        });

    }

};



function randomData(fldType) {
    var index = 0;
    var values = [];

    if (fldType === 'NAME') {
        return random.first() + ' ' + random.last();
    } else if (fldType === 'STATUS') {
        values = ['Active', 'Inactive'];
        index = Math.floor((Math.random() * 2) + 1) - 1;

        return values[index];
    } else if (fldType === 'PRODUCT') {
        values = ['Savings', 'Checking'];
        index = Math.floor((Math.random() * 2) + 1) - 1;

        return values[index];
    } else if (fldType === 'BALANCE') {
        return Math.floor((Math.random() * 100000) + 1);
    } else if (fldType === 'TYPE') {
        values = ['Debit', 'Credit'];
        index = Math.floor((Math.random() * 2) + 1) - 1;

        return values[index];
    } else if (fldType === 'AMOUNT') {
        return Math.floor((Math.random() * 10000) + 1);
    } else if (fldType === 'DATE') {
        var start = new Date(2018, 01, 01);
        var end = new Date(2018, 12, 31);

        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

}

/* jshint ignore:end */