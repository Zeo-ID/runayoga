export async function onRequestGet(context) {
  const { env } = context;
  const accountId = env.CF_ACCOUNT_ID;
  const apiToken = env.CF_DEPLOY_TOKEN;
  const projectName = env.CF_PROJECT_NAME;

  if (!accountId || !apiToken || !projectName) {
    return new Response(JSON.stringify({ error: 'Nicht konfiguriert' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?sort_by=created_on&sort_order=desc&per_page=1`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();

    if (!data.success || !data.result || !data.result.length) {
      return new Response(JSON.stringify({ status: 'unknown' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const latest = data.result[0];
    const stage = latest.latest_stage || {};

    return new Response(JSON.stringify({
      status: stage.status || 'unknown',
      stage: stage.name || 'unknown',
      created: latest.created_on,
      url: latest.url,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
