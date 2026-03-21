export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin has its own full-screen layout — no nav/footer
  return <>{children}</>;
}
