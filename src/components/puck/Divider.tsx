export function Divider({
  style = "space",
  height = 48,
}: {
  style: "line" | "space" | "decorative";
  height: number;
}) {
  if (style === "line") {
    return (
      <div className="max-w-6xl mx-auto px-6" style={{ padding: `${height / 2}px 24px` }}>
        <hr className="border-[var(--color-border)]" />
      </div>
    );
  }

  if (style === "decorative") {
    return (
      <div className="flex justify-center" style={{ padding: `${height / 2}px 0` }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-[var(--color-primary)] opacity-40" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-60" />
          <div className="w-12 h-px bg-[var(--color-primary)] opacity-40" />
        </div>
      </div>
    );
  }

  return <div style={{ height: `${height}px` }} />;
}
