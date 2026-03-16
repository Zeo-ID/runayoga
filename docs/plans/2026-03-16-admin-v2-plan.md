# Runayoga Admin v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the runayoga admin panel with TOTP MFA login, visual inline-editing with styled previews, and a theme preset + color picker system.

**Architecture:** The admin panel (`public/admin/index.html`) stays as a single-page app communicating with GitHub API. New CF Pages Functions handle TOTP auth via Cloudflare KV. Preview templates render content with the same CSS as the live site. Theme colors are stored in `site.md` frontmatter and applied as CSS custom properties at build time.

**Tech Stack:** Astro 6 (SSG), Cloudflare Pages Functions, Cloudflare KV, `otpauth` (TOTP), Vanilla JS (admin), CSS Custom Properties (theming)

**Repo:** `/home/moe/runayoga`, GitHub: `Zeo-ID/runayoga`, Branch: `main`

**Key files to know:**
- `public/admin/index.html` — Admin SPA (~2250 lines, JS+HTML+CSS in one file)
- `functions/api/auth.js` — Password auth endpoint (returns GitHub token)
- `functions/api/deploy.js` — CF Pages deploy hook trigger
- `src/content/site.md` — Site-wide data (name, email, phone, hours)
- `src/content/home.md` — Homepage content (hero, services, testimonials, etc.)
- `src/layouts/BaseLayout.astro` — HTML shell with CSS vars from `public/css/styles.css`
- `src/lib/content.ts` — `getContent()` and `getCollection()` helpers
- `public/css/styles.css` — All site CSS, uses CSS custom properties (`:root` vars at line 8-25)
- `public/_headers` — CSP and security headers for CF Pages

---

## Task 1: TOTP MFA — Backend (CF Pages Functions + KV)

**Files:**
- Create: `functions/api/mfa-setup.js`
- Create: `functions/api/mfa-verify.js`
- Modify: `functions/api/auth.js`
- Create: `public/admin/otpauth.min.js` (bundled TOTP library)

**Context:** Currently `auth.js` checks password against `ADMIN_PASSWORD` env var and returns `GITHUB_TOKEN` directly. We need a 2-step flow: password → TOTP. Cloudflare KV stores the TOTP secret and recovery codes. The KV namespace `RUNAYOGA_AUTH` must be created in CF dashboard and bound in `wrangler.toml` or CF Pages settings as `AUTH_KV`.

**Step 1: Bundle otpauth library for CF Workers**

Download and bundle `otpauth` for use in CF Pages Functions. The library needs to work in Workers runtime (no Node.js APIs).

```bash
cd /home/moe/runayoga
npm install otpauth
```

Create a minimal ESM re-export for use in Functions:

Create `functions/lib/totp.js`:
```js
import { TOTP, Secret } from 'otpauth';

export function generateSecret() {
  const secret = new Secret({ size: 20 });
  return secret.base32;
}

export function generateTOTPUri(secret, accountName) {
  const totp = new TOTP({
    issuer: 'Runayoga Admin',
    label: accountName || 'admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
  return totp.toString();
}

export function verifyTOTP(secret, token) {
  const totp = new TOTP({
    issuer: 'Runayoga Admin',
    label: 'admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
  // Allow 1 period window (±30s)
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

export function generateRecoveryCodes(count = 8) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(4));
    const code = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    codes.push(code.toUpperCase());
  }
  return codes;
}
```

**Step 2: Modify `functions/api/auth.js`**

Replace the current auth.js with a 2-step flow:

```js
export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await context.request.json();
    const password = body.password;

    const adminPassword = context.env.ADMIN_PASSWORD;
    const githubToken = context.env.GITHUB_TOKEN;
    const kv = context.env.AUTH_KV;

    if (!adminPassword || !githubToken) {
      return new Response(JSON.stringify({ error: 'Server nicht konfiguriert' }), {
        status: 500, headers
      });
    }

    if (password !== adminPassword) {
      // Rate limiting via KV
      const attempts = parseInt(await kv.get('login_attempts') || '0');
      const lockUntil = await kv.get('login_lock_until');
      if (lockUntil && Date.now() < parseInt(lockUntil)) {
        const mins = Math.ceil((parseInt(lockUntil) - Date.now()) / 60000);
        return new Response(JSON.stringify({ error: `Zu viele Versuche. Bitte ${mins} Min. warten.` }), {
          status: 429, headers
        });
      }
      await kv.put('login_attempts', String(attempts + 1), { expirationTtl: 900 });
      if (attempts + 1 >= 5) {
        await kv.put('login_lock_until', String(Date.now() + 15 * 60 * 1000), { expirationTtl: 900 });
      }
      return new Response(JSON.stringify({ error: 'Falsches Passwort' }), {
        status: 401, headers
      });
    }

    // Password correct — reset attempts
    await kv.delete('login_attempts');
    await kv.delete('login_lock_until');

    // Check if TOTP is set up
    const totpSecret = await kv.get('totp_secret');

    if (!totpSecret) {
      // First-time setup needed — generate session token
      const sessionToken = crypto.randomUUID();
      await kv.put('setup_session_' + sessionToken, 'valid', { expirationTtl: 600 });
      return new Response(JSON.stringify({ mfa_setup_required: true, setup_token: sessionToken }), {
        status: 200, headers
      });
    }

    // TOTP exists — require verification
    const sessionToken = crypto.randomUUID();
    await kv.put('mfa_session_' + sessionToken, 'valid', { expirationTtl: 300 });
    return new Response(JSON.stringify({ mfa_required: true, session_token: sessionToken }), {
      status: 200, headers
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fehler bei der Anmeldung' }), {
      status: 400, headers
    });
  }
}
```

**Step 3: Create `functions/api/mfa-setup.js`**

