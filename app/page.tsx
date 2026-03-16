const CONTACT_URL = "https://g1ciqlkhytu.typeform.com/to/erE8oAy1";

const services = [
  {
    no: "01",
    title: "業務整理・可視化",
    text: "紙・Excel・属人化した業務を整理し、改善優先順位を見える化します。",
  },
  {
    no: "02",
    title: "フォーム・申請DX",
    text: "申請、報告、予約、点検、HACCPなどをデジタル化し、入力負荷を下げます。",
  },
  {
    no: "03",
    title: "AI・自動化導入",
    text: "メール整理、見積補助、通知自動化など、現場で使えるAI活用を設計します。",
  },
  {
    no: "04",
    title: "ダッシュボード構築",
    text: "Google Sheets、Looker Studio、Notionなどで、進捗やKPIを見える化します。",
  },
  {
    no: "05",
    title: "Web導線整備",
    text: "ホームページ、問い合わせ導線、SNSや外部フォーム連携まで整えます。",
  },
  {
    no: "06",
    title: "定着支援",
    text: "導入して終わりではなく、運用改善と社内展開まで伴走します。",
  },
];

const works = [
  "スーパー・小売の申請DX、予約導線整備、メール整理",
  "製造・食品工場の工程入力、品質記録、見積補助",
  "銀行・信用金庫向けのDX提案支援、業務整理、ナレッジ整備",
  "中小企業向けのAI導入、ノーコード自動化、現場定着支援",
];

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <div className="container nav">
          <a href="#top" className="brand">
            AISupports
          </a>
          <nav className="menu">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#works">Works</a>
            <a href="#insights">Insights</a>
            <a href={CONTACT_URL} target="_blank" rel="noreferrer">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="container heroInner">
          <p className="eyebrow">AI / DX / Automation Support</p>
          <h1>
            AIとDXで、
            <br />
            現場業務を
            <br />
            動く仕組みに変える。
          </h1>
          <p className="lead">
            中小企業・地域企業向けに、業務整理、ノーコード自動化、AI活用、
            現場定着まで一気通貫で支援します。
          </p>
          <div className="heroActions">
            <a href="#services" className="button primary">
              支援内容を見る
            </a>
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              お問い合わせ
            </a>
          </div>
          <p className="tools">
            Google Workspace / Odoo / AppSheet / Power Automate / n8n / Dify /
            Notion / Wix
          </p>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container narrow">
          <p className="sectionLabel">About</p>
          <h2>現場に合うDXだけを、実装まで。</h2>
          <p className="sectionText">
            紙・Excel・属人化した業務を見直し、フォーム、データベース、通知、
            自動集計、AI活用までを一体で設計します。単なる提案ではなく、
            現場で使われる状態まで伴走します。
          </p>
        </div>
      </section>

      <section id="services" className="section borderTop">
        <div className="container">
          <div className="sectionHead">
            <div>
              <p className="sectionLabel">Services</p>
              <h2>提供サービス</h2>
            </div>
            <p className="sectionSideText">
              現場の課題整理から、小さく始める導入、改善と定着まで支援します。
            </p>
          </div>

          <div className="grid">
            {services.map((service) => (
              <article key={service.no} className="card">
                <p className="cardNo">{service.no}</p>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="works" className="section borderTop">
        <div className="container">
          <p className="sectionLabel">Works</p>
          <h2>支援領域・活用イメージ</h2>
          <div className="worksList">
            {works.map((item) => (
              <div key={item} className="workItem">
                <span className="workDot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="section borderTop">
        <div className="container narrow">
          <p className="sectionLabel">Insights</p>
          <h2>発信内容</h2>
          <p className="sectionText">
            AI活用、業務改善、地域企業のDX、現場実装ノウハウを継続的に発信します。
            note や Substack、SNS への導線も今後追加できます。
          </p>
        </div>
      </section>

      <section className="section cta borderTop">
        <div className="container ctaBox">
          <div>
            <p className="sectionLabel">Contact</p>
            <h2>業務改善の第一歩を、現場に合う形で。</h2>
            <p className="sectionText">
              何から始めればいいかわからない段階でも大丈夫です。
              現状整理から一緒に進めます。
            </p>
          </div>
          <div className="ctaActions">
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noreferrer"
              className="button primary"
            >
              相談する
            </a>
          </div>
        </div>
      </section>

      <footer className="footer borderTop">
        <div className="container footerInner">
          <div>
            <p className="footerBrand">AISupports</p>
            <p className="footerText">
              AI・DX・自動化で、現場に動く仕組みをつくる。
            </p>
          </div>
          <div className="footerLinks">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#works">Works</a>
            <a href={CONTACT_URL} target="_blank" rel="noreferrer">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}