"use client";

import { useEffect, useState } from "react";
import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import config from "../../../lib/puck.config";
import { loadContent, saveContent, listContentFiles } from "../../../lib/github";

function pathToContentFile(urlPath: string): string {
  if (urlPath === "/" || urlPath === "") return "src/content/home.json";
  const segments = urlPath.replace(/^\//, "").split("/");
  if (segments[0] === "blog" && segments[1])
    return `src/content/blog/${segments[1]}.json`;
  if (segments[0] === "angebote" && segments[1])
    return `src/content/angebote/${segments[1]}.json`;
  return `src/content/seiten/${segments[0]}.json`;
}

export function AdminClient() {
  const [path, setPath] = useState("/");
  const [data, setData] = useState<Partial<Data>>({});
  const [pages, setPages] = useState<{ label: string; path: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [configured, setConfigured] = useState(false);

  // Check GitHub config — only token needed (owner/repo from site.json)
  useEffect(() => {
    const token = localStorage.getItem("github_token");
    setConfigured(!!token);
  }, []);

  // Load page list
  useEffect(() => {
    if (!configured) return;
    async function loadPages() {
      const allPages: { label: string; path: string }[] = [
        { label: "Startseite", path: "/" },
      ];

      const seiten = await listContentFiles("src/content/seiten");
      for (const f of seiten) {
        const slug = f.name.replace(".json", "");
        allPages.push({ label: slug, path: `/${slug}` });
      }

      const blog = await listContentFiles("src/content/blog");
      for (const f of blog) {
        const slug = f.name.replace(".json", "");
        allPages.push({ label: `Blog: ${slug}`, path: `/blog/${slug}` });
      }

      const angebote = await listContentFiles("src/content/angebote");
      for (const f of angebote) {
        const slug = f.name.replace(".json", "");
        allPages.push({
          label: `Angebot: ${slug}`,
          path: `/angebote/${slug}`,
        });
      }

      setPages(allPages);
    }
    loadPages();
  }, [configured]);

  // Load selected page content
  useEffect(() => {
    if (!configured) return;
    async function load() {
      setLoading(true);
      const file = pathToContentFile(path);
      const result = await loadContent(file);
      setData(result?.content || {});
      setLoading(false);
    }
    load();
  }, [path, configured]);

  async function handlePublish(publishedData: Data) {
    setSaving(true);
    setMessage("");
    const file = pathToContentFile(path);
    const ok = await saveContent(
      file,
      publishedData,
      `Inhalt aktualisiert: ${path}`
    );
    setMessage(ok ? "Gespeichert! Build startet..." : "Fehler beim Speichern");
    setSaving(false);
    if (ok) setTimeout(() => setMessage(""), 5000);
  }

  // GitHub config form
  if (!configured) {
    return <SetupForm onDone={() => setConfigured(true)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-4 z-50">
        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
        >
          {pages.map((p) => (
            <option key={p.path} value={p.path}>
              {p.label}
            </option>
          ))}
        </select>
        {saving && (
          <span className="text-sm text-blue-500">Speichern...</span>
        )}
        {message && (
          <span
            className={`text-sm ${
              message.includes("Fehler") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </span>
        )}
        <a
          href={path}
          target="_blank"
          rel="noopener"
          className="ml-auto text-sm text-blue-500 hover:underline"
        >
          Seite ansehen ↗
        </a>
      </div>

      {/* Puck editor */}
      <div className="flex-1">
        <Puck
          config={config}
          data={data as Data}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}

function SetupForm({ onDone }: { onDone: () => void }) {
  const [token, setToken] = useState("");

  function save() {
    localStorage.setItem("github_token", token);
    onDone();
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-4">
        <h1 className="text-xl font-bold">Admin-Zugang</h1>
        <p className="text-sm text-gray-500">
          Bitte gib deinen Zugangsschlüssel ein, um Inhalte zu bearbeiten.
        </p>
        <input
          placeholder="Zugangsschlüssel"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          onKeyDown={(e) => e.key === "Enter" && token && save()}
        />
        <button
          onClick={save}
          disabled={!token}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Anmelden
        </button>
      </div>
    </div>
  );
}
