
import { api } from "@/lib/api";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { SideNav } from "@/components/SideNav";
import { UserProvider } from "@/lib/user-context";

export const dynamic = "force-dynamic";


export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await api.getMe();

  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <TopBar />
        <SideNav />
        <main className="mx-auto max-w-4xl px-4 py-6 pb-24 sm:pb-6 sm:pl-60 sm:pr-8">{children}</main>
        <BottomNav />
      </div>
    </UserProvider>
  );
}