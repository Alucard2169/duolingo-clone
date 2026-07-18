import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.className} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}