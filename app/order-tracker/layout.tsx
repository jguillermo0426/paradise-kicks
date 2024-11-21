import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Paradise Kicks",
};


  export default function OrderTrackerLayout({
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
  