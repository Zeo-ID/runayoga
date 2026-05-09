interface Env {
  ANTHROPIC_API_KEY: string;
  AI_PROXY_TOKEN: string;
}

const SYSTEM_PROMPT = `Du bist ein Texteditor für eine deutsche Webseite eines kleinen Unternehmens.
Deine Aufgabe: gegebenen HTML-Text gemäß einer Aktion verbessern.

Wichtige Regeln:
- Antworte AUSSCHLIESSLICH mit dem überarbeiteten HTML
- KEIN Kommentar, KEINE Markdown-Codeblöcke (\`\`\`), KEINE Erklärung
- HTML-Struktur erhalten: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a>, <hr>
- Keine neuen HTML-Tags erfinden, die nicht im Original waren (außer wenn die Aktion das verlangt)
- Sprache: Deutsch (Du-Form, falls Original Du-Form nutzt; sonst Sie-Form)
- Stil: warm, einladend, klar, ohne Marketing-Floskeln
- Bewahre den Kontext (z.B. Yoga-Studio, Bestattung, Therapie etc.) und Eigennamen`;

const MODE_PROMPTS: Record<string, string> = {
  improve:
    "Verbessere die Klarheit, Grammatik und Lesbarkeit. Behalte Inhalt und Struktur weitgehend bei. Entferne Wiederholungen und Floskeln.",
  shorter:
    "Kürze den Text deutlich auf das Wesentliche, ca. 50–60% der Originallänge. Behalte Hauptaussagen und Struktur.",
  longer:
    "Erweitere den Text um relevante Details, Beispiele oder Erläuterungen. Ziel: ca. 130–160% der Originallänge ohne Geschwafel.",
  seo: "Optimiere für Suchmaschinen: prägnantere Überschriften (H2/H3), klare Schlüsselwörter im Lead-Absatz, gut scannbare Struktur (kurze Absätze, ggf. Listen). Keine Keyword-Stopfungen.",
};

interface AnthropicResponse {
  content?: { type: string; text: string }[];
  error?: { message: string };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ANTHROPIC_API_KEY || !env.AI_PROXY_TOKEN) {
    return jsonResponse(
      { error: "server-config", detail: "ANTHROPIC_API_KEY oder AI_PROXY_TOKEN fehlt" },
      500
    );
  }

  const auth = request.headers.get("authorization") || "";
  const provided = auth.replace(/^Bearer\s+/i, "").trim();
  if (!provided || provided !== env.AI_PROXY_TOKEN) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  let payload: { text?: string; mode?: string };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "invalid-json" }, 400);
  }

  const text = (payload.text || "").trim();
  const mode = payload.mode && MODE_PROMPTS[payload.mode] ? payload.mode : "improve";

  if (!text) return jsonResponse({ error: "text-fehlt" }, 400);
  if (text.length > 16000)
    return jsonResponse({ error: "text-zu-lang", limit: 16000 }, 400);

  const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Aktion: ${MODE_PROMPTS[mode]}\n\nHTML-Text:\n${text}`,
        },
      ],
    }),
  });

  if (!apiRes.ok) {
    const detail = await apiRes.text().catch(() => "");
    return jsonResponse(
      { error: "anthropic-error", status: apiRes.status, detail },
      502
    );
  }

  const json = (await apiRes.json()) as AnthropicResponse;
  const improved = json.content?.[0]?.text?.trim() || "";
  if (!improved) {
    return jsonResponse({ error: "leere-antwort", detail: json }, 502);
  }

  return jsonResponse({ improved, mode });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
      "access-control-max-age": "86400",
    },
  });
};
