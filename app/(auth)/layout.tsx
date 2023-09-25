// This page is from the docs of clerk 
// https://clerk.com/docs/quickstarts/nextjs
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from 'next/font/google'
import React, { ReducerAction } from "react";
import '../globals.css'

export const metadata = {
  title: 'Thread',
  description: "A Next.js 13 meta thread application"
}

const inter = Inter({subsets:["latin"]})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
               <body className={`${inter.className} bg-dark-1`}>{children}</body>

      </html>
    </ClerkProvider>
  ) 
}