require('dotenv').config();

const { generateToken, verifyToken } = require('./src/utils/jwt.util');
const { hashPassword, comparePassword } = require('./src/utils/password.util');
const {
  determineCheckInStatus,
  calculateTotalHours,
  determineCheckOutStatus,
  formatTimeHHMMSS
} = require('./src/utils/attendance.util');

(async () => {
  console.log("===== JWT TEST =====");
  const token = generateToken({ id: 1, role: 'employee' });
  console.log("Generated Token:", token);

  const decoded = verifyToken(token);
  console.log("Decoded Payload:", decoded);

  try {
    verifyToken(token + "tampered");
  } catch (err) {
    console.log("Invalid token correctly rejected");
  }

  console.log("\n===== PASSWORD TEST =====");
  const hash = await hashPassword("password123");
  console.log("Hashed Password:", hash);

  const match = await comparePassword("password123", hash);
  console.log("Correct password match:", match);

  const wrongMatch = await comparePassword("wrongpass", hash);
  console.log("Wrong password match:", wrongMatch);

  console.log("\n===== CHECK-IN STATUS TEST =====");
  console.log("08:59:59 →", determineCheckInStatus(new Date('2026-02-16T08:59:59Z')));
  console.log("09:00:00 →", determineCheckInStatus(new Date('2026-02-16T09:00:00Z')));

  console.log("\n===== TOTAL HOURS TEST =====");
  const checkIn = new Date('2026-02-16T09:00:00Z');
  const checkOut = new Date('2026-02-16T17:00:00Z');
  const hours = calculateTotalHours(checkIn, checkOut);
  console.log("8 hour shift:", hours);

  console.log("\n===== HALF-DAY LOGIC TEST =====");
  console.log("4.9 hours →", determineCheckOutStatus(4.9, "present"));
  console.log("5 hours →", determineCheckOutStatus(5, "present"));

  console.log("\n===== FORMAT TIME TEST =====");
  console.log("Formatted time:", formatTimeHHMMSS(new Date('2026-02-16T09:05:03Z')));
})();
