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

    if (!adminPassword || !githubToken) {
      return new Response(JSON.stringify({ error: 'Server nicht konfiguriert' }), {
        status: 500, headers
      });
    }

    if (password !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Falsches Passwort' }), {
        status: 401, headers
      });
    }

    return new Response(JSON.stringify({ token: githubToken }), {
      status: 200, headers
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fehler bei der Anmeldung' }), {
      status: 400, headers
    });
  }
}
