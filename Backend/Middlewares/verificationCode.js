// utils/verification.js
const verificationStore = require('./verificationStore');

function generateVerificationCode(email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes cooldown

  verificationStore.set(email, { code, expiresAt });
  return code;
}

function verifyCode(email, inputCode) {
  const data = verificationStore.get(email);

  if (!data) return { valid: false, message: "No code found." };
  if (Date.now() > data.expiresAt) return { valid: false, message: "Code expired." };
  if (data.code !== inputCode) return { valid: false, message: "Invalid code." };

  verificationStore.delete(email); // clear once used
  return { valid: true, message: "Code verified!" };
}

module.exports = { generateVerificationCode, verifyCode };
