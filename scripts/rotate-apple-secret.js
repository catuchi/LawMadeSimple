/* eslint-disable @typescript-eslint/no-require-imports, no-console */
/**
 * Rotate Apple Client Secret and Update Supabase
 *
 * This script:
 * 1. Generates a new Apple client secret (JWT)
 * 2. Updates Supabase Auth configuration via Management API
 *
 * Usage:
 *   node scripts/rotate-apple-secret.js
 *
 * Required environment variables:
 *   APPLE_TEAM_ID        - Your Apple Team ID (10 characters)
 *   APPLE_KEY_ID         - Your Apple Key ID (10 characters)
 *   APPLE_SERVICES_ID    - Your Apple Services ID (client_id)
 *   APPLE_PRIVATE_KEY    - Your .p8 private key content (with newlines)
 *   SUPABASE_ACCESS_TOKEN - Supabase Management API access token
 *   SUPABASE_PROJECT_REF  - Supabase project reference ID
 */

const jwt = require('jsonwebtoken');

// ============================================
// CONFIGURATION (from environment variables)
// ============================================

const CONFIG = {
  apple: {
    teamId: process.env.APPLE_TEAM_ID,
    keyId: process.env.APPLE_KEY_ID,
    servicesId: process.env.APPLE_SERVICES_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY,
  },
  supabase: {
    accessToken: process.env.SUPABASE_ACCESS_TOKEN,
    projectRef: process.env.SUPABASE_PROJECT_REF,
  },
};

// ============================================
// FUNCTIONS
// ============================================

function validateConfig() {
  const errors = [];

  if (!CONFIG.apple.teamId || CONFIG.apple.teamId.length !== 10) {
    errors.push('APPLE_TEAM_ID must be 10 characters');
  }
  if (!CONFIG.apple.keyId || CONFIG.apple.keyId.length !== 10) {
    errors.push('APPLE_KEY_ID must be 10 characters');
  }
  if (!CONFIG.apple.servicesId) {
    errors.push('APPLE_SERVICES_ID is required');
  }
  if (!CONFIG.apple.privateKey) {
    errors.push('APPLE_PRIVATE_KEY is required');
  }
  if (!CONFIG.supabase.accessToken) {
    errors.push('SUPABASE_ACCESS_TOKEN is required');
  }
  if (!CONFIG.supabase.projectRef) {
    errors.push('SUPABASE_PROJECT_REF is required');
  }

  if (errors.length > 0) {
    console.error('Configuration errors:');
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }
}

function generateAppleClientSecret() {
  const now = Math.floor(Date.now() / 1000);
  const sixMonthsInSeconds = 15777000;
  const expiry = now + sixMonthsInSeconds;

  const payload = {
    iss: CONFIG.apple.teamId,
    iat: now,
    exp: expiry,
    aud: 'https://appleid.apple.com',
    sub: CONFIG.apple.servicesId,
  };

  const clientSecret = jwt.sign(payload, CONFIG.apple.privateKey, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: CONFIG.apple.keyId,
    },
  });

  return { clientSecret, expiry };
}

async function updateSupabaseAppleSecret(clientSecret) {
  const url = `https://api.supabase.com/v1/projects/${CONFIG.supabase.projectRef}/config/auth`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${CONFIG.supabase.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      EXTERNAL_APPLE_SECRET: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('Apple Client Secret Rotation\n');
  console.log('='.repeat(50));

  // Validate configuration
  validateConfig();
  console.log('Configuration validated');

  // Generate new Apple client secret
  console.log('Generating new Apple client secret...');
  const { clientSecret, expiry } = generateAppleClientSecret();
  const expiryDate = new Date(expiry * 1000);
  console.log(`Generated secret expiring: ${expiryDate.toISOString().split('T')[0]}`);

  // Update Supabase
  console.log('Updating Supabase auth configuration...');
  await updateSupabaseAppleSecret(clientSecret);
  console.log('Supabase updated successfully');

  console.log('\n' + '='.repeat(50));
  console.log('Apple client secret rotated successfully!');
  console.log(`New expiry: ${expiryDate.toISOString().split('T')[0]}`);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
