const mongoose = require('mongoose');
const JourneyPlan = require('./models/JourneyPlan');
require('dotenv').config();

const findInvalid = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/journey_planner');
        const allPlans = await JourneyPlan.find().lean();
        console.log(`Total plans: ${allPlans.length}`);
        allPlans.forEach(p => {
            if (typeof p.company === 'string') {
                console.log(`INVALID PLAN: ID=${p._id}, Company=${p.company}`);
            }
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findInvalid();
