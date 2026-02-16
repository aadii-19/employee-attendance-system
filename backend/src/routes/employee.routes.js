const express = require('express');
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.post('/check-in', authMiddleware, roleMiddleware(['employee']), employeeController.checkIn);
router.put('/check-out', authMiddleware, roleMiddleware(['employee']), employeeController.checkOut);
router.get('/attendance/today', authMiddleware, roleMiddleware(['employee']), employeeController.getTodayAttendance);
router.get('/attendance/monthly', authMiddleware, roleMiddleware(['employee']), employeeController.getMonthlyAttendance);
router.get('/attendance', authMiddleware, roleMiddleware(['employee']), employeeController.getMyAttendance);
router.get('/dashboard', authMiddleware, roleMiddleware(['employee']), employeeController.getDashboard);

module.exports = router;
