"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { DOMSerializer } from "@tiptap/pm/model";
import type { CustomField } from "@puckeditor/core";
import { useEffect, useRef, useState } from "react";

type AiMode = "improve" | "shorter" | "longer" | "seo";

const AI_MODE_LABELS: Record<AiMode, string> = {
  improve: "✨ Verbessern",
  shorter: "✂ Kürzen",
  longer: "↔ Verlängern",
  seo: "🔍 SEO-optimieren",
};

function getSelectionHtml(editor: Editor): { html: string; isFull: boolean } {
  const { from, to, empty } = editor.state.selection;
  if (empty || from === to) {
    return { html: editor.getHTML(), isFull: true };
  }
  const slice = editor.state.doc.slice(from, to);
  const serializer = DOMSerializer.fromSchema(editor.schema);
  const fragment = serializer.serializeFragment(slice.content);
  const div = document.createElement("div");
  div.appendChild(fragment);
  return { html: div.innerHTML, isFull: false };
}

async function callImproveApi(
  text: string,
  mode: AiMode,
  token: string
): Promise<{ improved?: string; error?: string }> {
  try {
    const res = await fetch("/api/improve", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, mode }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      improved?: string;
      error?: string;
      detail?: string;
    };
    if (!res.ok) {
      return { error: json.error || `HTTP ${res.status}` };
    }
    return { improved: json.improved };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Netzwerkfehler" };
  }
}

type ToolbarButtonProps = {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
};

function ToolbarButton({ active, onClick, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`px-2 py-1 text-sm rounded border ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}

function AiMenu({
  editor,
}: {
  editor: Editor;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<AiMode | null>(null);
  const [error, setError] = useState("");
  const [needsToken, setNeedsToken] = useState(false);

  async function run(mode: AiMode) {
    setError("");
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("ai_token") || "";
    }
    if (!token) {
      const entered = window.prompt(
        "Bitte AI-Zugangsschlüssel eingeben (einmalig):"
      );
      if (!entered) return;
      localStorage.setItem("ai_token", entered.trim());
      token = entered.trim();
      setNeedsToken(false);
    }

    const { html, isFull } = getSelectionHtml(editor);
    if (!html.trim()) {
      setError("Kein Text vorhanden.");
      return;
    }

    setBusy(mode);
    setOpen(false);
    const result = await callImproveApi(html, mode, token);
    setBusy(null);

    if (result.error) {
      if (result.error === "unauthorized") {
        localStorage.removeItem("ai_token");
        setNeedsToken(true);
        setError("Schlüssel ungültig — bitte erneut eingeben.");
      } else {
        setError(`Fehler: ${result.error}`);
      }
      return;
    }
    if (!result.improved) {
      setError("Leere Antwort.");
      return;
    }

    const cleaned = result.improved
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    if (isFull) {
      editor.chain().focus().setContent(cleaned).run();
    } else {
      const { from, to } = editor.state.selection;
      editor.chain().focus().insertContentAt({ from, to }, cleaned).run();
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        title="KI-Textverbesserung"
        disabled={busy !== null}
        className="px-2 py-1 text-sm rounded border bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "⏳ KI läuft…" : "✨ KI"}
      </button>

      {open && !busy && (
        <div className="absolute z-50 right-0 mt-1 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg py-1">
          {(Object.keys(AI_MODE_LABELS) as AiMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(mode)}
              className="block w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {AI_MODE_LABELS[mode]}
            </button>
          ))}
          <div className="border-t border-neutral-200 my-1" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              localStorage.removeItem("ai_token");
              setNeedsToken(true);
              setOpen(false);
              setError("AI-Schlüssel zurückgesetzt.");
            }}
            className="block w-full text-left px-3 py-2 text-xs text-neutral-500 hover:bg-neutral-100"
          >
            AI-Schlüssel zurücksetzen
          </button>
        </div>
      )}

      {(error || needsToken) && (
        <div className="absolute z-50 right-0 mt-1 w-72 bg-red-50 border border-red-200 rounded-lg shadow-lg p-2 text-xs text-red-700">
          {error || "AI-Schlüssel fehlt."}
          <button
            type="button"
            onClick={() => {
              setError("");
              setNeedsToken(false);
            }}
            className="ml-2 underline"
          >
            schließen
          </button>
        </div>
      )}
    </div>
  );
}

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const lastEmittedRef = useRef<string>(value || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[160px] px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedRef.current = html;
      onChange(html);
    },
    immediatelyRender: false,
  });

  // External value change → update editor (avoid loops on self-emitted html)
  useEffect(() => {
    if (!editor) return;
    if (value === lastEmittedRef.current) return;
    if (value === editor.getHTML()) return;
    editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    lastEmittedRef.current = value || "";
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded border border-neutral-300 bg-neutral-50 p-3 text-sm text-neutral-500">
        Editor wird geladen…
      </div>
    );
  }

  function setLink() {
    const previous = editor!.getAttributes("link").href || "";
    const url = window.prompt("Link-URL (leer lassen zum Entfernen):", previous);
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="rounded-lg border border-neutral-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 px-2 py-2 bg-neutral-50 rounded-t-lg">
        <ToolbarButton
          title="Fett (Ctrl+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Kursiv (Ctrl+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Durchgestrichen"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </ToolbarButton>
        <span className="w-px bg-neutral-300 mx-1" />
        <ToolbarButton
          title="Überschrift 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Überschrift 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Absatz"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </ToolbarButton>
        <span className="w-px bg-neutral-300 mx-1" />
        <ToolbarButton
          title="Aufzählung"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          title="Nummerierte Liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          title="Zitat"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </ToolbarButton>
        <span className="w-px bg-neutral-300 mx-1" />
        <ToolbarButton
          title="Link einfügen"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          🔗
        </ToolbarButton>
        <ToolbarButton
          title="Code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {"</>"}
        </ToolbarButton>
        <ToolbarButton
          title="Trenner"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </ToolbarButton>
        <span className="w-px bg-neutral-300 mx-1" />
        <ToolbarButton
          title="Rückgängig"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          title="Wiederherstellen"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>

        <div className="ml-auto">
          <AiMenu editor={editor} />
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export const richTextField = (label: string): CustomField<string> => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => (
    <RichTextEditor value={value || ""} onChange={onChange} />
  ),
});
