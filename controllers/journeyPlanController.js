const JourneyPlan = require('../models/JourneyPlan');

// FMCG Companies
const COMPANIES = [
    "Nestle", "Procter & Gamble", "Unilever", "PepsiCo", "Coca-Cola",
    "Mars", "Mondelez International", "Kraft Heinz", "Danone", "General Mills",
    "Kellogg's", "Associated British Foods", "Tyson Foods", "JBS", "Archer Daniels Midland"
];

// Mock Vehicles, Warehouses, Employees as simple arrays for now
const WAREHOUSES = ["Central WH", "East WH", "West WH", "South WH"];
const VEHICLES = ["Van 001", "Truck 102", "Car 305", "Bike 204"];
const ROLES = ["Sales Representative", "Driver", "Supervisor"];
const EMPLOYEES = [
    { name: "John Doe", password: "password123" },
    { name: "Jane Smith", password: "password123" },
    { name: "Michael Brown", password: "password123" },
    { name: "Sarah Wilson", password: "password123" },
    { name: "vansales_test01", password: "password123" }
];

// Mock Customers - Moved to let so we can update in memory during session
let CUSTOMERS = [
    {
        id: 1,
        name: "Raja Variety",
        address: "123 Market St",
        type: "Supermarket",
        customerCode: "WBD00022793",
        contactNo: "8017518929",
        zone: "A Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS082] Sumit Traders",
        townName: "Durgapur",
        dealerCategory: "General Trade",
        shopCategory: "Retailers",
        visitFrequency: "Weekly",
        lastOrder: "1200.00",
        avgOrder: "1500.00"
    },
    {
        id: 2,
        name: "Dutta Variety",
        address: "456 Convenience Blvd",
        type: "Convenience Store",
        customerCode: "WBD00022794",
        contactNo: "8017518930",
        zone: "A Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS082] Sumit Traders",
        townName: "Durgapur",
        dealerCategory: "General Trade",
        shopCategory: "Retailers",
        visitFrequency: "Fortnightly",
        lastOrder: "1500.00",
        avgOrder: "1500.00"
    },
    {
        id: 3,
        name: "Puja Electronics",
        address: "789 Fresh Ave",
        type: "Supermarket",
        customerCode: "WBD00022795",
        contactNo: "8017518931",
        zone: "A Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS082] Sumit Traders",
        townName: "Durgapur",
        dealerCategory: "General Trade",
        shopCategory: "Retailers",
        visitFrequency: "Monthly",
        lastOrder: "5000.00",
        avgOrder: "4500.00"
    },
    {
        id: 4,
        name: "Bhola Variety",
        address: "101 Bulls Eye Dr",
        type: "Department Store",
        customerCode: "WBD00022798",
        contactNo: "8017518932",
        zone: "A Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS082] Sumit Traders",
        townName: "Durgapur",
        dealerCategory: "General Trade",
        shopCategory: "Retailers",
        visitFrequency: "Weekly",
        lastOrder: "800.00",
        avgOrder: "1000.00"
    },
    {
        id: 5,
        name: "Kroger",
        address: "202 Grocery Ln",
        type: "Supermarket",
        customerCode: "WBD00022799",
        contactNo: "8017518933",
        zone: "B Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS085] Metro Mart",
        townName: "Asansol",
        dealerCategory: "Modern Trade",
        shopCategory: "Supermarket",
        visitFrequency: "Daily",
        lastOrder: "15000.00",
        avgOrder: "12000.00"
    },
    {
        id: 6,
        name: "Aldi",
        address: "303 Budget St",
        type: "Discount Store",
        customerCode: "WBD00022800",
        contactNo: "8017518934",
        zone: "B Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS085] Metro Mart",
        townName: "Asansol",
        dealerCategory: "Modern Trade",
        shopCategory: "Discount Store",
        visitFrequency: "Weekly",
        lastOrder: "7000.00",
        avgOrder: "6500.00"
    },
    {
        id: 7,
        name: "Costco",
        address: "404 Wholesale Way",
        type: "Wholesale Club",
        customerCode: "WBD00022801",
        contactNo: "8017518935",
        zone: "C Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS090] Quality Bulk",
        townName: "Raniganj",
        dealerCategory: "Wholesale",
        shopCategory: "Wholesale Club",
        visitFrequency: "Monthly",
        lastOrder: "50000.00",
        avgOrder: "45000.00"
    },
    {
        id: 8,
        name: "Trader Joe's",
        address: "505 Organic Rd",
        type: "Supermarket",
        customerCode: "WBD00022802",
        contactNo: "8017518936",
        zone: "C Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS090] Quality Bulk",
        townName: "Raniganj",
        dealerCategory: "Modern Trade",
        shopCategory: "Supermarket",
        visitFrequency: "Weekly",
        lastOrder: "3500.00",
        avgOrder: "4000.00"
    },
    {
        id: 9,
        name: "Safeway",
        address: "606 Safe St",
        type: "Supermarket",
        customerCode: "WBD00022803",
        contactNo: "8017518937",
        zone: "D Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS102] Reliable Dist",
        townName: "Bankura",
        dealerCategory: "General Trade",
        shopCategory: "Retailers",
        visitFrequency: "Bi-Weekly",
        lastOrder: "2200.00",
        avgOrder: "2000.00"
    },
    {
        id: 10,
        name: "Publix",
        address: "707 Public Pl",
        type: "Supermarket",
        customerCode: "WBD00022804",
        contactNo: "8017518938",
        zone: "D Zone",
        visited: false,
        salesAmount: 0,
        stockistName: "[WBS102] Reliable Dist",
        townName: "Bankura",
        dealerCategory: "Modern Trade",
        shopCategory: "Supermarket",
        visitFrequency: "Weekly",
        lastOrder: "4500.00",
        avgOrder: "4200.00"
    }
];

exports.getOptions = async (req, res) => {
    try {
        res.json({
            companies: COMPANIES,
            warehouses: WAREHOUSES,
            vehicles: VEHICLES,
            roles: ROLES,
            employees: EMPLOYEES.map(e => e.name)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const employee = EMPLOYEES.find(e => e.name === username && e.password === password);
        if (employee) {
            res.json({
                id: '1', // In real app use employee id
                username: employee.name,
                role: 'Sales Representative',
                primaryEmployeeName: employee.name
            });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        // In a real app, fetch from database. For now return mock.
        res.json(CUSTOMERS);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createJourneyPlan = async (req, res) => {
    try {
        const { customerIds } = req.body;

        // Reset the visited status for allocated customers in memory
        // so they show up as 'Pending' in the mobile app for the new plan
        if (customerIds && Array.isArray(customerIds)) {
            customerIds.forEach(id => {
                const index = CUSTOMERS.findIndex(c => c.id.toString() === id.toString());
                if (index !== -1) {
                    CUSTOMERS[index].visited = false;
                    CUSTOMERS[index].salesAmount = 0;
                    CUSTOMERS[index].visitCompleted = false;
                }
            });
        }

        const newPlan = new JourneyPlan(req.body);
        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getJourneyPlans = async (req, res) => {
    try {
        const plans = await JourneyPlan.find();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCustomerVisit = async (req, res) => {
    const { id } = req.params;
    const { visited, salesAmount, visitCompleted } = req.body;
    try {
        const index = CUSTOMERS.findIndex(c => c.id.toString() === id.toString());
        if (index !== -1) {
            CUSTOMERS[index] = { ...CUSTOMERS[index], visited, salesAmount, visitCompleted };
            res.json(CUSTOMERS[index]);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
