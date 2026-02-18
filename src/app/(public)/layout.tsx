import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WhatsAppFab from "@/components/shared/whatsapp-fab";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
