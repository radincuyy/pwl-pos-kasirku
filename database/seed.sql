-- Default admin login:
-- email: admin@kasirku.test
-- password: Admin12345

USE pwl_pos;

INSERT INTO roles (name)
VALUES ('admin'), ('kasir'), ('owner')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (role_id, name, email, password_hash)
SELECT roles.id, 'Administrator', 'admin@kasirku.test', '$2b$10$ocZtjmgeczegEDF4PRbOK.l7Oj1Qnzxt5z7c.qLympyVTNpisoa3O'
FROM roles
WHERE roles.name = 'admin'
ON DUPLICATE KEY UPDATE
  role_id = VALUES(role_id),
  name = VALUES(name),
  password_hash = VALUES(password_hash);
