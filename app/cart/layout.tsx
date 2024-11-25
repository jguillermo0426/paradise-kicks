import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Paradise Kicks",
};


  export default function CartLayout({
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
  