import Navbar from "@/components/private/Navbar";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Navbar />
      <main className="flex-1 w-full bg-zinc-50">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}
