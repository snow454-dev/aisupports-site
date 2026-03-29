import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "AISupports | AI・DXで現場業務を動く仕組みに変える",
  description:
    "中小企業・地域企業向けに、業務整理、AI活用、ノーコード自動化、現場定着まで一気通貫で支援します。北海道全域対応。金融・建設・医療・製造など業種を問わず実績多数。",
  keywords: [
    "AI導入", "業務自動化", "DX支援", "AIエージェント", "北海道",
    "中小企業DX", "ノーコード", "Dify", "LINE API", "業務効率化",
  ],
  authors: [{ name: "AISupports" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://aisupports.cc",
    title: "AISupports | AI・DXで現場業務を動く仕組みに変える",
    description:
      "中小企業・地域企業向けに、業務整理、AI活用、ノーコード自動化、現場定着まで一気通貫で支援します。北海道全域対応。",
    siteName: "AISupports",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AISupports | AI・DXで現場業務を動く仕組みに変える",
    description:
      "中小企業・地域企業向けに、業務整理、AI活用、ノーコード自動化、現場定着まで一気通貫で支援します。北海道全域対応。",
  },
  alternates: {
    canonical: "https://aisupports.cc",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF8E7",
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AISupports",
  "url": "https://aisupports.cc",
  "description": "中小企業・地域企業向けAI・DX支援。業務自動化からコンサルティングまで一気通貫。北海道全域対応。",
  "areaServed": "北海道",
  "serviceType": ["AI導入支援", "業務自動化", "DXコンサルティング", "AIエージェント開発"],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "相談・見積もりは無料ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、初回ヒアリングと実行提案書の作成は完全無料です。課題のExcelや業務フロー図を送っていただければ、具体的な改善提案書をお送りします。",
      },
    },
    {
      "@type": "Question",
      "name": "どのような企業が対象ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "中小企業・地域企業を中心に、金融・建設・医療・製造・農業・フィットネスなど幅広い業種に対応しています。北海道全域での現地対応が可能です。",
      },
    },
    {
      "@type": "Question",
      "name": "IT・DXの知識がなくても大丈夫ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、業務フローの棚卸しから始めますので、IT知識は不要です。現場の「困りごと」をヒアリングし、最適な自動化・AI化の方針をご提案します。",
      },
    },
    {
      "@type": "Question",
      "name": "既存システムやツールとの連携はできますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、LINE・Gmail・Excel・CRM・ERPなど既存ツールとのAPI連携に対応しています。ツールを変えずに仕組みを改善することも可能です。",
      },
    },
    {
      "@type": "Question",
      "name": "AIエージェント導入までどのくらいかかりますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "業務の複雑さや規模によりますが、シンプルな自動化であれば1〜2週間で動く仕組みを構築します。まずヒアリングで具体的なスケジュールをご提案します。",
      },
    },
    {
      "@type": "Question",
      "name": "北海道以外でも対応できますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、オンラインでの対応が可能です。ただし、現地訪問・現場密着型の支援については北海道全域を主な対応エリアとしています。",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
