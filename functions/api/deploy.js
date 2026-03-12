export async function onRequestPost(context) {
  const cfAccountId = context.env.CF_ACCOUNT_ID;
  const cfApiToken = context.env.CF_DEPLOY_TOKEN;

  if (!cfAccountId || !cfApiToken) {
    return new Response(JSON.stringify({
      triggered: false,
      error: 'Missing config',
      hasAccount: !!cfAccountId,
      hasToken: !!cfApiToken
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const resp = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/pages/projects/runayoga/deployments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfApiToken}`,
          'Content-Type': 'application/json',
        },
        body: '{}',
      }
    );

    const result = await resp.json();
    return new Response(JSON.stringify({
      triggered: result.success,
      status: resp.status,
      errors: result.errors || []
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      triggered: false,
      error: err.message
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
