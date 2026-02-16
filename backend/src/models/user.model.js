const { pool } = require('../config/database');

/**
 * Create a user. Returns user without password.
 * @throws {Error} If email already exists (unique violation)
 */
async function createUser(email, hashedPassword, fullName, role) {
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at, updated_at`,
      [email, hashedPassword, fullName, role]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') {
      const duplicateError = new Error('Email already exists');
      duplicateError.code = 'DUPLICATE_EMAIL';
      throw duplicateError;
    }
    throw err;
  }
}

/**
 * Find user by email. Returns user WITH password (for login only).
 */
async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, email, password, full_name, role, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Find user by id. Returns user WITHOUT password.
 */
async function findUserById(id) {
  const result = await pool.query(
    'SELECT id, email, full_name, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Get all users with role='employee'. Excludes password.
 */
async function getAllEmployees() {
  const result = await pool.query(
    `SELECT id, email, full_name, role, created_at, updated_at
     FROM users
     WHERE role = 'employee'
     ORDER BY id`,
    []
  );
  return result.rows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllEmployees,
};