```js
import { generateSecret, generateTOTPUri, verifyTOTP, generateRecoveryCodes } from '../lib/totp.js';

export async function onRequestPost(context) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await context.request.json();
    const kv = context.env.AUTH_KV;

    // Phase 1: Generate QR code data
    if (body.action === 'generate') {
      const setupToken = body.setup_token;
      const valid = await kv.get('setup_session_' + setupToken);
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Sitzung abgelaufen' }), { status: 401, headers });
      }

      const secret = generateSecret();
      const uri = generateTOTPUri(secret, 'admin@runayoga');
      // Store temporarily for verification
      await kv.put('pending_totp_secret_' + setupToken, secret, { expirationTtl: 600 });

      return new Response(JSON.stringify({ secret, uri }), { status: 200, headers });
    }

    // Phase 2: Verify code and finalize setup
    if (body.action === 'verify') {
      const setupToken = body.setup_token;
      const code = body.code;
      const secret = await kv.get('pending_totp_secret_' + setupToken);
      if (!secret) {
        return new Response(JSON.stringify({ error: 'Sitzung abgelaufen' }), { status: 401, headers });
      }

      if (!verifyTOTP(secret, code)) {
        return new Response(JSON.stringify({ error: 'Falscher Code' }), { status: 400, headers });
      }

      // Save secret permanently
      await kv.put('totp_secret', secret);
      // Generate recovery codes
      const recoveryCodes = generateRecoveryCodes(8);
      await kv.put('recovery_codes', JSON.stringify(recoveryCodes));
      // Clean up setup session
      await kv.delete('setup_session_' + setupToken);
      await kv.delete('pending_totp_secret_' + setupToken);

      // Return token + recovery codes
      const githubToken = context.env.GITHUB_TOKEN;
      return new Response(JSON.stringify({ token: githubToken, recovery_codes: recoveryCodes }), {
        status: 200, headers
      });
    }

    return new Response(JSON.stringify({ error: 'Unbekannte Aktion' }), { status: 400, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'MFA-Setup fehlgeschlagen' }), { status: 500, headers });
  }
}
```

**Step 4: Create `functions/api/mfa-verify.js`**

```js
import { verifyTOTP } from '../lib/totp.js';

export async function onRequestPost(context) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await context.request.json();
    const kv = context.env.AUTH_KV;
    const sessionToken = body.session_token;
    const code = body.code;

    // Validate session
    const valid = await kv.get('mfa_session_' + sessionToken);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Sitzung abgelaufen' }), { status: 401, headers });
    }

    const totpSecret = await kv.get('totp_secret');
    if (!totpSecret) {
      return new Response(JSON.stringify({ error: 'MFA nicht eingerichtet' }), { status: 400, headers });
    }

    // Try TOTP code first
    if (verifyTOTP(totpSecret, code)) {
      await kv.delete('mfa_session_' + sessionToken);
      const githubToken = context.env.GITHUB_TOKEN;
      return new Response(JSON.stringify({ token: githubToken }), { status: 200, headers });
    }

    // Try recovery code
    const recoveryCodes = JSON.parse(await kv.get('recovery_codes') || '[]');
    const codeUpper = code.toUpperCase();
    const idx = recoveryCodes.indexOf(codeUpper);
    if (idx !== -1) {
      recoveryCodes.splice(idx, 1);
      await kv.put('recovery_codes', JSON.stringify(recoveryCodes));
      await kv.delete('mfa_session_' + sessionToken);
      const githubToken = context.env.GITHUB_TOKEN;
      return new Response(JSON.stringify({ token: githubToken, recovery_code_used: true, remaining: recoveryCodes.length }), {
        status: 200, headers
      });
    }

    return new Response(JSON.stringify({ error: 'Falscher Code' }), { status: 401, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Verifizierung fehlgeschlagen' }), { status: 500, headers });
  }
}
```

**Step 5: Commit**

```bash
git add functions/lib/totp.js functions/api/auth.js functions/api/mfa-setup.js functions/api/mfa-verify.js
git commit -m "feat: add TOTP MFA backend (auth, setup, verify) with KV storage"
```

**CF Dashboard Setup (manual):**
1. CF Dashboard → Workers & Pages → runayoga → Settings → Bindings
2. Add KV Namespace binding: Variable name `AUTH_KV`, select/create namespace `RUNAYOGA_AUTH`

---

## Task 2: TOTP MFA — Frontend (Login Flow in Admin Panel)

**Files:**
- Modify: `public/admin/index.html` (auth section, lines 880-1010)

**Context:** The admin panel login currently shows a password field and calls `/api/auth`. We need to handle three responses: `mfa_setup_required`, `mfa_required`, and direct `token`. Also need QR code display for setup (using a QR code generator or Google Charts QR API).

**Step 1: Add QR code library**

We need a client-side QR code generator. Use `qrcode-generator` (tiny, no deps) bundled locally to avoid CSP issues.

```bash
cd /home/moe/runayoga
npm install qrcode-generator
# Copy the minified file to public/admin/
cp node_modules/qrcode-generator/qrcode.js public/admin/qrcode.min.js
```

Add script tag in `public/admin/index.html` after the js-yaml script (line 8):
```html
<script src="/admin/qrcode.min.js"></script>
```

**Step 2: Add MFA CSS styles**

Add these styles inside the existing `<style>` block in `public/admin/index.html`, before the closing `</style>` (around line 849):

```css
/* MFA screens */
.mfa-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height));
  text-align: center;
  padding: 20px;
}

.mfa-screen h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.mfa-screen p {
  color: var(--dark-light);
  margin-bottom: 20px;
  max-width: 400px;
}

.mfa-code-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}

.mfa-code-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid var(--beige-dark);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.mfa-code-input:focus {
  border-color: var(--sage);
}

.qr-container {
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: inline-block;
}

.qr-container img, .qr-container table {
  margin: 0 auto;
}

.recovery-codes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  max-width: 320px;
  margin: 16px auto;
  text-align: left;
}

.recovery-code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 14px;
  background: var(--beige);
  padding: 6px 12px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.mfa-hint {
  font-size: 12px;
  color: var(--dark-light);
  margin-top: 8px;
}

.mfa-recovery-link {
  font-size: 13px;
  color: var(--sage);
  cursor: pointer;
  margin-top: 12px;
  text-decoration: underline;
}
```

**Step 3: Replace the auth flow in the JS section**

Replace the `handleLogin` function (around line 978-1007) and add new MFA functions. The key changes:

Replace `window.handleLogin` with this version that handles all 3 auth responses:

```js
window.handleLogin = async function(e) {
  e.preventDefault();
  var pw = document.getElementById('loginPassword').value;
  var btn = document.getElementById('loginBtn');
  var errEl = document.getElementById('loginError');
  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Wird geprüft...';
  try {
    var res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    var data = await res.json();
    if (data.token) {
      // Direct login (no MFA) — shouldn't happen once MFA is set up
      localStorage.setItem('github_token', data.token);
      location.reload();
    } else if (data.mfa_setup_required) {
      showMfaSetup(data.setup_token);
    } else if (data.mfa_required) {
      showMfaVerify(data.session_token);
    } else {
      errEl.textContent = data.error || 'Anmeldung fehlgeschlagen';
      btn.disabled = false;
      btn.textContent = 'Anmelden';
    }
  } catch(err) {
    errEl.textContent = 'Verbindungsfehler';
    btn.disabled = false;
    btn.textContent = 'Anmelden';
  }
  return false;
};
```

