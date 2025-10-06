import "../styles/globals.css";
import ClientProvider from "@/providers/clientProvider";
import { AuthProvider } from "@/components/authProvider";
import BaseLayout from "@/components/layout/BaseLayout";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Smart Onboarding App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <AuthProvider>
            <Navbar />
            <BaseLayout>{children}</BaseLayout>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
