import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AISupports | AI・DXで現場業務を動く仕組みに変える",
  description:
    "中小企業・地域企業向けに、業務整理、AI活用、ノーコード自動化、現場定着まで一気通貫で支援します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}