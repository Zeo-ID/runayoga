const headers = {
  'Content-Type': 'application/json',
};

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 900; // 15 minutes in seconds
const ATTEMPT_EXPIRY = 900; // 15 minutes in seconds
const SESSION_EXPIRY = 300; // 5 minutes for MFA session
const SETUP_TOKEN_EXPIRY = 600; // 10 minutes for MFA setup

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

/** Constant-time string comparison using HMAC to prevent timing attacks */
async function timingSafeEqual(a, b) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode('timing-safe-compare-key');
  const key = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig1 = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(a)));
  const sig2 = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(b)));
  if (sig1.length !== sig2.length) return false;
  let result = 0;
  for (let i = 0; i < sig1.length; i++) {
    result |= sig1[i] ^ sig2[i];
  }
  return result === 0;
}

export async function onRequestPost(context) {
  const { env } = context;
  const kv = env.AUTH_KV;

  try {
    const body = await context.request.json();
    const password = body.password;

    const adminPassword = env.ADMIN_PASSWORD;
    const githubToken = env.GITHUB_TOKEN;

    if (!adminPassword || !githubToken) {
      return jsonResponse({ error: 'Server nicht konfiguriert' }, 500);
    }

    if (!kv) {
      return jsonResponse({ error: 'KV-Speicher nicht konfiguriert' }, 500);
    }

    // --- Rate Limiting ---
    const lockUntil = await kv.get('login_lock_until');
    if (lockUntil) {
      const lockTime = parseInt(lockUntil, 10);
      if (Date.now() < lockTime) {
        const remainingSec = Math.ceil((lockTime - Date.now()) / 1000);
        return jsonResponse(
          { error: `Zu viele Fehlversuche. Gesperrt fuer ${remainingSec} Sekunden.` },
          429
        );
      }
      // Lock expired, clean up
      await kv.delete('login_lock_until');
      await kv.delete('login_attempts');
    }

    // --- Password Check (timing-safe) ---
    const passwordCorrect = await timingSafeEqual(password || '', adminPassword);
    if (!passwordCorrect) {
      // Increment failed attempts
      const attemptsStr = await kv.get('login_attempts');
      const attempts = attemptsStr ? parseInt(attemptsStr, 10) + 1 : 1;

      if (attempts >= MAX_ATTEMPTS) {
        // Lock the account
        const lockUntilMs = Date.now() + LOCK_DURATION * 1000;
        await kv.put('login_lock_until', lockUntilMs.toString(), {
          expirationTtl: LOCK_DURATION,
        });
        await kv.delete('login_attempts');
        return jsonResponse(
          { error: `Zu viele Fehlversuche. Gesperrt fuer ${Math.floor(LOCK_DURATION / 60)} Minuten.` },
          429
        );
      }

      await kv.put('login_attempts', attempts.toString(), {
        expirationTtl: ATTEMPT_EXPIRY,
      });

      return jsonResponse({ error: 'Falsches Passwort' }, 401);
    }

    // --- Password correct: reset attempts ---
    await kv.delete('login_attempts');
    await kv.delete('login_lock_until');

    // --- Check MFA status ---
    const totpSecret = await kv.get('totp_secret');

    if (!totpSecret) {
      // MFA not set up yet - require setup
      const setupToken = crypto.randomUUID();
      await kv.put(`setup_session_${setupToken}`, 'valid', {
        expirationTtl: SETUP_TOKEN_EXPIRY,
      });

      return jsonResponse({ mfa_setup_required: true, setup_token: setupToken });
    }

    // MFA is configured - require verification
    const sessionToken = crypto.randomUUID();
    await kv.put(`mfa_session_${sessionToken}`, 'valid', {
      expirationTtl: SESSION_EXPIRY,
    });

    return jsonResponse({ mfa_required: true, session_token: sessionToken });
  } catch (e) {
    return jsonResponse({ error: 'Fehler bei der Anmeldung' }, 400);
  }
}
