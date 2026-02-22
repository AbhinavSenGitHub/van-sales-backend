const mongoose = require('mongoose');

const JourneyPlanSchema = new mongoose.Schema({
    routeName: { type: String, required: true, trim: true },
    routeCode: { type: String, required: true, index: true },
    validFrom: { type: Date, required: true, index: true },
    validTo: { type: Date, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    warehouse: { type: String, trim: true },
    vehicle: { type: String, trim: true },
    role: { type: String, required: true },
    primaryEmployee: { type: String, index: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active', index: true },
    customerIds: [{ type: Number }],
    schedule: {
        frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'] },
        days: [{ type: String }]
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('JourneyPlan', JourneyPlanSchema);
