'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    transType: { type: String },
    amount: { type: String },
    transDate: { type: Date, default: Date.now() }
}, { timestamps: true });

var customerSchema = new Schema({
    name: { type: String },
    status: { type: String },
    product: { type: String },
    balance: { type: Number, default: 0 },
    transactions: [transactionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);