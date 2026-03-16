import { generateSecret, generateTOTPUri, verifyTOTP, generateRecoveryCodes } from '../lib/totp.js';

const headers = {
  'Content-Type': 'application/json',
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
    const { action, setup_token } = body;

    if (!setup_token) {
      return jsonResponse({ error: 'Setup-Token fehlt' }, 400);
    }

    // Validate setup token
    const sessionValid = await kv.get(`setup_session_${setup_token}`);
    if (!sessionValid) {
      return jsonResponse({ error: 'Ungueltige oder abgelaufene Setup-Sitzung' }, 401);
    }

    // --- Action: generate ---
    if (action === 'generate') {
      const secret = generateSecret();
      const uri = generateTOTPUri(secret, 'admin');

      // Store pending secret tied to this setup session
      await kv.put(`pending_totp_secret_${setup_token}`, secret, {
        expirationTtl: 600, // 10 minutes
      });

      return jsonResponse({ uri });
    }

    // --- Action: verify ---
    if (action === 'verify') {
      const { code } = body;

      if (!code) {
        return jsonResponse({ error: 'TOTP-Code fehlt' }, 400);
      }

      // Get pending secret
      const pendingSecret = await kv.get(`pending_totp_secret_${setup_token}`);
      if (!pendingSecret) {
        return jsonResponse(
          { error: 'Kein ausstehender TOTP-Schluessel. Bitte zuerst generieren.' },
          400
        );
      }

      // Verify the TOTP code
      const isValid = verifyTOTP(pendingSecret, code);
      if (!isValid) {
        return jsonResponse({ error: 'Ungueltiger TOTP-Code' }, 401);
      }

      // Save TOTP secret permanently in KV
      await kv.put('totp_secret', pendingSecret);

      // Generate and save recovery codes
      const recoveryCodes = generateRecoveryCodes(8);
      await kv.put('recovery_codes', JSON.stringify(recoveryCodes));

      // Clean up setup session and pending secret
      await kv.delete(`setup_session_${setup_token}`);
      await kv.delete(`pending_totp_secret_${setup_token}`);

      return jsonResponse({
        token: githubToken,
        recovery_codes: recoveryCodes,
      });
    }

    return jsonResponse({ error: 'Ungueltige Aktion. Erlaubt: generate, verify' }, 400);
  } catch (e) {
    return jsonResponse({ error: 'Fehler beim MFA-Setup' }, 400);
  }
}
