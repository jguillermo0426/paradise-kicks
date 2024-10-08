import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Paradise Kicks Admin Dashboard",
};


  export default function InventoryLayout({
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
  