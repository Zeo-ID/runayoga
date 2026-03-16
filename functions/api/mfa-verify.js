import { verifyTOTP } from '../lib/totp.js';

const headers = {
  'Content-Type': 'application/json',
};

const MAX_MFA_ATTEMPTS = 5;
const MFA_LOCK_DURATION = 900; // 15 minutes

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

export async function onRequestPost(context) {
  const { env } = context;
  const kv = env.AUTH_KV;
  const githubToken = env.GITHUB_TOKEN;

  try {
    if (!kv) {
      return jsonResponse({ error: 'KV-Speicher nicht konfiguriert' }, 500);
    }

    if (!githubToken) {
      return jsonResponse({ error: 'Server nicht konfiguriert' }, 500);
    }

    const body = await context.request.json();
    const { session_token, code } = body;

    if (!session_token) {
      return jsonResponse({ error: 'Session-Token fehlt' }, 400);
    }

    if (!code) {
      return jsonResponse({ error: 'Verifizierungscode fehlt' }, 400);
    }

    // Validate session token
    const sessionValid = await kv.get(`mfa_session_${session_token}`);
    if (!sessionValid) {
      return jsonResponse({ error: 'Ungueltige oder abgelaufene Sitzung' }, 401);
    }

    // --- Rate Limiting on MFA attempts ---
    const lockKey = `mfa_lock_${session_token}`;
    const attemptsKey = `mfa_attempts_${session_token}`;

    const mfaLockUntil = await kv.get(lockKey);
    if (mfaLockUntil) {
      const lockTime = parseInt(mfaLockUntil, 10);
      if (Date.now() < lockTime) {
        const remainingSec = Math.ceil((lockTime - Date.now()) / 1000);
        return jsonResponse(
          { error: `Zu viele Fehlversuche. Gesperrt fuer ${remainingSec} Sekunden.` },
          429
        );
      }
      await kv.delete(lockKey);
      await kv.delete(attemptsKey);
    }

    // Get TOTP secret
    const totpSecret = await kv.get('totp_secret');
    if (!totpSecret) {
      return jsonResponse({ error: 'MFA nicht konfiguriert' }, 500);
    }

    // --- Try TOTP code first ---
    const isTOTPValid = verifyTOTP(totpSecret, code);

    if (isTOTPValid) {
      // Clean up session + attempts
      await kv.delete(`mfa_session_${session_token}`);
      await kv.delete(attemptsKey);
      await kv.delete(lockKey);
      return jsonResponse({ token: githubToken });
    }

    // --- Try as recovery code (case-insensitive) ---
    const recoveryCodesJson = await kv.get('recovery_codes');
    if (recoveryCodesJson) {
      const recoveryCodes = JSON.parse(recoveryCodesJson);
      const normalizedInput = code.trim().toLowerCase();

      const matchIndex = recoveryCodes.findIndex(
        (rc) => rc.toLowerCase() === normalizedInput
      );

      if (matchIndex !== -1) {
        // Remove used recovery code
        recoveryCodes.splice(matchIndex, 1);
        await kv.put('recovery_codes', JSON.stringify(recoveryCodes));

        // Clean up session + attempts
        await kv.delete(`mfa_session_${session_token}`);
        await kv.delete(attemptsKey);
        await kv.delete(lockKey);

        return jsonResponse({
          token: githubToken,
          recovery_code_used: true,
          remaining: recoveryCodes.length,
        });
      }
    }

    // --- Neither matched: increment failed attempts ---
    const attemptsStr = await kv.get(attemptsKey);
    const attempts = attemptsStr ? parseInt(attemptsStr, 10) + 1 : 1;

    if (attempts >= MAX_MFA_ATTEMPTS) {
      const lockUntilMs = Date.now() + MFA_LOCK_DURATION * 1000;
      await kv.put(lockKey, lockUntilMs.toString(), {
        expirationTtl: MFA_LOCK_DURATION,
      });
      await kv.delete(attemptsKey);
      // Invalidate the MFA session
      await kv.delete(`mfa_session_${session_token}`);
      return jsonResponse(
        { error: `Zu viele Fehlversuche. Gesperrt fuer ${Math.floor(MFA_LOCK_DURATION / 60)} Minuten.` },
        429
      );
    }

    await kv.put(attemptsKey, attempts.toString(), {
      expirationTtl: MFA_LOCK_DURATION,
    });

    return jsonResponse({ error: 'Ungueltiger Verifizierungscode' }, 401);
  } catch (e) {
    return jsonResponse({ error: 'Fehler bei der MFA-Verifizierung' }, 400);
  }
}
