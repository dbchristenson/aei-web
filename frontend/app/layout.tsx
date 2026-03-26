import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PT Agra Energi Indonesia",
    template: "%s | AEI",
  },
  description:
    "PT Agra Energi Indonesia — high-impact oil & gas exploration and geothermal development in Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("aei-theme");if(!t)t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)})();`,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-fg-inverse focus:rounded-[var(--radius-button)] focus:font-body focus:text-small"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <NavBar />
          <div id="main-content">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
