const express = require('express');
const managerController = require('../controllers/manager.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/employees', authMiddleware, roleMiddleware(['manager']), managerController.getEmployees);
router.get('/employees/:id/attendance', authMiddleware, roleMiddleware(['manager']), managerController.getEmployeeAttendance);
router.get('/employees/:id/monthly', authMiddleware, roleMiddleware(['manager']), managerController.getEmployeeMonthly);
router.get('/employees/:id/export', authMiddleware, roleMiddleware(['manager']), managerController.getEmployeeExport);
router.get('/dashboard', authMiddleware, roleMiddleware(['manager']), managerController.getDashboard);

module.exports = router;
