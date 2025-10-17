import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "HYPE - Gestión de Eventos Inmersiva",
  description: "Plataforma futurista de gestión de eventos con visualización 3D",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(30, 27, 75, 0.9)",
              color: "#f8fafc",
              border: "1px solid rgba(147, 51, 234, 0.3)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  )
}
