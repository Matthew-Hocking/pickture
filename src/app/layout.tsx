import { Golos_Text } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const golos_text = Golos_Text({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-golos_text",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={golos_text.variable}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
