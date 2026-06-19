require('dotenv').config();

const bcrypt = require('bcryptjs');

const { pool } = require('../src/config/database');

function readRequiredEnvironment(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} wajib diisi`);
  }

  return value;
}

function validateAdminInput(email, password) {
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('ADMIN_EMAIL harus berupa alamat email yang valid');
  }

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD minimal 12 karakter');
  }
}

async function createAdmin() {
  const name = readRequiredEnvironment('ADMIN_NAME');
  const email = readRequiredEnvironment('ADMIN_EMAIL').toLowerCase();
  const password = readRequiredEnvironment('ADMIN_PASSWORD');
  validateAdminInput(email, password);

  await pool.execute(
    `INSERT INTO roles (name)
     VALUES ('admin'), ('kasir'), ('owner')
     ON DUPLICATE KEY UPDATE name = VALUES(name)`
  );

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.execute(
    `INSERT INTO users (role_id, name, email, password_hash)
     SELECT roles.id, ?, ?, ?
     FROM roles
     WHERE roles.name = 'admin'
     ON DUPLICATE KEY UPDATE
       role_id = VALUES(role_id),
       name = VALUES(name),
       password_hash = VALUES(password_hash)`,
    [name, email, passwordHash]
  );

  console.log('Admin production berhasil dibuat atau diperbarui', { email });
}

createAdmin()
  .catch((error) => {
    console.error('Gagal membuat admin production', {
      message: error.message
    });
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
