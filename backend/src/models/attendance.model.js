const { pool } = require("../config/database");

/**
 * Get today's date in UTC as YYYY-MM-DD.
 */
function getTodayUTC() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/**
 * Create a check-in record.
 * @throws {Error} DUPLICATE_CHECK_IN if user already has a record for this date.
 */
async function createCheckIn(userId, date, checkInTime, status, notes) {
  try {
    const result = await pool.query(
      `INSERT INTO attendance (user_id, date, check_in_time, total_hours, status, notes)
       VALUES ($1, $2, $3, 0, $4, $5)
       RETURNING *`,
      [userId, date, checkInTime, status, notes ?? null],
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      const error = new Error("Already checked in for this date");
      error.code = "DUPLICATE_CHECK_IN";
      throw error;
    }
    throw err;
  }
}

/**
 * Update check-out for an existing attendance record.
 */
async function updateCheckOut(userId, date, checkOutTime, totalHours, status, notes) {
  const result = await pool.query(
    `UPDATE attendance
     SET check_out_time = $3, total_hours = $4, status = $5, notes = $6, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND date = $2
     RETURNING *`,
    [userId, date, checkOutTime, totalHours, status, notes ?? null],
  );
  return result.rows[0] || null;
}

/**
 * Find today's attendance record for a user (UTC date).
 */
async function findTodayAttendance(userId) {
  const today = getTodayUTC();
  const result = await pool.query(
    "SELECT * FROM attendance WHERE user_id = $1 AND date = $2",
    [userId, today],
  );
  return result.rows[0] || null;
}

/**
 * Find attendance records for a user with pagination and optional filters.
 * Supports date range and status filtering.
 * @returns {{ rows: object[], total: number }}
 */
async function findAttendanceByUser(userId, page, limit, startDate, endDate, status) {
  const params = [userId];
  const conditions = ["user_id = $1"];
  let paramIndex = 2;

  if (startDate) {
    conditions.push(`date >= $${paramIndex}`);
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    conditions.push(`date <= $${paramIndex}`);
    params.push(endDate);
    paramIndex++;
  }

  if (status) {
    conditions.push(`status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  const whereClause = conditions.join(" AND ");

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM attendance WHERE ${whereClause}`,
    params,
  );
  const total = countResult.rows[0].total;

  const offset = Math.max(0, (page - 1) * limit);
  const clampedLimit = Math.max(1, Math.min(limit, 100));
  const limitParam = params.length + 1;
  const offsetParam = params.length + 2;

  const result = await pool.query(
    `SELECT * FROM attendance
     WHERE ${whereClause}
     ORDER BY date DESC
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    [...params, clampedLimit, offset],
  );

  /* Ensure total_hours is returned as a number, not a string */
  const formattedRows = result.rows.map((row) => ({
    ...row,
    total_hours: row.total_hours !== null ? parseFloat(row.total_hours) : 0,
  }));

  return { rows: formattedRows, total };
}

/**
 * Find all attendance records for a user in a given month (UTC).
 * @param {number} year  Full year (e.g. 2026)
 * @param {number} month Month 1–12
 */
async function findAttendanceByMonth(userId, year, month) {
  const result = await pool.query(
    `SELECT * FROM attendance
     WHERE user_id = $1
       AND EXTRACT(YEAR FROM date) = $2
       AND EXTRACT(MONTH FROM date) = $3
     ORDER BY date`,
    [userId, year, month],
  );
  return result.rows;
}

/**
 * Aggregate monthly stats for a single user: status counts and total hours.
 */
async function findMonthlyStats(userId, year, month) {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'present')  AS present_count,
       COUNT(*) FILTER (WHERE status = 'late')      AS late_count,
       COUNT(*) FILTER (WHERE status = 'half-day')  AS half_day_count,
       COALESCE(SUM(total_hours), 0)::numeric       AS total_hours
     FROM attendance
     WHERE user_id = $1
       AND EXTRACT(YEAR FROM date) = $2
       AND EXTRACT(MONTH FROM date) = $3`,
    [userId, year, month],
  );
  const row = result.rows[0];
  return {
    present_count: parseInt(row.present_count, 10) || 0,
    late_count: parseInt(row.late_count, 10) || 0,
    half_day_count: parseInt(row.half_day_count, 10) || 0,
    total_hours: parseFloat(row.total_hours) || 0,
  };
}

/**
 * All attendance records for a specific date (used for team "today" view).
 */
async function findTodayAllAttendance(dateStr) {
  const result = await pool.query(
    "SELECT * FROM attendance WHERE date = $1",
    [dateStr],
  );
  return result.rows;
}

/**
 * Team-wide monthly aggregate: status counts and total hours across all employees.
 */
async function findTeamMonthlyAggregate(year, month) {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'present')  AS present_count,
       COUNT(*) FILTER (WHERE status = 'late')      AS late_count,
       COUNT(*) FILTER (WHERE status = 'half-day')  AS half_day_count,
       COALESCE(SUM(total_hours), 0)::numeric       AS total_hours
     FROM attendance
     WHERE EXTRACT(YEAR FROM date) = $1
       AND EXTRACT(MONTH FROM date) = $2`,
    [year, month],
  );
  const row = result.rows[0];
  return {
    present_count: parseInt(row.present_count, 10) || 0,
    late_count: parseInt(row.late_count, 10) || 0,
    half_day_count: parseInt(row.half_day_count, 10) || 0,
    total_hours: parseFloat(row.total_hours) || 0,
  };
}

/**
 * Most recent N attendance records with employee name (for manager activity feed).
 */
async function findRecentAttendance(limit) {
  const result = await pool.query(
    `SELECT
       a.id, a.date, a.status, a.total_hours,
       u.full_name AS employee_name
     FROM attendance a
     JOIN users u ON a.user_id = u.id
     ORDER BY a.created_at DESC
     LIMIT $1`,
    [limit],
  );
  return result.rows;
}

/**
 * All attendance records for a user ordered by date (used for CSV export).
 */
async function findAllAttendanceByUser(userId) {
  const result = await pool.query(
    "SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC",
    [userId],
  );
  return result.rows;
}

module.exports = {
  createCheckIn,
  updateCheckOut,
  findTodayAttendance,
  findAttendanceByUser,
  findAttendanceByMonth,
  findMonthlyStats,
  findTodayAllAttendance,
  findTeamMonthlyAggregate,
  findRecentAttendance,
  findAllAttendanceByUser,
};
