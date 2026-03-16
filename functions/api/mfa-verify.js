import { verifyTOTP } from '../lib/totp.js';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

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

    // Get TOTP secret
    const totpSecret = await kv.get('totp_secret');
    if (!totpSecret) {
      return jsonResponse({ error: 'MFA nicht konfiguriert' }, 500);
    }

    // --- Try TOTP code first ---
    const isTOTPValid = verifyTOTP(totpSecret, code);

    if (isTOTPValid) {
      // Clean up session
      await kv.delete(`mfa_session_${session_token}`);
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

        // Clean up session
        await kv.delete(`mfa_session_${session_token}`);

        return jsonResponse({
          token: githubToken,
          recovery_code_used: true,
          remaining: recoveryCodes.length,
        });
      }
    }

    // Neither TOTP nor recovery code matched
    return jsonResponse({ error: 'Ungueltiger Verifizierungscode' }, 401);
  } catch (e) {
    return jsonResponse({ error: 'Fehler bei der MFA-Verifizierung' }, 400);
  }
}
