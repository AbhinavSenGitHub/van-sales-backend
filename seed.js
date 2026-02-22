const mongoose = require('mongoose');
const Company = require('./models/Company');
const Customer = require('./models/Customer');
require('dotenv').config();

const DATA_MAPPING = {
    "Nestle": ["Walmart", "Carrefour", "Costco", "Reliance Retail", "Aldi", "Target", "7-Eleven", "Metro Cash & Carry"],
    "Procter & Gamble": ["Kroger", "Tesco", "DMart", "Walgreens", "Boots", "Lulu Hypermarket", "Coles", "Sainsbury's"],
    "Unilever": ["Big Bazaar", "Spencer's Retail", "Morrisons", "Asda", "Pick n Pay", "Shoprite", "FamilyMart", "HyperCity"],
    "PepsiCo": ["Domino's Pizza", "KFC", "Burger King", "Subway", "Starbucks", "Croma", "More Retail", "Circle K"],
    "Coca-Cola": ["McDonald's", "Pizza Hut", "Taco Bell", "In-N-Out Burger", "Haldiram's", "Barbeque Nation", "Nature's Basket", "FreshDirect"],
    "Mars": ["WHSmith", "Hudson News", "Duty Free Americas", "Miniso", "Dufry", "Sheetz", "Casey's", "Biedronka"],
    "Mondelez International": ["Albertsons", "Publix", "Edeka", "Lotte Mart", "FairPrice", "Woolworths", "Magnit", "Dia"],
    "Kraft Heinz": ["BJ's Wholesale Club", "Giant Eagle", "Meijer", "ICA Gruppen", "Jerónimo Martins", "Conad", "Mercadona", "Auchan"],
    "Danone": ["Whole Foods Market", "Sprouts Farmers Market", "Monoprix", "Migros", "Auchan Retail", "Globus", "Emart", "Carulla"],
    "General Mills": ["Hy-Vee", "WinCo Foods", "H-E-B", "Food Lion", "Raley's", "Giant Food", "Safeway", "Lidl"],
    "Kellogg's": ["Trader Joe's", "Wegmans", "Publix Super Markets", "Grocery Outlet", "Food Bazaar", "Shop & Stop", "Coop", "Rewe"],
    "Associated British Foods": ["Primark", "Iceland", "Spar", "Waitrose", "Makro", "Game", "Costcutter", "Bestway"],
    "Tyson Foods": ["Sysco", "US Foods", "Performance Food Group", "Restaurant Depot", "Aramark", "Compass Group", "Sodexo", "Gordon Food Service"],
    "JBS": ["BRF", "Minerva Foods", "Marfrig", "Cencosud", "Grupo Éxito", "Casino Group", "Pão de Açúcar", "Jerónimo Martins Colombia"],
    "Archer Daniels Midland": ["Cargill", "Bunge", "Louis Dreyfus Company", "Wilmar International", "COFCO", "Viterra", "Olam Group", "Glencore Agriculture"]
};

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/journey_planner';

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await Company.deleteMany({});
        await Customer.deleteMany({});

        let customerCounter = 1;

        for (const [companyName, customerNames] of Object.entries(DATA_MAPPING)) {
            const company = await Company.create({ name: companyName });
            console.log(`Created Company: ${company.name}`);

            const customers = [];
            customerNames.forEach((custName, index) => {
                customers.push({
                    id: customerCounter++,
                    name: custName,
                    address: `${100 + index + 1} Business Blvd, Suite ${index + 1}`,
                    type: (index % 2 === 0) ? "Supermarket" : "Retailer",
                    customerCode: `CUST${customerCounter.toString().padStart(6, '0')}`,
                    contactNo: `98765${customerCounter.toString().padStart(5, '0')}`,
                    zone: index < 4 ? "Zone A" : "Zone B",
                    visited: false,
                    salesAmount: 0,
                    visitCompleted: false,
                    stockistName: `Stockist for ${companyName}`,
                    townName: "Main City",
                    dealerCategory: "General Trade",
                    shopCategory: "Retailers",
                    visitFrequency: "Weekly",
                    lastOrder: (Math.random() * 5000).toFixed(2),
                    avgOrder: (Math.random() * 5000 + 1000).toFixed(2),
                    company: company._id
                });
            });

            await Customer.insertMany(customers);
            console.log(`Created ${customers.length} customers for ${company.name}`);
        }

        // Create sample Journey Plans for John Doe and vansales_test01
        const nestle = await Company.findOne({ name: 'Nestle' });
        const nestleCustomers = await Customer.find({ company: nestle._id }).limit(8);

        const JourneyPlan = require('./models/JourneyPlan');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const nextWeek = new Date();
        nextWeek.setDate(yesterday.getDate() + 8);

        // Plan for John Doe
        await JourneyPlan.create({
            routeName: "Nestle Morning Route",
            routeCode: "R001",
            validFrom: yesterday,
            validTo: nextWeek,
            company: nestle._id,
            warehouse: "Central WH",
            vehicle: "Van 001",
            role: "Sales Representative",
            primaryEmployee: "John Doe",
            status: "Active",
            customerIds: nestleCustomers.slice(0, 4).map(c => c.id),
            schedule: {
                frequency: "Daily",
                days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            }
        });

        // Plan for mobile test user: vansales_test01
        await JourneyPlan.create({
            routeName: "City Center Retail Route",
            routeCode: "R002",
            validFrom: yesterday,
            validTo: nextWeek,
            company: nestle._id,
            warehouse: "West WH",
            vehicle: "Van 002",
            role: "Sales Representative",
            primaryEmployee: "vansales_test01",
            status: "Active",
            customerIds: nestleCustomers.slice(4, 8).map(c => c.id),
            schedule: {
                frequency: "Daily",
                days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            }
        });

        console.log('Created sample Journey Plans for John Doe and vansales_test01');
        console.log('Seeded database with companies, customers, and plans!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
