"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomField } from "@puckeditor/core";
import { listImages, uploadImage } from "../../lib/github";

type ImageItem = {
  name: string;
  path: string;
  download_url: string;
  sha: string;
};

function slugifyFilename(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const stamp = Date.now().toString(36);
  return `${base || "bild"}-${stamp}${ext}`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ImagePickerInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ImageItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadList() {
    setLoading(true);
    const list = await listImages();
    setItems(list as ImageItem[]);
    setLoading(false);
  }

  useEffect(() => {
    if (open && items === null) loadList();
  }, [open, items]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const filename = slugifyFilename(file.name);
      const base64 = await fileToBase64(file);
      const ok = await uploadImage(filename, base64);
      if (ok) {
        const newPath = `/images/${filename}`;
        onChange(newPath);
        setItems(null);
        setOpen(false);
      } else {
        alert("Upload fehlgeschlagen.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const filtered =
    items?.filter((i) =>
      filter ? i.name.toLowerCase().includes(filter.toLowerCase()) : true
    ) ?? [];

  return (
    <div className="space-y-2">
      {label && (
        <div className="text-xs uppercase tracking-wider text-neutral-500">
          {label}
        </div>
      )}

      {value ? (
        <div className="rounded-lg border border-neutral-300 overflow-hidden bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="w-full max-h-48 object-contain bg-white"
          />
          <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
            <span className="truncate text-neutral-600" title={value}>
              {value}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded bg-blue-600 text-white px-2 py-1 hover:bg-blue-700"
              >
                Ändern
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded bg-neutral-200 text-neutral-700 px-2 py-1 hover:bg-neutral-300"
              >
                Entfernen
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 p-6 text-sm text-neutral-600"
        >
          📁 Bild auswählen oder hochladen
        </button>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="oder URL eingeben…"
        className="w-full rounded border border-neutral-300 px-2 py-1 text-xs"
      />

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="font-semibold text-neutral-800">Mediathek</h3>
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="rounded bg-blue-600 text-white text-sm px-3 py-1.5 hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Lade hoch…" : "+ Hochladen"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded bg-neutral-200 text-neutral-700 text-sm px-3 py-1.5 hover:bg-neutral-300"
                >
                  Schließen
                </button>
              </div>
            </div>

            <div className="px-5 py-3 border-b">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Suchen…"
                className="w-full rounded border border-neutral-300 px-3 py-1.5 text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <div className="text-center text-neutral-500 py-12">
                  Laden…
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-neutral-500 py-12">
                  {items === null
                    ? "Bilder werden geladen…"
                    : "Keine Bilder gefunden. Bitte hochladen."}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((img) => {
                    const publicPath = `/images/${img.name}`;
                    const selected = value === publicPath;
                    return (
                      <button
                        key={img.sha}
                        type="button"
                        onClick={() => {
                          onChange(publicPath);
                          setOpen(false);
                        }}
                        className={`group relative rounded-lg overflow-hidden border-2 ${
                          selected
                            ? "border-blue-600"
                            : "border-transparent hover:border-blue-300"
                        }`}
                        title={img.name}
                      >
                        <div className="aspect-square bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.download_url}
                            alt={img.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[11px] px-2 py-1 truncate">
                          {img.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const imagePickerField = (label: string): CustomField<string> => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => (
    <ImagePickerInput
      value={value || ""}
      onChange={onChange}
      label={label}
    />
  ),
});