Add these new functions after `handleLogin`:

```js
function showMfaSetup(setupToken) {
  document.getElementById('mainContent').innerHTML = `
    <div class="mfa-screen" id="mfaSetupScreen">
      <h2>MFA einrichten</h2>
      <p>Scanne den QR-Code mit deiner Authenticator-App (Google Authenticator, Authy, etc.)</p>
      <div class="qr-container" id="qrContainer">
        <div class="loading"><div class="spinner"></div>QR-Code wird geladen...</div>
      </div>
      <p>Gib den 6-stelligen Code aus der App ein:</p>
      <div class="mfa-code-inputs" id="mfaCodeInputs"></div>
      <div class="login-error" id="mfaSetupError"></div>
      <button class="btn-login" id="mfaSetupBtn" onclick="verifyMfaSetup()" disabled>Einrichten</button>
    </div>
  `;
  renderCodeInputs('mfaCodeInputs', 'mfaSetupBtn');
  loadQrCode(setupToken);
}

async function loadQrCode(setupToken) {
  try {
    var res = await fetch('/api/mfa-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate', setup_token: setupToken })
    });
    var data = await res.json();
    if (data.uri) {
      var qr = qrcode(0, 'M');
      qr.addData(data.uri);
      qr.make();
      document.getElementById('qrContainer').innerHTML = qr.createImgTag(5, 8);
      // Store for verification
      window._mfaSetupToken = setupToken;
    } else {
      document.getElementById('qrContainer').innerHTML = '<p style="color:var(--red);">Fehler: ' + (data.error || 'QR konnte nicht geladen werden') + '</p>';
    }
  } catch(err) {
    document.getElementById('qrContainer').innerHTML = '<p style="color:var(--red);">Verbindungsfehler</p>';
  }
}

window.verifyMfaSetup = async function() {
  var code = getCodeFromInputs('mfaCodeInputs');
  var errEl = document.getElementById('mfaSetupError');
  var btn = document.getElementById('mfaSetupBtn');
  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Wird geprüft...';
  try {
    var res = await fetch('/api/mfa-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', setup_token: window._mfaSetupToken, code: code })
    });
    var data = await res.json();
    if (data.token) {
      showRecoveryCodes(data.token, data.recovery_codes);
    } else {
      errEl.textContent = data.error || 'Falscher Code';
      btn.disabled = false;
      btn.textContent = 'Einrichten';
    }
  } catch(err) {
    errEl.textContent = 'Verbindungsfehler';
    btn.disabled = false;
    btn.textContent = 'Einrichten';
  }
};

function showRecoveryCodes(token, codes) {
  var codesHtml = codes.map(function(c) { return '<span class="recovery-code">' + escHtml(c) + '</span>'; }).join('');
  document.getElementById('mainContent').innerHTML = `
    <div class="mfa-screen">
      <h2>Recovery-Codes sichern</h2>
      <p>Speichere diese Codes an einem sicheren Ort. Jeder Code kann nur einmal verwendet werden, falls du keinen Zugriff auf deine Authenticator-App hast.</p>
      <div class="recovery-codes">${codesHtml}</div>
      <button class="btn-login" onclick="finishMfaSetup()">Verstanden, weiter zum Admin</button>
    </div>
  `;
  window._pendingToken = token;
}

window.finishMfaSetup = function() {
  localStorage.setItem('github_token', window._pendingToken);
  delete window._pendingToken;
  location.reload();
};

function showMfaVerify(sessionToken) {
  document.getElementById('mainContent').innerHTML = `
    <div class="mfa-screen">
      <h2>Zwei-Faktor-Authentifizierung</h2>
      <p>Gib den 6-stelligen Code aus deiner Authenticator-App ein.</p>
      <div class="mfa-code-inputs" id="mfaVerifyInputs"></div>
      <div class="login-error" id="mfaVerifyError"></div>
      <button class="btn-login" id="mfaVerifyBtn" onclick="verifyMfa()" disabled>Anmelden</button>
      <div class="mfa-recovery-link" onclick="toggleRecoveryInput()">Recovery-Code verwenden</div>
      <div id="recoveryInputWrap" style="display:none;margin-top:12px;">
        <input class="form-input" type="text" id="recoveryCodeInput" placeholder="Recovery-Code eingeben" style="max-width:280px;text-align:center;font-family:monospace;letter-spacing:2px;" />
        <button class="btn-login" style="margin-top:8px;" onclick="verifyMfa(true)">Mit Recovery-Code anmelden</button>
      </div>
    </div>
  `;
  window._mfaSessionToken = sessionToken;
  renderCodeInputs('mfaVerifyInputs', 'mfaVerifyBtn');
}

window.toggleRecoveryInput = function() {
  var el = document.getElementById('recoveryInputWrap');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.verifyMfa = async function(isRecovery) {
  var code = isRecovery
    ? document.getElementById('recoveryCodeInput').value.trim()
    : getCodeFromInputs('mfaVerifyInputs');
  var errEl = document.getElementById('mfaVerifyError');
  var btn = document.getElementById('mfaVerifyBtn');
  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Wird geprüft...';
  try {
    var res = await fetch('/api/mfa-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: window._mfaSessionToken, code: code })
    });
    var data = await res.json();
    if (data.token) {
      if (data.recovery_code_used) {
        alert('Recovery-Code verwendet. Noch ' + data.remaining + ' Code(s) übrig.');
      }
      localStorage.setItem('github_token', data.token);
      location.reload();
    } else {
      errEl.textContent = data.error || 'Falscher Code';
      btn.disabled = false;
      btn.textContent = 'Anmelden';
    }
  } catch(err) {
    errEl.textContent = 'Verbindungsfehler';
    btn.disabled = false;
    btn.textContent = 'Anmelden';
  }
};

// 6-digit code input helper
function renderCodeInputs(containerId, btnId) {
  var container = document.getElementById(containerId);
  var html = '';
  for (var i = 0; i < 6; i++) {
    html += '<input class="mfa-code-input" type="text" maxlength="1" inputmode="numeric" pattern="[0-9]" data-idx="' + i + '" />';
  }
  container.innerHTML = html;
  var inputs = container.querySelectorAll('.mfa-code-input');
  inputs.forEach(function(inp, idx) {
    inp.addEventListener('input', function() {
      if (inp.value.length === 1 && idx < 5) inputs[idx + 1].focus();
      var btn = document.getElementById(btnId);
      if (btn) btn.disabled = getCodeFromInputs(containerId).length < 6;
    });
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && !inp.value && idx > 0) inputs[idx - 1].focus();
    });
    inp.addEventListener('paste', function(e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      for (var j = 0; j < text.length && j < 6; j++) {
        inputs[j].value = text[j];
      }
      if (text.length > 0) inputs[Math.min(text.length, 5)].focus();
      var btn = document.getElementById(btnId);
      if (btn) btn.disabled = text.length < 6;
    });
  });
  inputs[0].focus();
}

function getCodeFromInputs(containerId) {
  var inputs = document.getElementById(containerId).querySelectorAll('.mfa-code-input');
  return Array.from(inputs).map(function(i) { return i.value; }).join('');
}
```

