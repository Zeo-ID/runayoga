export async function onRequestPost(context) {
  const hookUrl = context.env.DEPLOY_HOOK_URL;

  if (!hookUrl) {
    return new Response(JSON.stringify({ triggered: false, error: 'Deploy Hook nicht konfiguriert' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

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
