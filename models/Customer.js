const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: { type: String, trim: true },
    type: { type: String, index: true },
    customerCode: { type: String, index: true },
    contactNo: String,
    zone: { type: String, index: true },
    visited: {
        type: Boolean,
        default: false,
        index: true
    },
    salesAmount: {
        type: Number,
        default: 0
    },
    visitCompleted: {
        type: Boolean,
        default: false,
        index: true
    },
    stockistName: String,
    townName: String,
    dealerCategory: String,
    shopCategory: String,
    visitFrequency: String,
    lastOrder: String,
    avgOrder: String,
    lat: { type: Number },
    lng: { type: Number },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