**Step 4: Commit**

```bash
git add public/admin/index.html public/admin/qrcode.min.js
git commit -m "feat: add TOTP MFA frontend (setup, verify, recovery codes)"
```

---

## Task 3: Theme System — Data Model + Astro Build Integration

**Files:**
- Modify: `src/content/site.md` (add theme fields)
- Modify: `src/layouts/BaseLayout.astro` (read theme colors, inject CSS vars)
- Modify: `public/css/styles.css` (make vars overridable)

**Step 1: Add theme fields to `site.md`**

Add to the frontmatter in `src/content/site.md`:

```yaml
theme_preset: sage
colors:
  primary: "#7a8b6f"
  primary_light: "#9aab8f"
  primary_dark: "#5a6b4f"
  accent: "#c4956a"
  background: "#f5f0e8"
  text: "#2d2d2d"
```

**Step 2: Modify `BaseLayout.astro` to inject theme colors**

In `src/layouts/BaseLayout.astro`, after the existing imports (line 2-4), add:

```astro
import { getContent } from '../lib/content';
const { frontmatter: siteData } = getContent('site.md');
const colors = siteData.colors || {};
```

Then add a `<style>` block in `<head>` (after the stylesheet link at line 35) that overrides CSS vars:

```astro
{colors.primary && (
  <style set:html={`
    :root {
      --sage: ${colors.primary};
      --sage-light: ${colors.primary_light || colors.primary};
      --sage-dark: ${colors.primary_dark || colors.primary};
      --accent: ${colors.accent || '#c4956a'};
      --cream: ${colors.background || '#f5f0e8'};
      --text-dark: ${colors.text || '#2d2d2d'};
    }
  `} />
)}
```

**Step 3: Commit**

```bash
git add src/content/site.md src/layouts/BaseLayout.astro
git commit -m "feat: theme system — colors from site.md override CSS vars at build time"
```

---

## Task 4: Theme System — Admin UI (Presets + Color Picker)

**Files:**
- Modify: `public/admin/index.html` (add theme editor section)

**Context:** When loading `site.md`, the admin should show a special theme editor section at the top of the form with preset buttons and color pickers. The presets and color pickers update CSS vars live on the admin page for instant preview.

**Step 1: Add theme presets data and theme editor rendering**

Add this constant in the JS section of admin (after `FIELD_LABELS`, around line 942):

```js
const THEME_PRESETS = {
  sage: { label: 'Sage', primary: '#7a8b6f', primary_light: '#9aab8f', primary_dark: '#5a6b4f', accent: '#c4956a', background: '#f5f0e8', text: '#2d2d2d' },
  ocean: { label: 'Ocean', primary: '#4a7c8e', primary_light: '#6a9cae', primary_dark: '#3a6c7e', accent: '#e8a87c', background: '#f0f4f5', text: '#2c3e50' },
  sunset: { label: 'Sunset', primary: '#b06846', primary_light: '#d08866', primary_dark: '#905836', accent: '#d4a574', background: '#faf5f0', text: '#3d2b1f' },
  lavender: { label: 'Lavender', primary: '#8b7a9e', primary_light: '#ab9abe', primary_dark: '#6b5a7e', accent: '#c49a6a', background: '#f5f0f8', text: '#2d2636' },
  earth: { label: 'Earth', primary: '#6b7355', primary_light: '#8b9375', primary_dark: '#4b5335', accent: '#a08060', background: '#f4f0e8', text: '#2d3426' }
};
```

**Step 2: Add CSS for theme editor**

Add inside `<style>` block:

```css
/* Theme editor */
.theme-editor {
  background: var(--white);
  border: 1px solid var(--beige-dark);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 28px;
}

.theme-editor h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.theme-presets {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.theme-preset-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid var(--beige-dark);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  background: var(--white);
  transition: all 0.2s;
}

.theme-preset-btn:hover {
  border-color: var(--sage-light);
}

.theme-preset-btn.active {
  border-color: var(--sage);
  background: var(--beige);
}

.theme-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.1);
}

.color-pickers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.color-picker-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker-group label {
  font-size: 13px;
  font-weight: 500;
  min-width: 80px;
}

.color-picker-group input[type="color"] {
  width: 40px;
  height: 36px;
  border: 1px solid var(--beige-dark);
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
}

.color-picker-group input[type="text"] {
  width: 90px;
  padding: 6px 8px;
  border: 1px solid var(--beige-dark);
  border-radius: 6px;
  font-size: 13px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
```

**Step 3: Add theme editor rendering logic**

Add a function that renders the theme editor when `site.md` is loaded. Insert after `renderEditor` function:

