import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundImage: "url('/grid-bg.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
