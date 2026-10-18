import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Providers } from "./providers";
import { siteUrl } from "../lib/site-url";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Addis Eats",
    template: "%s | Addis Eats",
  },
  description:
    "Discover Ethiopian dishes and order from the Addis Eats menu.",
  applicationName: "Addis Eats",
  openGraph: {
    type: "website",
    siteName: "Addis Eats",
    title: "Addis Eats",
    description:
      "Discover Ethiopian dishes and order from the Addis Eats menu.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats",
    description:
      "Discover Ethiopian dishes and order from the Addis Eats menu.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}