```js
function renderThemeEditor(data) {
  var preset = data.theme_preset || 'sage';
  var colors = data.colors || THEME_PRESETS.sage;

  var html = '<div class="theme-editor">';
  html += '<h3>Design-Vorlage &amp; Farben</h3>';

  // Preset buttons
  html += '<div class="theme-presets">';
  Object.keys(THEME_PRESETS).forEach(function(key) {
    var p = THEME_PRESETS[key];
    var active = key === preset ? ' active' : '';
    html += '<button type="button" class="theme-preset-btn' + active + '" onclick="applyThemePreset(\'' + key + '\')">';
    html += '<span class="theme-swatch" style="background:' + p.primary + ';"></span>';
    html += escHtml(p.label);
    html += '</button>';
  });
  html += '</div>';

  // Color pickers
  var colorFields = [
    { key: 'primary', label: 'Hauptfarbe' },
    { key: 'primary_light', label: 'Hell' },
    { key: 'primary_dark', label: 'Dunkel' },
    { key: 'accent', label: 'Akzent' },
    { key: 'background', label: 'Hintergrund' },
    { key: 'text', label: 'Text' }
  ];

  html += '<div class="color-pickers">';
  colorFields.forEach(function(cf) {
    var val = colors[cf.key] || '#000000';
    html += '<div class="color-picker-group">';
    html += '<label>' + escHtml(cf.label) + '</label>';
    html += '<input type="color" id="color_' + cf.key + '" value="' + escAttr(val) + '" onchange="updateColor(\'' + cf.key + '\', this.value)" />';
    html += '<input type="text" id="colorhex_' + cf.key + '" value="' + escAttr(val) + '" onchange="updateColor(\'' + cf.key + '\', this.value)" />';
    html += '</div>';
  });
  html += '</div>';

  html += '</div>';
  return html;
}

window.applyThemePreset = function(key) {
  var p = THEME_PRESETS[key];
  if (!p) return;

  // Update preset button active state
  document.querySelectorAll('.theme-preset-btn').forEach(function(btn) { btn.classList.remove('active'); });
  var btns = document.querySelectorAll('.theme-preset-btn');
  var keys = Object.keys(THEME_PRESETS);
  var idx = keys.indexOf(key);
  if (btns[idx]) btns[idx].classList.add('active');

  // Update hidden field
  var presetField = document.getElementById('theme_preset');
  if (presetField) presetField.value = key;

  // Update color pickers
  Object.keys(p).forEach(function(colorKey) {
    if (colorKey === 'label') return;
    var colorInput = document.getElementById('color_' + colorKey);
    var hexInput = document.getElementById('colorhex_' + colorKey);
    if (colorInput) colorInput.value = p[colorKey];
    if (hexInput) hexInput.value = p[colorKey];
  });

  // Live preview
  applyColorsLive(p);
};

window.updateColor = function(key, value) {
  // Sync color picker and hex input
  var colorInput = document.getElementById('color_' + key);
  var hexInput = document.getElementById('colorhex_' + key);
  if (colorInput && colorInput.value !== value) colorInput.value = value;
  if (hexInput && hexInput.value !== value) hexInput.value = value;

  // Mark preset as custom
  document.querySelectorAll('.theme-preset-btn').forEach(function(btn) { btn.classList.remove('active'); });
  var presetField = document.getElementById('theme_preset');
  if (presetField) presetField.value = 'custom';

  // Collect all current colors and apply live
  var colors = {};
  ['primary', 'primary_light', 'primary_dark', 'accent', 'background', 'text'].forEach(function(k) {
    var el = document.getElementById('color_' + k);
    if (el) colors[k] = el.value;
  });
  applyColorsLive(colors);
};

function applyColorsLive(colors) {
  // This updates the admin panel's CSS vars for live preview
  var root = document.documentElement;
  if (colors.primary) root.style.setProperty('--sage', colors.primary);
  if (colors.primary_light) root.style.setProperty('--sage-light', colors.primary_light);
  if (colors.primary_dark) root.style.setProperty('--sage-dark', colors.primary_dark);
  if (colors.accent) root.style.setProperty('--accent', colors.accent);
  if (colors.background) root.style.setProperty('--cream', colors.background);
  if (colors.text) root.style.setProperty('--text-dark', colors.text);
}
```

**Step 4: Integrate theme editor into editor rendering**

Modify the `renderEditor` function to inject the theme editor when editing `site.md`. In the editor rendering, after the header and before the form fields, add:

```js
// Inside renderEditor, after editor-header div closes, before the form:
if (currentFile === 'src/content/site.md') {
  html += renderThemeEditor(frontmatter);
  // Add hidden fields for theme data
  html += '<input type="hidden" id="theme_preset" name="theme_preset" value="' + escAttr(frontmatter.theme_preset || 'sage') + '" />';
}
```

**Step 5: Modify `collectFormData` to include theme colors**

In the `collectFormData` function, add after the main loop:

```js
// Collect theme data if editing site.md
if (currentFile === 'src/content/site.md') {
  var presetField = document.getElementById('theme_preset');
  if (presetField) fm.theme_preset = presetField.value;
  fm.colors = {};
  ['primary', 'primary_light', 'primary_dark', 'accent', 'background', 'text'].forEach(function(k) {
    var el = document.getElementById('color_' + k);
    if (el) fm.colors[k] = el.value;
  });
}
```

**Step 6: Commit**

```bash
git add public/admin/index.html
git commit -m "feat: theme presets (5) + color picker with live preview in admin"
```

---

## Task 5: Inline-Editing — Preview Templates

**Files:**
- Modify: `public/admin/index.html` (add preview mode toggle + preview templates)

**Context:** This is the largest task. We need preview templates that render content using the same CSS as the live site. The admin loads `public/css/styles.css` into a scoped container. Each content type gets a preview template that displays the content visually with clickable editable regions.

**Step 1: Load site CSS in admin**

Add in the admin `<head>` (after the existing styles, line 849):
```html
<link rel="stylesheet" href="/css/styles.css" id="siteStylesheet">
```

Add a scoping wrapper style to prevent site CSS from affecting admin UI:
```css
/* Scoped site preview */
.site-preview {
  border: 1px solid var(--beige-dark);
  border-radius: 12px;
  overflow: hidden;
  background: var(--cream);
  position: relative;
}

.site-preview * {
  /* Reset admin styles within preview */
}

/* Editable regions */
.site-preview [data-editable] {
  position: relative;
  cursor: pointer;
  transition: outline 0.15s;
  outline: 2px dashed transparent;
  outline-offset: 4px;
}

.site-preview [data-editable]:hover {
  outline-color: var(--sage-light);
}

.site-preview [data-editable]:hover::after {
  content: '✏️';
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 14px;
  background: var(--white);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

/* Edit overlay */
.edit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 250;
}

.edit-panel {
  background: var(--white);
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.edit-panel h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.edit-panel-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
}

/* Preview/Form toggle */
.view-toggle {
  display: flex;
  gap: 4px;
  background: var(--beige);
  border-radius: 8px;
  padding: 3px;
}

.view-toggle-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--dark-light);
  background: transparent;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.view-toggle-btn.active {
  background: var(--white);
  color: var(--dark);
  box-shadow: var(--shadow-sm);
}
```

**Step 2: Add preview template functions**

Add these preview template functions. Each one takes the current frontmatter data and returns HTML:

