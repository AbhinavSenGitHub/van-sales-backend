const mongoose = require('mongoose');

const JourneyPlanSchema = new mongoose.Schema({
    routeName: { type: String, required: true },
    routeCode: { type: String, required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    company: { type: String, required: true }, // FMCG Company Name
    warehouse: { type: String }, // Optional or link
    vehicle: { type: String }, // Optional or link
    role: { type: String, required: true }, // 'Sales Rep', 'Store Manager', etc.
    primaryEmployee: { type: String }, // Employee Name
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    customerIds: [{ type: Number }], // Array of customer IDs
    schedule: {
        frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'] },
        days: [{ type: String }] // Array of days like 'Monday', 'Tuesday'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JourneyPlan', JourneyPlanSchema);
