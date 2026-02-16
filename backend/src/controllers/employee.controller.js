const attendanceModel = require('../models/attendance.model');
const {
  determineCheckInStatus,
  calculateTotalHours,
  determineCheckOutStatus,
} = require('../utils/attendance.util');

/**
 * Get today's date in UTC as YYYY-MM-DD.
 */
function getTodayDateUTC() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

async function checkIn(req, res) {
  try {
    const userId = req.user.id;
    const now = new Date();
    const date = getTodayDateUTC();

    const existing = await attendanceModel.findTodayAttendance(userId);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
      });
    }

    const status = determineCheckInStatus(now);
    const notes = req.body?.notes ?? null;
    const record = await attendanceModel.createCheckIn(userId, date, now, status, notes);

    return res.status(201).json({
      success: true,
      message: 'Check-in recorded',
      data: record,
    });
  } catch (err) {
    if (err.code === 'DUPLICATE_CHECK_IN') {
      return res.status(400).json({
        success: false,
        message: err.message || 'Already checked in for this date',
      });
    }
    throw err;
  }
}

async function checkOut(req, res) {
  const userId = req.user.id;
  const todayRecord = await attendanceModel.findTodayAttendance(userId);

  if (!todayRecord) {
    return res.status(400).json({
      success: false,
      message: 'Not checked in today',
    });
  }

  if (todayRecord.check_out_time) {
    return res.status(400).json({
      success: false,
      message: 'Already checked out',
    });
  }

  const now = new Date();
  const totalHours = calculateTotalHours(todayRecord.check_in_time, now);
  const status = determineCheckOutStatus(totalHours, todayRecord.status);
  const notes = req.body?.notes ?? todayRecord.notes ?? null;

  const updated = await attendanceModel.updateCheckOut(
    userId, todayRecord.date, now, totalHours, status, notes
  );

  return res.status(200).json({
    success: true,
    message: 'Check-out recorded',
    data: updated,
  });
}

async function getTodayAttendance(req, res) {
  const userId = req.user.id;
  const record = await attendanceModel.findTodayAttendance(userId);

  if (!record) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: { status: 'absent' },
    });
  }

  const responseData = { ...record };
  if (!record.check_out_time) {
    responseData.current_hours = calculateTotalHours(record.check_in_time, new Date());
  }

  return res.status(200).json({
    success: true,
    message: 'Success',
    data: responseData,
  });
}

async function getMyAttendance(req, res) {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  const startDate = req.query.start_date || null;
  const endDate = req.query.end_date || null;
  const status = req.query.status || null;

  const { rows, total } = await attendanceModel.findAttendanceByUser(
    userId, page, limit, startDate, endDate, status
  );

  return res.status(200).json({
    success: true,
    data: { records: rows, total, page, limit },
  });
}

async function getMonthlyAttendance(req, res) {
  const userId = req.user.id;
  const monthParam = req.query.month;
  let year, month;

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    [year, month] = monthParam.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getUTCFullYear();
    month = now.getUTCMonth() + 1;
  }

  const [summary, records] = await Promise.all([
    attendanceModel.findMonthlyStats(userId, year, month),
    attendanceModel.findAttendanceByMonth(userId, year, month),
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
  const userId = req.user.id;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  const [todayRecord, monthlyStats, monthRecords] = await Promise.all([
    attendanceModel.findTodayAttendance(userId),
    attendanceModel.findMonthlyStats(userId, year, month),
    attendanceModel.findAttendanceByMonth(userId, year, month),
  ]);

  let today;
  if (!todayRecord) {
    today = { status: 'absent' };
  } else {
    today = { ...todayRecord };
    if (!todayRecord.check_out_time) {
      today.current_hours = calculateTotalHours(todayRecord.check_in_time, new Date());
    }
  }

  const monthlySummary = {
    present_count: monthlyStats.present_count,
    late_count: monthlyStats.late_count,
    half_day_count: monthlyStats.half_day_count,
    total_hours: monthlyStats.total_hours,
  };

  const totalRecordedDays =
    monthlyStats.present_count + monthlyStats.late_count + monthlyStats.half_day_count;

  const attendancePercentage = totalRecordedDays > 0 ? 100 : 0;
  const recentAttendance = monthRecords.slice(-5).reverse();

  return res.status(200).json({
    success: true,
    data: {
      today,
      monthly_summary: monthlySummary,
      attendance_percentage: attendancePercentage,
      recent_attendance: recentAttendance,
    },
  });
}

module.exports = {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAttendance,
  getMonthlyAttendance,
  getDashboard,
};
