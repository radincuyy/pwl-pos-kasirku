const bcrypt = require('bcryptjs');

const { pool } = require('../config/database');
const createHttpError = require('../utils/createHttpError');
const { signToken } = require('../utils/jwt');

function toUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role_name
  };
}

async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT users.id, users.name, users.email, users.password_hash, roles.name AS role_name
     FROM users
     INNER JOIN roles ON roles.id = users.role_id
     WHERE users.email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.execute(
    `SELECT users.id, users.name, users.email, roles.name AS role_name
     FROM users
     INNER JOIN roles ON roles.id = users.role_id
     WHERE users.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw createHttpError(400, 'Email dan password wajib diisi');
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(401, 'Email atau password tidak valid');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Email atau password tidak valid');
  }

  const responseUser = toUserResponse(user);
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role_name
  });

  return res.status(200).json({
    success: true,
    message: 'Login berhasil',
    data: {
      token,
      user: responseUser
    }
  });
}

async function getMe(req, res) {
  const user = await findUserById(req.user.id);

  if (!user) {
    throw createHttpError(404, 'User tidak ditemukan');
  }

  return res.status(200).json({
    success: true,
    message: 'Data user berhasil diambil',
    data: {
      user: toUserResponse(user)
    }
  });
}

function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logout berhasil'
  });
}

module.exports = {
  login,
  getMe,
  logout
};
