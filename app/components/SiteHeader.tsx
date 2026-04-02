"use client";

import { useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <a href="/" className="brand-wrap">
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
              <rect width="32" height="32" rx="9" fill="#3B9EE8"/>
              <polygon points="16,5 7,27 12,27 16,16 20,27 25,27" fill="#FFF8E7"/>
              <rect x="13" y="19" width="6" height="2.5" rx="1" fill="#F5C842"/>
            </svg>
            <span className="brand-name">AISupports</span>
          </a>
          
          {/* 元の nav クラスとレイアウトを完全に復元 */}
          <nav className="nav">
            <a href="/#results">実績</a>
            
            {/* サービス項目だけをドロップダウン化（元のデザインを維持） */}
            <div className="group relative flex items-center h-full">
              <a href="/#services" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                サービス <span className="transition-transform duration-200 group-hover:rotate-180" style={{ fontSize: "10px", opacity: 0.6 }}>▼</span>
              </a>
              
              {/* ドロップダウンメニューの白い箱 */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                <div style={{ backgroundColor: "#ffffff", minWidth: "220px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", borderRadius: "8px", padding: "8px 0", border: "1px solid rgba(13,31,45,0.08)", display: "flex", flexDirection: "column" }}>
                  <a href="https://www.hojyokins.jp/" target="_blank" rel="noopener noreferrer" className="hover:bg-[#f4f7fa] hover:text-[#3b9ee8]" style={{ opacity: 1, padding: "12px 20px", display: "block" }}>
                    補助金申請AIサポート
                  </a>
                  <a href="/#services" className="hover:bg-[#f4f7fa] hover:text-[#3b9ee8]" style={{ opacity: 1, padding: "12px 20px", display: "block" }}>
                    その他のサービス
                  </a>
                </div>
              </div>
            </div>

            {/* 消してしまっていた元のメニュー項目を復元 */}
            <a href="/#ai-agent">AIエージェント</a>
            <a href="/#consulting">コンサルティング</a>
            <a href="/#process">進め方</a>
            <a href="/#contact">お問い合わせ</a>
          </nav>

          <a className="btn btn-sm btn-primary" href="/#contact">無料相談</a>
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
      
      {/* モバイルメニュー（スマホ版） */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="/#results"    onClick={close}>実績</a>
        <a href="/#services"   onClick={close}>サービス</a>
        
        {/* スマホ版の補助金リンク追加 */}
        <a href="https://www.hojyokins.jp/" target="_blank" rel="noopener noreferrer" style={{ paddingLeft: "32px", fontSize: "14px", borderBottom: "none", paddingTop: "0", opacity: 0.8 }} onClick={close}>
          ↳ 補助金申請AIサポート
        </a>
        
        {/* 元のメニュー項目を復元 */}
        <a href="/#ai-agent"   onClick={close}>AIエージェント</a>
        <a href="/#consulting" onClick={close}>コンサルティング</a>
        <a href="/#process"    onClick={close}>進め方</a>
        <a href="/#contact"    onClick={close}>お問い合わせ</a>
      </div>
      <div className="topbar-spacer" />
    </>
  );
}
