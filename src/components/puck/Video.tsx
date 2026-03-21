export function Video({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  function getEmbedUrl(raw: string): string | null {
    if (!raw) return null;
    // YouTube
    const ytMatch = raw.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
    );
    if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = raw.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
  }

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <section className="section-padding">
        <div className="max-w-4xl mx-auto text-center text-[var(--color-text-light)]">
          {url ? "Ungültige Video-URL" : "Bitte Video-URL eingeben"}
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2 className="text-2xl font-bold font-heading text-center mb-6 text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Video"}
          />
        </div>
      </div>
    </section>
  );
}
