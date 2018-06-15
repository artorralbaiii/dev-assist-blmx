'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var templateSchema = new Schema({
    templateName: { type: String },
    data: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);