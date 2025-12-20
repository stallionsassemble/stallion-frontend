import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area - Flex 1 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8"
          style={{
            backgroundImage: "url('/grid-bg.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto"
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
