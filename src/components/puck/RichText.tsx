export function RichText({ content }: { content: string }) {
  return (
    <section className="section-padding">
      <div
        className="max-w-3xl mx-auto prose prose-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
