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
          <nav className="nav">
            <a href="/#results">実績</a>
            <a href="/#services">サービス</a>
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
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="/#results"    onClick={close}>実績</a>
        <a href="/#services"   onClick={close}>サービス</a>
        <a href="/#ai-agent"   onClick={close}>AIエージェント</a>
        <a href="/#consulting" onClick={close}>コンサルティング</a>
        <a href="/#process"    onClick={close}>進め方</a>
        <a href="/#contact"    onClick={close}>お問い合わせ</a>
      </div>
      <div className="topbar-spacer" />
    </>
  );
}
