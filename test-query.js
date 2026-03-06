const mongoose = require('mongoose');
const JourneyPlan = require('./models/JourneyPlan');
const Company = require('./models/Company');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/journey_planner');
        console.log('Connected');
        const plans = await JourneyPlan.find().populate('company', 'name').limit(1).lean();
        console.log('Plans:', JSON.stringify(plans, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
};

test();
