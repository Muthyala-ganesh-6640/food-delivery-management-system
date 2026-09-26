const jwt = require('jsonwebtoken');

const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'foodexpress_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  return token;
};

module.exports = generateToken;