```js
// =====================
// Preview Templates
// =====================

var PREVIEW_TEMPLATES = {
  'src/content/home.md': renderHomePreview,
  'src/content/preise.md': renderPreisePreview,
};

function hasPreviewTemplate(path) {
  if (PREVIEW_TEMPLATES[path]) return true;
  // Generic templates for collections
  if (path.startsWith('src/content/angebote/')) return true;
  if (path.startsWith('src/content/blog/')) return true;
  if (path.startsWith('src/content/pages/')) return true;
  return false;
}

function getPreviewTemplate(path) {
  if (PREVIEW_TEMPLATES[path]) return PREVIEW_TEMPLATES[path];
  if (path.startsWith('src/content/angebote/')) return renderAngebotPreview;
  if (path.startsWith('src/content/blog/')) return renderBlogPreview;
  if (path.startsWith('src/content/pages/')) return renderPagePreview;
  return null;
}

function renderHomePreview(fm, body) {
  return `
    <div class="site-preview">
      <section class="hero" style="min-height:auto;padding:60px 40px;">
        <div class="hero-text">
          <h1 data-editable data-field="hero_title" data-type="string">${escHtml(fm.hero_title || '')}</h1>
          <p data-editable data-field="hero_subtitle" data-type="text">${escHtml(fm.hero_subtitle || '')}</p>
          <div class="hero-buttons">
            <a class="btn btn-primary" data-editable data-field="hero_cta_text" data-type="string">${escHtml(fm.hero_cta_text || '')}</a>
            <a class="btn btn-outline" data-editable data-field="hero_cta_secondary_text" data-type="string">${escHtml(fm.hero_cta_secondary_text || '')}</a>
          </div>
        </div>
        ${fm.hero_image ? '<div class="hero-image"><img src="' + escAttr(fm.hero_image) + '" alt="' + escAttr(fm.hero_image_alt || '') + '" data-editable data-field="hero_image" data-type="image" style="max-height:300px;object-fit:cover;border-radius:12px;" /></div>' : ''}
      </section>

      <section class="services" style="padding:40px;">
        <div class="container">
          <div class="section-header">
            <span class="section-label" data-editable data-field="services_label" data-type="string">${escHtml(fm.services_label || '')}</span>
            <h2 data-editable data-field="services_title" data-type="string">${escHtml(fm.services_title || '')}</h2>
            <p data-editable data-field="services_subtitle" data-type="text">${escHtml(fm.services_subtitle || '')}</p>
          </div>
        </div>
      </section>

      <section class="philosophy" style="padding:40px;">
        <div class="philosophy-inner">
          <blockquote data-editable data-field="philosophy_quote" data-type="text">&bdquo;${escHtml(fm.philosophy_quote || '')}&ldquo;</blockquote>
          <cite data-editable data-field="philosophy_cite" data-type="string">&mdash; ${escHtml(fm.philosophy_cite || '')}</cite>
        </div>
      </section>

      <section class="about" style="padding:40px;">
        <div class="container">
          <div class="about-inner">
            ${fm.about_image ? '<img src="' + escAttr(fm.about_image) + '" alt="" data-editable data-field="about_image" data-type="image" style="max-height:250px;object-fit:cover;border-radius:12px;" />' : ''}
            <div>
              <span class="section-label" data-editable data-field="about_label" data-type="string">${escHtml(fm.about_label || '')}</span>
              <h2 data-editable data-field="about_title" data-type="string">${escHtml(fm.about_title || '')}</h2>
              <p data-editable data-field="about_text" data-type="text">${escHtml(fm.about_text || '')}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="retreat" style="padding:40px;">
        <div class="container">
          <div class="retreat-inner">
            ${fm.retreat_image ? '<img src="' + escAttr(fm.retreat_image) + '" alt="" data-editable data-field="retreat_image" data-type="image" style="max-height:250px;object-fit:cover;border-radius:12px;" />' : ''}
            <div>
              <span class="section-label" data-editable data-field="retreat_label" data-type="string">${escHtml(fm.retreat_label || '')}</span>
              <h2 data-editable data-field="retreat_title" data-type="string">${escHtml(fm.retreat_title || '')}</h2>
              <p data-editable data-field="retreat_text" data-type="text">${escHtml(fm.retreat_text || '')}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="testimonials" style="padding:40px;">
        <div class="container">
          <div class="section-header">
            <span class="section-label" data-editable data-field="testimonials_label" data-type="string">${escHtml(fm.testimonials_label || '')}</span>
            <h2 data-editable data-field="testimonials_title" data-type="string">${escHtml(fm.testimonials_title || '')}</h2>
          </div>
          <div class="testimonials-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;">
            ${(fm.testimonials || []).map(function(t, i) {
              return '<div class="testimonial-card" style="background:white;padding:24px;border-radius:12px;">' +
                '<div class="stars">' + '★'.repeat(t.stars || 5) + '</div>' +
                '<p class="quote" data-editable data-field="testimonials.' + i + '.quote" data-type="text">' + escHtml(t.quote || '') + '</p>' +
                '<div class="author" data-editable data-field="testimonials.' + i + '.author" data-type="string">' + escHtml(t.author || '') + '</div>' +
                '</div>';
            }).join('')}
          </div>
        </div>
      </section>

      <section class="contact" style="padding:40px;">
        <div class="container">
          <div style="text-align:center;">
            <h2 data-editable data-field="cta_title" data-type="string">${escHtml(fm.cta_title || '')}</h2>
            <p data-editable data-field="cta_text" data-type="text">${escHtml(fm.cta_text || '')}</p>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderPagePreview(fm, body) {
  return `
    <div class="site-preview" style="padding:40px;">
      <div class="container" style="max-width:800px;margin:0 auto;">
        <h1 data-editable data-field="title" data-type="string" style="font-family:'Cormorant Garamond',serif;font-size:2.5em;margin-bottom:8px;">${escHtml(fm.title || '')}</h1>
        ${fm.subtitle ? '<p data-editable data-field="subtitle" data-type="string" style="font-size:1.2em;color:var(--text-medium);">' + escHtml(fm.subtitle) + '</p>' : ''}
        <hr style="margin:24px 0;border:none;border-top:1px solid var(--sand);" />
        <div data-editable data-field="_body" data-type="body" class="prose" style="line-height:1.8;">${body ? markdownToHtml(body) : '<p style="color:var(--text-light);">Kein Inhalt</p>'}</div>
      </div>
    </div>
  `;
}

