import { api } from "@/lib/api";
import LeaderDetailClient from "./LeaderDetailClient";

export async function generateStaticParams() {
  try {
    const members = await api.getMembers();
    return members.filter((m: any) => m.id).map((m: any) => ({ id: String(m.id) }));
  } catch {
    return [{ id: "1" }, { id: "2" }, { id: "3" }];
  }
}

export default function LeaderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <LeaderDetailClient params={params} />;
}
