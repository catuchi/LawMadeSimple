/* eslint-disable @typescript-eslint/no-require-imports, no-console */
/**
 * Generate Apple Client Secret for Sign in with Apple
 *
 * Usage:
 *   node scripts/generate-apple-secret.js
 *
 * Before running:
 *   1. Place your .p8 private key file in this directory
 *   2. Ensure the key filename matches: AuthKey_X3SFK7952L.p8
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ============================================
// APPLE DEVELOPER CREDENTIALS
// ============================================

const CONFIG = {
  // Apple Team ID (found in Apple Developer account top-right or Membership)
  teamId: '99LP9JU65Q',

  // Key ID (from Apple Developer -> Keys)
  keyId: 'X3SFK7952L',

  // Services ID identifier (from Apple Developer -> Identifiers -> Services IDs)
  // This is the "client_id" for Sign in with Apple on web
  servicesId: 'com.lawmadesimple.auth',

  // Path to .p8 private key file
  privateKeyPath: path.join(__dirname, 'AuthKey_X3SFK7952L.p8'),
};

// ============================================
// GENERATION LOGIC
// ============================================

function generateAppleClientSecret() {
  console.log('\nApple Client Secret Generator\n');
  console.log('='.repeat(50));

  // Validate config
  if (!CONFIG.teamId || CONFIG.teamId.length !== 10) {
    console.error('Error: Invalid Team ID. Must be 10 characters.');
    process.exit(1);
  }
  if (!CONFIG.keyId || CONFIG.keyId.length !== 10) {
    console.error('Error: Invalid Key ID. Must be 10 characters.');
    process.exit(1);
  }
  if (!CONFIG.servicesId) {
    console.error('Error: Services ID is required.');
    process.exit(1);
  }

  // Read private key
  let privateKey;
  try {
    privateKey = fs.readFileSync(CONFIG.privateKeyPath, 'utf8');
    console.log('Private key loaded from:', CONFIG.privateKeyPath);
  } catch (error) {
    console.error('Error reading private key file:', CONFIG.privateKeyPath);
    console.error('Make sure the .p8 file exists at this path');
    console.error('Error:', error.message);
    process.exit(1);
  }

  // Generate JWT (valid for 6 months - maximum allowed by Apple)
  const now = Math.floor(Date.now() / 1000);
  const sixMonthsInSeconds = 15777000;
  const expiry = now + sixMonthsInSeconds;

  const payload = {
    iss: CONFIG.teamId,
    iat: now,
    exp: expiry,
    aud: 'https://appleid.apple.com',
    sub: CONFIG.servicesId,
  };

  try {
    const clientSecret = jwt.sign(payload, privateKey, {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: CONFIG.keyId,
      },
    });

    const expiryDate = new Date(expiry * 1000);

    console.log('Team ID:', CONFIG.teamId);
    console.log('Key ID:', CONFIG.keyId);
    console.log('Services ID:', CONFIG.servicesId);
    console.log('Expires:', expiryDate.toLocaleDateString());
    console.log('\n' + '='.repeat(50));
    console.log('\nYOUR APPLE CLIENT SECRET (copy this to Supabase):\n');
    console.log(clientSecret);
    console.log('\n' + '='.repeat(50));
    console.log('\nThis secret expires in 6 months. Set a reminder to regenerate it!\n');
    console.log('Expiry date:', expiryDate.toISOString().split('T')[0], '\n');

    return clientSecret;
  } catch (error) {
    console.error('Error generating JWT:', error.message);
    process.exit(1);
  }
}

generateAppleClientSecret();