function renderAngebotPreview(fm, body) {
  return `
    <div class="site-preview" style="padding:40px;">
      <div class="container" style="max-width:800px;margin:0 auto;">
        <span class="section-label" data-editable data-field="subtitle" data-type="string">${escHtml(fm.subtitle || '')}</span>
        <h1 data-editable data-field="title" data-type="string" style="font-family:'Cormorant Garamond',serif;font-size:2.5em;margin-bottom:16px;">${escHtml(fm.title || '')}</h1>
        ${fm.image ? '<img src="' + escAttr(fm.image) + '" alt="" data-editable data-field="image" data-type="image" style="width:100%;max-height:400px;object-fit:cover;border-radius:12px;margin-bottom:24px;" />' : ''}
        <div data-editable data-field="_body" data-type="body" class="prose" style="line-height:1.8;">${body ? markdownToHtml(body) : ''}</div>
        ${fm.highlights && fm.highlights.length ? '<ul style="margin-top:24px;">' + fm.highlights.map(function(h) { return '<li style="padding:4px 0;">✓ ' + escHtml(h) + '</li>'; }).join('') + '</ul>' : ''}
      </div>
    </div>
  `;
}

function renderBlogPreview(fm, body) {
  return `
    <div class="site-preview" style="padding:40px;">
      <div class="container" style="max-width:800px;margin:0 auto;">
        <div style="margin-bottom:16px;font-size:13px;color:var(--text-light);">
          <span data-editable data-field="date" data-type="date">${escHtml(fm.date || '')}</span>
          ${fm.author ? ' · <span data-editable data-field="author" data-type="string">' + escHtml(fm.author) + '</span>' : ''}
        </div>
        <h1 data-editable data-field="title" data-type="string" style="font-family:'Cormorant Garamond',serif;font-size:2.5em;margin-bottom:8px;">${escHtml(fm.title || '')}</h1>
        ${fm.excerpt ? '<p data-editable data-field="excerpt" data-type="text" style="font-size:1.1em;color:var(--text-medium);margin-bottom:24px;">' + escHtml(fm.excerpt) + '</p>' : ''}
        <hr style="margin:24px 0;border:none;border-top:1px solid var(--sand);" />
        <div data-editable data-field="_body" data-type="body" class="prose" style="line-height:1.8;">${body ? markdownToHtml(body) : ''}</div>
      </div>
    </div>
  `;
}

function renderPreisePreview(fm, body) {
  var sections = fm.sections || [];
  return `
    <div class="site-preview" style="padding:40px;">
      <div class="container" style="max-width:900px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 data-editable data-field="title" data-type="string" style="font-family:'Cormorant Garamond',serif;font-size:2.5em;">${escHtml(fm.title || 'Preise & Pakete')}</h1>
        </div>
        ${sections.map(function(section, si) {
          return '<div style="margin-bottom:32px;">' +
            '<h2 data-editable data-field="sections.' + si + '.label" data-type="string" style="font-family:\'Cormorant Garamond\',serif;margin-bottom:16px;">' + escHtml(section.label || '') + '</h2>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;">' +
            (section.cards || []).map(function(card, ci) {
              return '<div style="background:white;padding:24px;border-radius:12px;border:' + (card.featured ? '2px solid var(--sage)' : '1px solid var(--sand)') + ';">' +
                '<h3 data-editable data-field="sections.' + si + '.cards.' + ci + '.name" data-type="string">' + escHtml(card.name || '') + '</h3>' +
                '<div style="font-size:1.5em;font-weight:600;color:var(--sage);margin:8px 0;" data-editable data-field="sections.' + si + '.cards.' + ci + '.price" data-type="string">' + escHtml(card.price || '') + '</div>' +
                '<div style="font-size:13px;color:var(--text-light);">' + escHtml(card.period || '') + '</div>' +
                '<ul style="margin-top:12px;">' + (card.features || []).map(function(f) { return '<li style="padding:2px 0;font-size:14px;">✓ ' + escHtml(f) + '</li>'; }).join('') + '</ul>' +
                '</div>';
            }).join('') +
            '</div>' +
            '</div>';
        }).join('')}
      </div>
    </div>
  `;
}

// Simple markdown to HTML (for body preview)
function markdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hulo])(.+)$/gm, '<p>$1</p>');
}
```

**Step 3: Add inline edit click handler and edit overlay**

```js
// =====================
// Inline Editing
// =====================

function attachEditableListeners() {
  document.querySelectorAll('[data-editable]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var field = el.dataset.field;
      var type = el.dataset.type;
      openEditPanel(field, type, el);
    });
  });
}

