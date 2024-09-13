import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import '@mantine/core/styles.css';

export const metadata: Metadata = {
  title: "Paradise Kicks Admin Dashboard"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
