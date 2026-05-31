import type { Metadata } from "next";
import { Hanken_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { ToastHost } from "@/components/ToastHost";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Display serif for marketing headlines — characterful, editorial, the
// opposite of generic. Optical-size axis on for large display use.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "SideQuest — Your career starts here.",
  description:
    "SideQuest helps London students stack real co-op hours across local businesses and get certified — and helps small businesses hire student talent, pay-per-placement, fully WSIB-covered.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${hanken.variable} ${fraunces.variable}`}>
      <body>
        <StoreProvider>
          {children}
          <ToastHost />
        </StoreProvider>
      </body>
    </html>
  );
}
