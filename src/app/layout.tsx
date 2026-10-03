import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive English P.1",
  description: "Interactive English learning web app for Thai Grade 1 students"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
