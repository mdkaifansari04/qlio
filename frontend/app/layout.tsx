import Footer from "@/components/shared/footer";
import NavbarContainer from "@/components/shared/navbar-container";
import { ThemeProvider } from "@/components/shared/theme-provider";
import type { Metadata } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/provider/client-provider";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/provider/socket-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qlio",
  description: "A job queue for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} antialiased`}
      >
        <ClientProvider>
          <SocketProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavbarContainer />
              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </SocketProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
