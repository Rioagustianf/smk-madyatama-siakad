import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/molecules/Navigation/Navigation";
import { Footer } from "@/components/molecules/Footer/Footer";
import { school } from "@/lib/school";
import { HideOnDashboard } from "@/components/molecules/HideOnDashboard/HideOnDashboard";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: `${school.name} - Sistem Informasi Akademik`,
  icons: {
    icon: "/favicon.ico",
  },
  description: `Profil, program keahlian, fasilitas, dan informasi akademik ${school.name}.`,
  keywords:
    "SMK, SIAKAD, sistem informasi akademik, sekolah menengah kejuruan, pendidikan",
  authors: [{ name: school.name }],
  creator: school.name,
  publisher: school.name,
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "http://localhost:3000",
    title: `${school.name} - Sistem Informasi Akademik`,
    description: `Profil, program keahlian, fasilitas, dan informasi akademik ${school.name}.`,
    siteName: school.name,
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${school.name} - Sistem Informasi Akademik`,
    description: `Profil, program keahlian, fasilitas, dan informasi akademik ${school.name}.`,
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-inter antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <HideOnDashboard>
              <Navigation />
            </HideOnDashboard>
            <main className="flex-grow">{children}</main>
            <HideOnDashboard>
              <Footer />
            </HideOnDashboard>
          </div>
        </Providers>
      </body>
    </html>
  );
}
