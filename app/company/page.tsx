import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要 | AISupports",
  description: "AISupports（mlma）の会社概要・登記情報・所在地・代表者情報。北海道を拠点にAI・DX支援を提供しています。",
};

const rows = [
  { label: "会社名",         value: "mlma（エムエルエムエー）" },
  { label: "代表者",         value: "代表 林 毅（Hayashi Tsuyoshi）" },
  { label: "設立",           value: "2024年" },
  { label: "所在地",         value: "〒060-0005 北海道札幌市中央区北5条西11丁目15-4" },
  { label: "事業内容",       value: "AI・DX支援、業務自動化コンサルティング、AIエージェント実装" },
  { label: "サービスエリア", value: "北海道全域（オンライン対応可）" },
  { label: "お問い合わせ",   value: "サイト内お問い合わせフォームよりご連絡ください" },
  { label: "Webサイト",      value: "https://aisupports.cc" },
];

export default function CompanyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFDF5" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{
            background: "#E8F4FD", color: "#3B9EE8",
            padding: "6px 20px", borderRadius: "999px",
            fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em",
          }}>COMPANY</span>
        </div>

        <h1 style={{
          textAlign: "center", fontSize: "2rem", fontWeight: 800,
          color: "#1A1A2E", marginBottom: "48px", marginTop: "12px",
        }}>会社概要</h1>

        <div style={{
          background: "#FFFFFF", borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(180,150,80,0.08)",
          overflow: "hidden", marginBottom: "48px",
        }}>
          {rows.map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "160px 1fr",
              borderBottom: i < rows.length - 1 ? "1px solid #F0EBE0" : "none",
            }}>
              <div style={{
                padding: "20px 24px", background: "#FFF8E7",
                color: "#4A4A6A", fontWeight: 600, fontSize: "14px",
              }}>{row.label}</div>
              <div style={{
                padding: "20px 24px", color: "#1A1A2E", fontSize: "15px",
              }}>{row.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: "linear-gradient(135deg, #E8F4FD, #FFF8E7)",
          borderRadius: "16px", padding: "32px",
          borderLeft: "4px solid #3B9EE8",
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px", color: "#1A1A2E", marginTop: 0 }}>
            代表メッセージ
          </h2>
          <p style={{ color: "#4A4A6A", lineHeight: 1.9, fontSize: "15px", margin: 0 }}>
            AISupportsは、北海道の中小企業・地域企業が「AIを使いこなす側」になれるよう、
            現場に寄り添った支援を提供しています。<br /><br />
            業務効率化はゴールではなく、スタートです。
            生まれた「余白」と「データ」を活かし、経営者と共に次のステージへの道筋を描きます。
            小さな一歩から、確実に成果を積み重ねてまいります。
          </p>
          <p style={{ marginTop: "24px", fontWeight: 700, color: "#1A1A2E", marginBottom: 0 }}>
            mlma 代表　林 毅
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a href="/" style={{
            color: "#3B9EE8", fontSize: "14px", fontWeight: 600,
            textDecoration: "none", borderBottom: "1px solid #3B9EE8", paddingBottom: "2px",
          }}>← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
