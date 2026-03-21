"use client";

import { useState } from "react";

export function FAQ({
  title,
  items,
}: {
  title: string;
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold font-heading text-center mb-10 text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div className="space-y-3">
          {(items || []).map((item, i) => (
            <div
              key={i}
              className="border border-[var(--color-border)] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-medium text-[var(--color-text)] hover:bg-gray-50 transition-colors"
              >
                <span>{item.question}</span>
                <span className="text-xl ml-4">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-[var(--color-text-light)] leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
