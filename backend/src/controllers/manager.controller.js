const userModel = require('../models/user.model');
const attendanceModel = require('../models/attendance.model');
const { formatTimeHHMMSS } = require('../utils/attendance.util');

/**
 * Get today's date in UTC as YYYY-MM-DD.
 */
function getTodayDateUTC() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/**
 * Format a date value as YYYY-MM-DD string (UTC) for CSV export.
 */
function formatDateForCSV(dateVal) {
  if (dateVal == null) return '';
  const d = typeof dateVal === 'string' ? new Date(dateVal + 'Z') : dateVal;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/**
 * Validate and retrieve an employee user by ID.
 * Returns the user or sends a 404 response and returns null.
 */
async function findEmployeeOrRespond(res, employeeId) {
  if (Number.isNaN(employeeId)) {
    res.status(404).json({ success: false, message: 'Employee not found' });
    return null;
  }

  const user = await userModel.findUserById(employeeId);
  if (!user || user.role !== 'employee') {
    res.status(404).json({ success: false, message: 'Employee not found' });
    return null;
  }

  return user;
}

/**
 * Parse a "YYYY-MM" month parameter, falling back to the current month.
 */
function parseMonthParam(monthParam) {
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [year, month] = monthParam.split('-').map(Number);
    return { year, month };
  }
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

/* ── Route handlers ────────────────────────────────────────────────────── */

async function getEmployees(req, res) {
  const filter = req.query.filter || null;

  if (filter === 'absent') {
    const todayStr = getTodayDateUTC();
    const [employees, todayRecords] = await Promise.all([
      userModel.getAllEmployees(),
      attendanceModel.findTodayAllAttendance(todayStr),
    ]);

    const recordedUserIds = new Set(todayRecords.map((r) => r.user_id));
    const absentEmployees = employees.filter((e) => !recordedUserIds.has(e.id));

    return res.status(200).json({
      success: true,
      data: { employees: absentEmployees },
    });
  }

  const employees = await userModel.getAllEmployees();
  return res.status(200).json({
    success: true,
    data: { employees },
  });
}

async function getEmployeeAttendance(req, res) {
  const employeeId = parseInt(req.params.id, 10);
  const employee = await findEmployeeOrRespond(res, employeeId);
  if (!employee) return;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  const startDate = req.query.start_date || null;
  const endDate = req.query.end_date || null;
  const status = req.query.status || null;

  const { rows, total } = await attendanceModel.findAttendanceByUser(
    employeeId, page, limit, startDate, endDate, status
  );

  return res.status(200).json({
    success: true,
    data: { records: rows, total, page, limit },
  });
}

async function getEmployeeMonthly(req, res) {
  const employeeId = parseInt(req.params.id, 10);
  const employee = await findEmployeeOrRespond(res, employeeId);
  if (!employee) return;

  const { year, month } = parseMonthParam(req.query.month);

  const [summary, records] = await Promise.all([
    attendanceModel.findMonthlyStats(employeeId, year, month),
    attendanceModel.findAttendanceByMonth(employeeId, year, month),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      summary: {
        present_count: summary.present_count,
        late_count: summary.late_count,
        half_day_count: summary.half_day_count,
        total_hours: summary.total_hours,
      },
      records,
    },
  });
}

async function getDashboard(req, res) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const todayStr = getTodayDateUTC();

  const [employees, todayRecords, monthlyAggregate, recentRows] = await Promise.all([
    userModel.getAllEmployees(),
    attendanceModel.findTodayAllAttendance(todayStr),
    attendanceModel.findTeamMonthlyAggregate(year, month),
    attendanceModel.findRecentAttendance(10),
  ]);

  const presentCount = todayRecords.filter((r) => r.status === 'present').length;
  const lateCount = todayRecords.filter((r) => r.status === 'late').length;
  const halfDayCount = todayRecords.filter((r) => r.status === 'half-day').length;

  /* Employees with no attendance record today are considered absent */
  const recordedUserIds = new Set(todayRecords.map((r) => r.user_id));
  const absentCount = employees.filter((e) => !recordedUserIds.has(e.id)).length;

  return res.status(200).json({
    success: true,
    data: {
      total_employees: employees.length,
      today: {
        present: presentCount,
        late: lateCount,
        half_day: halfDayCount,
        absent: absentCount,
      },
      monthly: {
        present: monthlyAggregate.present_count,
        late: monthlyAggregate.late_count,
        half_day: monthlyAggregate.half_day_count,
        total_hours: monthlyAggregate.total_hours,
      },
      recent_activity: recentRows,
    },
  });
}

async function getEmployeeExport(req, res) {
  const employeeId = parseInt(req.params.id, 10);
  const employee = await findEmployeeOrRespond(res, employeeId);
  if (!employee) return;

  const { month: monthParam } = req.query;
  let records;

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [year, month] = monthParam.split('-').map(Number);
    records = await attendanceModel.findAttendanceByMonth(employeeId, year, month);
  } else {
    records = await attendanceModel.findAllAttendanceByUser(employeeId);
  }

  const header = 'Date,Check In Time,Check Out Time,Total Hours,Status';
  const csvRows = records.map((record) => {
    const date = formatDateForCSV(record.date);
    const checkInTime = formatTimeHHMMSS(record.check_in_time);
    const checkOutTime = formatTimeHHMMSS(record.check_out_time);
    const hours = record.total_hours != null ? Number(record.total_hours) : 0;
    const status = record.status || '';
    return [date, checkInTime, checkOutTime, hours, status].join(',');
  });
  const csv = [header, ...csvRows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="attendance_${employeeId}.csv"`);
  return res.status(200).send(csv);
}

module.exports = {
  getEmployees,
  getEmployeeAttendance,
  getEmployeeMonthly,
  getDashboard,
  getEmployeeExport,
};
