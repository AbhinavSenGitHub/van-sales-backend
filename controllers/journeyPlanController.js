const JourneyPlan = require('../models/JourneyPlan');
const Company = require('../models/Company');
const Customer = require('../models/Customer');

// Production constants
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

/**
 * Get dropdown options for creating a journey plan
 */
exports.getOptions = async (req, res) => {
    try {
        const dbCompanies = await Company.find({}, 'name').sort({ name: 1 }).lean();
        res.json({
            companies: dbCompanies.map(c => ({ id: c._id, name: c.name })),
            warehouses: WAREHOUSES,
            vehicles: VEHICLES,
            roles: ROLES,
            employees: EMPLOYEES.map(e => e.name)
        });
    } catch (err) {
        console.error('Error in getOptions:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch options' });
    }
};

/**
 * Simple login for field employees
 * Note: Use proper hashing and separate User model in production
 */
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const employee = EMPLOYEES.find(e => e.name === username && e.password === password);
        if (employee) {
            res.json({
                status: 'success',
                user: {
                    id: '1',
                    username: employee.name,
                    role: 'Sales Representative',
                    primaryEmployeeName: employee.name
                }
            });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

/**
 * Get customers filtered by company
 */
exports.getCustomers = async (req, res) => {
    try {
        const { companyId } = req.query;
        let query = {};
        if (companyId) {
            query.company = companyId;
        }

        // Optimize: Use projection and lean()
        const customers = await Customer.find(query)
            .populate('company', 'name')
            .lean();

        res.json(customers);
    } catch (err) {
        console.error('Error in getCustomers:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch customers' });
    }
};

/**
 * Create a new journey plan and reset customer status
 */
exports.createJourneyPlan = async (req, res) => {
    try {
        const { customerIds, company } = req.body;

        if (!customerIds || !Array.isArray(customerIds)) {
            return res.status(400).json({ status: 'error', message: 'Customer IDs are required' });
        }

        // Optimized batch update
        await Customer.updateMany(
            { id: { $in: customerIds } },
            {
                $set: {
                    visited: false,
                    salesAmount: 0,
                    visitCompleted: false,
                    updatedAt: new Date()
                }
            }
        ).lean();

        const newPlan = new JourneyPlan(req.body);
        const savedPlan = await newPlan.save();

        res.status(201).json({ status: 'success', data: savedPlan });
    } catch (err) {
        console.error('Error in createJourneyPlan:', err);
        res.status(400).json({ status: 'error', message: err.message });
    }
};

/**
 * Get all journey plans
 */
exports.getJourneyPlans = async (req, res) => {
    try {
        const plans = await JourneyPlan.find()
            .populate('company', 'name')
            .sort({ createdAt: -1 })
            .lean();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch plans' });
    }
};

/**
 * Record a customer visit outcome
 */
exports.updateCustomerVisit = async (req, res) => {
    const { id } = req.params;
    const { visited, salesAmount, visitCompleted } = req.body;

    try {
        const customer = await Customer.findOneAndUpdate(
            { id: parseInt(id) },
            {
                $set: {
                    visited: visited ?? true,
                    salesAmount: salesAmount || 0,
                    visitCompleted: visitCompleted ?? true
                }
            },
            { new: true, lean: true }
        );

        if (!customer) {
            return res.status(404).json({ status: 'error', message: 'Customer not found' });
        }

        res.json({ status: 'success', data: customer });
    } catch (err) {
        console.error('Error in updateCustomerVisit:', err);
        res.status(500).json({ status: 'error', message: 'Failed to update visit' });
    }
};
