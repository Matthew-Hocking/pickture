import { Rubik } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-rubik",
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={rubik.variable}>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}