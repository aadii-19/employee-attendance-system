const userModel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['employee', 'manager'];

function validateRegister(body) {
  const errors = [];
  const { email, password, full_name, role } = body || {};
  if (!email || typeof email !== 'string') errors.push('Email is required');
  else if (!EMAIL_REGEX.test(email.trim())) errors.push('Email is invalid');
  if (!password || typeof password !== 'string') errors.push('Password is required');
  else if (password.length < 6) errors.push('Password must be at least 6 characters');
  if (!full_name || typeof full_name !== 'string') errors.push('Full name is required');
  else if (full_name.trim().length < 2) errors.push('Full name must be at least 2 characters');
  if (!role || !VALID_ROLES.includes(role)) errors.push("Role must be 'employee' or 'manager'");
  return errors;
}

function validateLogin(body) {
  const errors = [];
  const { email, password } = body || {};
  if (!email || typeof email !== 'string') errors.push('Email is required');
  if (!password || typeof password !== 'string') errors.push('Password is required');
  return errors;
}

async function register(req, res) {
  const errors = validateRegister(req.body);
  if (errors.length > 0) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }

  const { email, password, full_name, role } = req.body;
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = full_name.trim();

  const existing = await userModel.findUserByEmail(trimmedEmail);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const hashed = await hashPassword(password);
  const user = await userModel.createUser(trimmedEmail, hashed, trimmedName, role);
  const token = generateToken({ id: user.id, role: user.role });

  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user, token },
  });
}

async function login(req, res) {
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors });
  }

  const { email, password } = req.body;
  const trimmedEmail = email.trim().toLowerCase();

  const user = await userModel.findUserByEmail(trimmedEmail);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken({ id: user.id, role: user.role });
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user: userWithoutPassword, token },
  });
}

async function getCurrentUser(req, res) {
  const user = await userModel.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.status(200).json({
    success: true,
    message: 'Success',
    data: { user },
  });
}

module.exports = { register, login, getCurrentUser };
