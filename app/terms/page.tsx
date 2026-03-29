import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | AISupports",
  description: "AISupportsの利用規約。サービスご利用にあたっての条件を定めています。",
};

const terms = [
  {
    title: "第1条（適用範囲）",
    content: `本規約は、mlma（AISupports、以下「当社」）が提供するすべてのサービス
（以下「本サービス」）の利用に適用されます。
本サービスをご利用いただくことで、本規約に同意いただいたものとみなします。`,
  },
  {
    title: "第2条（サービス内容）",
    content: `当社は、AI・DX支援、業務自動化コンサルティング、AIエージェント実装支援
およびこれらに付随するサービスを提供します。
サービス内容は、別途締結する個別契約または提案書に基づきます。`,
  },
  {
    title: "第3条（お問い合わせ・無料相談）",
    content: `当サイトのお問い合わせフォームからのご相談・ヒアリングは無料です。
無料相談の実施は、有償サービスの契約を保証するものではありません。
提案書・見積書の作成・送付も無料で対応いたします。`,
  },
  {
    title: "第4条（禁止事項）",
    content: `利用者は以下の行為を行ってはなりません。
・虚偽の情報を入力してのお問い合わせ
・当社サービスを通じた違法行為
・当社の知的財産権を侵害する行為
・当社の業務を妨害する行為
・その他当社が不適切と判断する行為`,
  },
  {
    title: "第5条（知的財産権）",
    content: `当サイトおよび当社が提供する資料・提案書・ツール等の知的財産権は、
当社または正当な権利者に帰属します。
無断転載・複製・二次利用はお断りします。`,
  },
  {
    title: "第6条（免責事項）",
    content: `当社は、本サービスに関して以下について責任を負いません。
・お客様の環境・設定に起因するトラブル
・天災・通信障害等の不可抗力によるサービス停止
・第三者のツール・APIに起因する問題
・間接損害・逸失利益

当社の責任は、個別契約に定める範囲に限定されます。`,
  },
  {
    title: "第7条（サービスの変更・停止）",
    content: `当社は、事前通知なくサービス内容の変更・追加・停止を行う場合があります。
これによりお客様に生じた損害について、当社は責任を負いません。`,
  },
  {
    title: "第8条（準拠法・管轄裁判所）",
    content: `本規約は日本法に準拠します。
本サービスに関する紛争については、北海道を管轄する裁判所を
第一審の専属的合意管轄裁判所とします。`,
  },
  {
    title: "第9条（規約の変更）",
    content: `当社は必要に応じて本規約を変更することがあります。
変更後の規約はサイト上に掲載した時点で効力を生じます。`,
  },
];

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#FFFDF5" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{
            background: "#E8F4FD", color: "#3B9EE8",
            padding: "6px 20px", borderRadius: "999px",
            fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em",
          }}>TERMS OF SERVICE</span>
        </div>

        <h1 style={{
          textAlign: "center", fontSize: "2rem", fontWeight: 800,
          color: "#1A1A2E", marginBottom: "8px", marginTop: "12px",
        }}>利用規約</h1>
        <p style={{
          textAlign: "center", color: "#8A8AAA", marginBottom: "40px", fontSize: "14px",
        }}>制定日：2024年　最終更新：2026年3月</p>

        {terms.map((t, i) => (
          <div key={i} style={{
            background: "#FFFFFF", borderRadius: "12px",
            padding: "28px 32px", marginBottom: "12px",
            boxShadow: "0 2px 12px rgba(180,150,80,0.06)",
          }}>
            <h2 style={{
              fontSize: "1rem", fontWeight: 700, color: "#3B9EE8",
              marginBottom: "12px", marginTop: 0,
            }}>{t.title}</h2>
            <p style={{
              color: "#4A4A6A", lineHeight: 1.9, fontSize: "14px",
              whiteSpace: "pre-line", margin: 0,
            }}>{t.content}</p>
          </div>
        ))}

        <p style={{
          textAlign: "center", color: "#8A8AAA", marginTop: "40px", fontSize: "14px",
        }}>
          mlma（AISupports）<br />
          制定：2024年　改訂：2026年3月
        </p>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/" style={{
            color: "#3B9EE8", fontSize: "14px", fontWeight: 600,
            textDecoration: "none", borderBottom: "1px solid #3B9EE8", paddingBottom: "2px",
          }}>← トップページに戻る</a>
        </div>
      </div>
    </main>
  );
}
