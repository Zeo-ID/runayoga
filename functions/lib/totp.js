import * as OTPAuth from 'otpauth';

const ISSUER = 'Runayoga Admin';
const DIGITS = 6;
const PERIOD = 30;
const ALGORITHM = 'SHA1';

/**
 * Generates a new random Base32-encoded TOTP secret.
 * @returns {string} Base32-encoded secret
 */
export function generateSecret() {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

/**
 * Generates an otpauth:// URI for QR code enrollment.
 * @param {string} secretBase32 - Base32-encoded secret
 * @param {string} accountName - Account label (e.g. "admin")
 * @returns {string} otpauth:// URI
 */
export function generateTOTPUri(secretBase32, accountName = 'admin') {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: accountName,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
  return totp.toString();
}

/**
 * Verifies a TOTP code against a secret with +/-1 window tolerance.
 * @param {string} secretBase32 - Base32-encoded secret
 * @param {string} token - 6-digit TOTP code
 * @returns {boolean} true if valid
 */
export function verifyTOTP(secretBase32, token) {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });

  // validate returns the delta (null if invalid, number if valid)
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

/**
 * Generates random hex recovery codes.
 * @param {number} count - Number of codes to generate (default 8)
 * @returns {string[]} Array of hex recovery codes (format: xxxx-xxxx)
 */
export function generateRecoveryCodes(count = 8) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    // Format as xxxx-xxxx for readability
    codes.push(`${hex.slice(0, 4)}-${hex.slice(4, 8)}`);
  }
  return codes;
}
