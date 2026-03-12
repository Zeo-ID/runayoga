export async function onRequestPost() {
  const hookUrl = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/ae599d9e-52dd-4e06-93aa-aa8e00418a7a';

  try {
    const resp = await fetch(hookUrl, { method: 'POST' });
    const result = await resp.json();
    return new Response(JSON.stringify({ triggered: result.success }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ triggered: false, error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
