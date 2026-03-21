import { AdminClient } from "./client";

export default function AdminPage() {
  return <AdminClient />;
}

export function generateStaticParams() {
  return [{ puckPath: [] }];
}
