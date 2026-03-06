const express = require('express');
const router = express.Router();
const controller = require('../controllers/journeyPlanController');

router.get('/options', controller.getOptions);
router.get('/customers', controller.getCustomers);
router.post('/', controller.createJourneyPlan);
router.get('/', controller.getJourneyPlans);
router.post('/login', controller.login);
router.get('/:id', controller.getJourneyPlanById);
router.patch('/customers/:id', controller.updateCustomerVisit);

module.exports = router;
