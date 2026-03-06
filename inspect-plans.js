const mongoose = require('mongoose');
const JourneyPlan = require('./models/JourneyPlan');
require('dotenv').config();

const list = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/journey_planner');
        const plans = await JourneyPlan.find().limit(10).lean();
        plans.forEach(p => {
            console.log(`ID: ${p._id}, Company: ${p.company} (Type: ${typeof p.company})`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

list();
