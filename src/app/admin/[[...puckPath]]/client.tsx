"use client";

import { useEffect, useState } from "react";
import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import config from "../../../lib/puck.config";
import {
  loadContent,
  saveContent,
  listContentFiles,
  deleteContent,
} from "../../../lib/github";

type PageType = "seite" | "blog" | "angebot";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function pathForNew(type: PageType, slug: string): {
  file: string;
  url: string;
} {
  if (type === "blog")
    return { file: `src/content/blog/${slug}.json`, url: `/blog/${slug}` };
  if (type === "angebot")
    return {
      file: `src/content/angebote/${slug}.json`,
      url: `/angebote/${slug}`,
    };
  return { file: `src/content/seiten/${slug}.json`, url: `/${slug}` };
}

function emptyPage(title: string, type: PageType): Data {
  return {
    content: [
      {
        type: "Hero",
        props: {
          id: `Hero-${Date.now()}`,
          title,
          subtitle: "",
          buttonText: "",
          buttonLink: "",
          secondButtonText: "",
          secondButtonLink: "",
          image: "",
          imageAlt: "",
          layout: type === "blog" ? "center" : "right",
        },
      },
      {
        type: "RichText",
        props: {
          id: `RichText-${Date.now()}`,
          content: "<p>Inhalt hier eingeben…</p>",
        },
      },
    ],
    root: {
      props: {
        seoTitle: title,
        seoDescription: "",
      },
    },
  } as unknown as Data;
}

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
  const [showNew, setShowNew] = useState(false);
  const [pageListVersion, setPageListVersion] = useState(0);

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
  }, [configured, pageListVersion]);

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

  async function handleCreate(type: PageType, title: string) {
    const slug = slugify(title);
    if (!slug) {
      setMessage("Bitte einen gültigen Titel eingeben.");
      return false;
    }
    const { file, url } = pathForNew(type, slug);
    setSaving(true);
    setMessage("");
    const ok = await saveContent(
      file,
      emptyPage(title, type),
      `Neue Seite angelegt: ${url}`
    );
    setSaving(false);
    if (!ok) {
      setMessage("Fehler beim Anlegen (Slug evtl. schon vergeben).");
      return false;
    }
    setMessage("Seite angelegt — Build startet…");
    setShowNew(false);
    setPageListVersion((v) => v + 1);
    setPath(url);
    setTimeout(() => setMessage(""), 5000);
    return true;
  }

  async function handleDelete() {
    if (path === "/") return;
    if (!confirm(`Seite "${path}" wirklich löschen?`)) return;
    const file = pathToContentFile(path);
    setSaving(true);
    setMessage("");
    const ok = await deleteContent(file, `Seite gelöscht: ${path}`);
    setSaving(false);
    if (!ok) {
      setMessage("Fehler beim Löschen.");
      return;
    }
    setMessage("Gelöscht — Build startet…");
    setPath("/");
    setPageListVersion((v) => v + 1);
    setTimeout(() => setMessage(""), 5000);
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
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 z-50">
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

        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="text-sm bg-blue-600 text-white rounded-md px-3 py-1.5 hover:bg-blue-700"
        >
          + Neu
        </button>

        {path !== "/" && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-600 border border-red-300 rounded-md px-3 py-1.5 hover:bg-red-50"
          >
            Löschen
          </button>
        )}

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

      {showNew && (
        <NewPageModal
          onCancel={() => setShowNew(false)}
          onCreate={handleCreate}
          existingPaths={pages.map((p) => p.path)}
        />
      )}

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

function NewPageModal({
  onCancel,
  onCreate,
  existingPaths,
}: {
  onCancel: () => void;
  onCreate: (type: PageType, title: string) => Promise<boolean>;
  existingPaths: string[];
}) {
  const [type, setType] = useState<PageType>("seite");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const previewSlug = slugify(title);
  const previewUrl = previewSlug
    ? type === "blog"
      ? `/blog/${previewSlug}`
      : type === "angebot"
        ? `/angebote/${previewSlug}`
        : `/${previewSlug}`
    : "";
  const collision = previewUrl && existingPaths.includes(previewUrl);

  async function submit() {
    if (!title.trim() || collision || busy) return;
    setBusy(true);
    const ok = await onCreate(type, title.trim());
    setBusy(false);
    if (ok) {
      setTitle("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-neutral-800">
          Neue Seite anlegen
        </h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
            Typ
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["seite", "blog", "angebot"] as PageType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`text-sm rounded-md border px-3 py-2 ${
                  type === t
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {t === "seite" ? "Seite" : t === "blog" ? "Blog" : "Angebot"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
            Titel
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="z.B. Mein neuer Beitrag"
            className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
          />
          {previewUrl && (
            <p
              className={`mt-2 text-xs ${
                collision ? "text-red-600" : "text-neutral-500"
              }`}
            >
              URL: <code>{previewUrl}</code>
              {collision && " — bereits vergeben"}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm rounded-md px-3 py-2 text-neutral-700 hover:bg-neutral-100"
          >
            Abbrechen
          </button>
          <button
            type="button"
            disabled={!title.trim() || !!collision || busy}
            onClick={submit}
            className="text-sm rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "Lege an…" : "Anlegen"}
          </button>
        </div>
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
