/**
 * Attendance status and time utilities. All date/time logic uses UTC.
 */

const CUTOFF_HOUR_UTC = 9;
const FULL_DAY_HOURS = 5;

/**
 * Determine check-in status from check-in time (UTC).
 * Before 09:00 UTC = 'present', at or after 09:00 UTC = 'late'.
 * @param {Date|string|number} checkInTime - Check-in timestamp
 * @returns {'present'|'late'}
 */
function determineCheckInStatus(checkInTime) {
  const date = checkInTime instanceof Date ? checkInTime : new Date(checkInTime);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  if (hours < CUTOFF_HOUR_UTC) return 'present';
  if (hours > CUTOFF_HOUR_UTC) return 'late';
  if (minutes > 0 || seconds > 0) return 'late';
  return 'late'; // exactly 09:00:00 = late
}

/**
 * Calculate total hours between check-in and check-out in decimal hours (2 decimals).
 * @param {Date|string|number} checkIn - Check-in timestamp
 * @param {Date|string|number} checkOut - Check-out timestamp
 * @returns {number} Decimal hours
 */
function calculateTotalHours(checkIn, checkOut) {
  const start = checkIn instanceof Date ? checkIn : new Date(checkIn);
  const end = checkOut instanceof Date ? checkOut : new Date(checkOut);
  const ms = end.getTime() - start.getTime();
  const hours = ms / (1000 * 60 * 60);
  return Math.round(hours * 100) / 100;
}

/**
 * Determine final status on check-out.
 * If totalHours < 5 return 'half-day', else return currentStatus.
 * @param {number} totalHours - Total worked hours
 * @param {string} currentStatus - Status from check-in ('present' or 'late')
 * @returns {'present'|'late'|'half-day'}
 */
function determineCheckOutStatus(totalHours, currentStatus) {
  if (totalHours < FULL_DAY_HOURS) return 'half-day';
  return currentStatus;
}

/**
 * Format a date as UTC HH:MM:SS for CSV. Returns empty string if null/undefined.
 * @param {Date|string|number|null|undefined} date - Timestamp
 * @returns {string} "HH:MM:SS" or ""
 */
function formatTimeHHMMSS(date) {
  if (date == null) return '';
  const d = date instanceof Date ? date : new Date(date);
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const seconds = d.getUTCSeconds();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

module.exports = {
  determineCheckInStatus,
  calculateTotalHours,
  determineCheckOutStatus,
  formatTimeHHMMSS,
};