function openEditPanel(fieldKey, fieldType, targetEl) {
  var currentValue;

  if (fieldKey === '_body') {
    currentValue = currentBody || '';
  } else if (fieldKey.includes('.')) {
    // Nested field like "testimonials.0.quote"
    var parts = fieldKey.split('.');
    var obj = currentData;
    for (var i = 0; i < parts.length; i++) {
      var key = isNaN(parts[i]) ? parts[i] : parseInt(parts[i]);
      obj = obj[key];
      if (obj === undefined) break;
    }
    currentValue = obj || '';
  } else {
    currentValue = currentData[fieldKey] || '';
  }

  var label = FIELD_LABELS[fieldKey.split('.').pop()] || autoLabel(fieldKey.split('.').pop());
  var inputHtml;

  if (fieldType === 'body' || fieldType === 'text') {
    inputHtml = '<textarea class="form-textarea' + (fieldType === 'body' ? ' body-editor' : '') + '" id="editPanelInput" style="min-height:200px;">' + escHtml(currentValue) + '</textarea>';
  } else if (fieldType === 'image') {
    inputHtml = '<div class="image-field">' +
      '<div class="image-preview">' + (currentValue ? '<img src="' + escAttr(currentValue) + '" alt="Vorschau" />' : '<span class="image-preview-empty">Kein Bild</span>') + '</div>' +
      '<div class="image-upload-row">' +
      '<input class="form-input" type="text" id="editPanelInput" value="' + escAttr(currentValue) + '" placeholder="/images/beispiel.jpg" />' +
      '<input type="file" id="editPanelFile" accept="image/*" style="display:none" />' +
      '<button type="button" class="btn-upload" onclick="document.getElementById(\'editPanelFile\').click()">Hochladen</button>' +
      '</div></div>';
  } else if (fieldType === 'date') {
    inputHtml = '<input class="form-input" type="date" id="editPanelInput" value="' + escAttr(formatDate(currentValue)) + '" />';
  } else {
    inputHtml = '<input class="form-input" type="text" id="editPanelInput" value="' + escAttr(currentValue) + '" />';
  }

  var overlay = document.createElement('div');
  overlay.className = 'edit-overlay';
  overlay.innerHTML = `
    <div class="edit-panel">
      <h3>${escHtml(label)}</h3>
      ${inputHtml}
      <div class="edit-panel-actions">
        <button class="btn btn-secondary" onclick="closeEditPanel()">Abbrechen</button>
        <button class="btn btn-primary" onclick="applyEditPanel('${escAttr(fieldKey)}', '${escAttr(fieldType)}')">Übernehmen</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Focus input
  setTimeout(function() {
    var input = document.getElementById('editPanelInput');
    if (input) input.focus();
  }, 100);

  // Close on overlay click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeEditPanel();
  });

  // Store target for update
  window._editTarget = targetEl;
}

window.closeEditPanel = function() {
  var overlay = document.querySelector('.edit-overlay');
  if (overlay) overlay.remove();
  delete window._editTarget;
};

window.applyEditPanel = function(fieldKey, fieldType) {
  var input = document.getElementById('editPanelInput');
  if (!input) return;
  var newValue = input.value;

  // Update data model
  if (fieldKey === '_body') {
    currentBody = newValue;
  } else if (fieldKey.includes('.')) {
    var parts = fieldKey.split('.');
    var obj = currentData;
    for (var i = 0; i < parts.length - 1; i++) {
      var key = isNaN(parts[i]) ? parts[i] : parseInt(parts[i]);
      obj = obj[key];
    }
    var lastKey = isNaN(parts[parts.length - 1]) ? parts[parts.length - 1] : parseInt(parts[parts.length - 1]);
    obj[lastKey] = newValue;
  } else {
    currentData[fieldKey] = newValue;
  }

  // Update preview visually
  if (window._editTarget) {
    if (fieldType === 'image') {
      window._editTarget.src = newValue;
    } else if (fieldType === 'body') {
      window._editTarget.innerHTML = markdownToHtml(newValue);
    } else {
      window._editTarget.textContent = newValue;
    }
  }

  closeEditPanel();
};
```

**Step 4: Modify `renderEditor` to support preview/form toggle**

Replace the `renderEditor` function to support both modes. Add a view toggle in the header:

```js
// In editor-actions div, before save button, add toggle:
if (hasPreviewTemplate(path)) {
  html += '<div class="view-toggle">';
  html += '<button type="button" class="view-toggle-btn active" id="togglePreview" onclick="switchView(\'preview\')">Vorschau</button>';
  html += '<button type="button" class="view-toggle-btn" id="toggleForm" onclick="switchView(\'form\')">Formular</button>';
  html += '</div>';
}
```

Add view switching logic:

```js
window.switchView = function(mode) {
  document.getElementById('togglePreview').classList.toggle('active', mode === 'preview');
  document.getElementById('toggleForm').classList.toggle('active', mode === 'form');
  document.getElementById('previewContainer').style.display = mode === 'preview' ? 'block' : 'none';
  document.getElementById('formContainer').style.display = mode === 'form' ? 'block' : 'none';
  if (mode === 'preview') {
    // Re-render preview with current data
    var tmpl = getPreviewTemplate(currentFile);
    if (tmpl) {
      document.getElementById('previewContainer').innerHTML = tmpl(currentData, currentBody);
      attachEditableListeners();
    }
  }
};
```

Wrap the form in a div and add preview container:

```js
// After editor-header, before form:
if (hasPreviewTemplate(path)) {
  html += '<div id="previewContainer">';
  var tmpl = getPreviewTemplate(path);
  html += tmpl(frontmatter, body);
  html += '</div>';
  html += '<div id="formContainer" style="display:none;">';
} else {
  html += '<div id="formContainer">';
}

// ... existing form fields ...

html += '</div>'; // close formContainer
```

After rendering, attach editable listeners:

```js
// At end of renderEditor, after innerHTML:
setTimeout(function() { attachEditableListeners(); }, 50);
```

**Step 5: Commit**

```bash
git add public/admin/index.html
git commit -m "feat: inline-editing with visual preview templates and edit overlays"
```

---

## Task 6: Integration Testing + Polish

**Files:**
- Modify: `public/_headers` (update CSP if needed)

**Step 1: Test MFA flow locally**

Note: Full MFA testing requires CF Pages with KV binding. For local testing, temporarily bypass MFA in auth.js by checking an env var `SKIP_MFA=true`.

Verify:
1. Password-only login works (before MFA setup)
2. MFA setup shows QR code
3. QR code scans in Authenticator app
4. 6-digit code verification works
5. Recovery codes are shown and work
6. Subsequent logins require TOTP code

**Step 2: Test theme system**

1. Open admin → load `site.md`
2. Theme editor should appear above the fields
3. Click preset → colors update live in admin
4. Adjust individual color → hex field syncs
5. Save → verify `site.md` has `theme_preset` and `colors` in frontmatter
6. Build site (`npm run build`) → check CSS vars in HTML output

**Step 3: Test inline editing**

1. Load `home.md` → should show preview (not form)
2. Hover over text → dashed outline + pencil icon
3. Click → edit panel opens
4. Change text → "Übernehmen" → preview updates
5. Toggle to "Formular" → form shows
6. Save → verify content saved to GitHub
7. Test for blog posts, angebote, pages

**Step 4: Update CSP headers if needed**

Check if the QR code library or otpauth needs additional CSP sources. Update `public/_headers` if necessary.

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: admin v2 complete — TOTP MFA, inline editing, theme system"
```

---

## Task 7: Deploy + CF Dashboard Setup

**Manual steps (not code):**

1. **Create KV Namespace:**
   - CF Dashboard → Workers & Pages → KV → Create Namespace: `RUNAYOGA_AUTH`

2. **Bind KV to Pages project:**
   - CF Dashboard → Workers & Pages → runayoga → Settings → Bindings
   - Add KV Namespace: Variable name `AUTH_KV`, Namespace `RUNAYOGA_AUTH`

3. **Push to GitHub:**
   ```bash
   cd /home/moe/runayoga
   git push origin main
   ```

4. **Verify CF Pages build succeeds**

5. **Test on live site:**
   - Open `https://runayoga.pages.dev/admin/`
   - First login: password → MFA setup → scan QR → enter code → recovery codes → admin
   - Second login: password → TOTP code → admin

---

## Summary

| Task | Description | Key Files |
|---|---|---|
| 1 | TOTP MFA Backend | `functions/lib/totp.js`, `functions/api/auth.js`, `mfa-setup.js`, `mfa-verify.js` |
| 2 | TOTP MFA Frontend | `public/admin/index.html` (auth flow + QR code) |
| 3 | Theme Data Model | `src/content/site.md`, `src/layouts/BaseLayout.astro` |
| 4 | Theme Admin UI | `public/admin/index.html` (presets + color picker) |
| 5 | Inline Editing | `public/admin/index.html` (preview templates + edit overlays) |
| 6 | Integration Testing | All files, `public/_headers` |
| 7 | Deploy + CF Setup | CF Dashboard (KV, bindings), `git push` |
