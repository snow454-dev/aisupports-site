"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback, FormEvent, DragEvent } from "react";

/* ══════════════════════════════════════════════════════════════
   Custom Cursor
   ══════════════════════════════════════════════════════════════ */
function CursorGlow() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);
  const pos = useRef({ mx: -200, my: -200, rx: -200, ry: -200 });
  const trailPos = useRef<{ x: number; y: number }[]>([]);
  const TRAIL = 8;

  useEffect(() => {
    trailPos.current = Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 }));
    const onMove = (e: MouseEvent) => { pos.current.mx = e.clientX; pos.current.my = e.clientY; };
    let raf: number;
    const tick = () => {
      const { mx, my } = pos.current;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx - 5}px,${my - 5}px)`;
      pos.current.rx += (mx - pos.current.rx) * 0.11;
      pos.current.ry += (my - pos.current.ry) * 0.11;
      if (ringRef.current) ringRef.current.style.transform = `translate(${pos.current.rx - 22}px,${pos.current.ry - 22}px)`;
      trailPos.current.unshift({ x: mx, y: my });
      trailPos.current.length = TRAIL;
      trailRef.current.forEach((el, i) => {
        if (!el) return;
        const t = trailPos.current[i];
        const scale = 1 - i / TRAIL;
        el.style.transform = `translate(${t.x - 4}px,${t.y - 4}px) scale(${scale})`;
        el.style.opacity = String((1 - i / TRAIL) * 0.28);
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div className="cursor-dot"  ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div key={i} className="cursor-trail" ref={(el) => { if (el) trailRef.current[i] = el; }} />
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   3-D Tilt Hook
   ══════════════════════════════════════════════════════════════ */
function useTilt(strength = 7) {
  const ref = useRef<HTMLElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const tx = ((e.clientX - r.left  - r.width  / 2) / (r.width  / 2)) *  strength;
    const ty = ((e.clientY - r.top   - r.height / 2) / (r.height / 2)) * -strength;
    el.style.transition = "transform 0.05s linear";
    el.style.transform  = `perspective(700px) rotateX(${ty}deg) rotateY(${tx}deg) translateY(-6px)`;
  }, [strength]);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = "transform 0.45s ease";
    el.style.transform  = "";
  }, []);
  return { ref, onMouseMove: onMove, onMouseLeave: onLeave } as const;
}

/* ══════════════════════════════════════════════════════════════
   Counter
   ══════════════════════════════════════════════════════════════ */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const elRef   = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = elRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now(); const dur = 1800;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={elRef}>{val}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════════
   Hero Workflow SVG
   ══════════════════════════════════════════════════════════════ */
function WorkflowSVG() {
  const edges = [
    { id: "e1", d: "M80,72 C165,72 175,190 240,190",   delay: "0s",   dur: "2.6s" },
    { id: "e2", d: "M400,72 C315,72 305,190 240,190",  delay: "0.4s", dur: "2.8s" },
    { id: "e3", d: "M80,308 C165,308 175,190 240,190", delay: "0.8s", dur: "2.5s" },
    { id: "e4", d: "M240,348 L240,190",                delay: "1.2s", dur: "2.2s" },
    { id: "e5", d: "M400,308 C315,308 305,190 240,190",delay: "1.6s", dur: "2.9s" },
  ];
  const outerNodes = [
    { x: 80,  y: 72,  label: "Gmail", icon: "✉️" },
    { x: 400, y: 72,  label: "LINE",  icon: "💬" },
    { x: 80,  y: 308, label: "ERP",   icon: "🏢" },
    { x: 240, y: 348, label: "CRM",   icon: "📊" },
    { x: 400, y: 308, label: "Slack", icon: "🔔" },
  ];
  return (
    <div className="workflow-wrap">
      <svg viewBox="0 0 480 430" className="workflow-svg" aria-label="AIワークフロー図">
        <defs>
          <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#3B9EE8" />
            <stop offset="100%" stopColor="#5BC4F0" />
          </linearGradient>
          <linearGradient id="nodeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3B9EE8" />
            <stop offset="100%" stopColor="#5BC4F0" />
          </linearGradient>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1a6cf5" floodOpacity="0.15"/>
          </filter>
          <filter id="centerShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#1a6cf5" floodOpacity="0.28"/>
          </filter>
        </defs>

        {edges.map(e => (
          <path key={`b-${e.id}`} d={e.d} fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="2"/>
        ))}
        {edges.map(e => (
          <path key={e.id} id={e.id} d={e.d} fill="none"
            stroke="url(#brandGrad)" strokeWidth="2" strokeDasharray="7 5"
            className="flow-edge" style={{ animationDelay: e.delay }}/>
        ))}
        {edges.map((e, i) => (
          <circle key={`p-${i}`} r="4.5" fill="#06b6d4" filter="url(#glow)">
            <animateMotion dur={e.dur} repeatCount="indefinite" begin={e.delay}>
              <mpath href={`#${e.id}`}/>
            </animateMotion>
          </circle>
        ))}

        {outerNodes.map(n => (
          <g key={n.label} transform={`translate(${n.x},${n.y})`}>
            <circle r="38" fill="white" stroke="rgba(26,108,245,0.18)" strokeWidth="1.5" filter="url(#nodeShadow)"/>
            <text y="-5"  textAnchor="middle" fontSize="20">{n.icon}</text>
            <text y="16"  textAnchor="middle" fontSize="9.5" fill="#1a6cf5"
              fontWeight="700" letterSpacing="0.05em" fontFamily="system-ui,sans-serif">
              {n.label}
            </text>
          </g>
        ))}

        <circle cx="240" cy="190" r="74" fill="rgba(26,108,245,0.05)" className="pulse-ring-2"/>
        <circle cx="240" cy="190" r="58" fill="rgba(26,108,245,0.09)" className="pulse-ring-1"/>
        <circle cx="240" cy="190" r="46" fill="url(#nodeGrad)" filter="url(#centerShadow)"/>
        <text x="240" y="182" textAnchor="middle" fontSize="22">🤖</text>
        <text x="240" y="204" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.92)"
          fontWeight="800" letterSpacing="0.12em" fontFamily="system-ui,sans-serif">
          AI AGENT
        </text>
      </svg>
      <div className="flow-status-chips">
        <div className="flow-chip flow-chip-active"><span className="chip-dot"/>自動処理中</div>
        <div className="flow-chip">128 tasks / day</div>
        <div className="flow-chip">99.2% uptime</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Contact Form
   ══════════════════════════════════════════════════════════════ */
type FormStatus = "idle" | "sending" | "success" | "error";

const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

function ContactForm() {
  const [status, setStatus]         = useState<FormStatus>("idle");
  const [file,   setFile]           = useState<File | null>(null);
  const [dragging, setDragging]     = useState(false);
  const [errorMsg, setErrorMsg]     = useState<string>("送信に失敗しました。時間をおいて再度お試しください。");
  const [agreed, setAgreed]         = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFile = (f: File | null | undefined) => {
    if (!f) return;
    if (f.size > FILE_SIZE_LIMIT) {
      setErrorMsg(`ファイルサイズが大きすぎます（上限 10MB）。現在: ${(f.size / 1024 / 1024).toFixed(1)} MB`);
      setStatus("error");
      return;
    }
    setFile(f);
    if (status === "error") { setStatus("idle"); }
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!agreed) return;
    if (file && file.size > FILE_SIZE_LIMIT) {
      setErrorMsg(`ファイルサイズが大きすぎます（上限 10MB）`);
      setStatus("error");
      return;
    }
    setStatus("sending");

    const buildFormData = (withFile: boolean) => {
      const data = new FormData(e.currentTarget);
      if (withFile && file) data.append("attachment", file);
      return data;
    };

    const send = async (data: FormData) =>
      fetch("https://formspree.io/f/mojkzggk", {
        method: "POST", body: data, headers: { Accept: "application/json" },
      });

    try {
      // まずファイルありで送信を試みる
      let res = await send(buildFormData(true));

      // ファイルが原因でエラーになった場合はファイルなしで再送
      if (!res.ok && file) {
        const body = await res.json().catch(() => ({}));
        const isFileError = JSON.stringify(body).toLowerCase().includes("file")
          || JSON.stringify(body).toLowerCase().includes("attachment")
          || JSON.stringify(body).toLowerCase().includes("upload");
        if (isFileError) {
          res = await send(buildFormData(false));
          if (res.ok) {
            setStatus("success");
            formRef.current?.reset();
            setFile(null);
            setAgreed(false);
            setSubmitAttempted(false);
            setErrorMsg("お問い合わせ内容は送信できましたが、ファイルの添付には対応していません。ファイルは別途メールにてお送りください。");
            return;
          }
        }
      }

      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
        setFile(null);
        setAgreed(false);
        setSubmitAttempted(false);
      } else {
        let msg = "送信に失敗しました。時間をおいて再度お試しください。";
        try {
          const body = await res.json();
          if (body?.errors?.[0]?.message) msg = body.errors[0].message;
        } catch { /* ignore */ }
        setErrorMsg(msg);
        setStatus("error");
      }
    } catch {
      setErrorMsg("ネットワークエラーが発生しました。接続を確認して再度お試しください。");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="form-success">
        <div className="form-success-icon">✓</div>
        <h3>送信しました</h3>
        <p>内容を確認次第、見積もりと実行提案書をお送りします。<br/>通常1〜2営業日以内にご連絡いたします。</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">企業名 <span className="req">*</span></label>
          <input className="form-input" name="company" type="text" placeholder="株式会社〇〇" required />
        </div>
        <div className="form-field">
          <label className="form-label">担当者名 <span className="req">*</span></label>
          <input className="form-input" name="name" type="text" placeholder="山田 太郎" required />
        </div>
      </div>
      <div className="form-field">
        <label className="form-label">メールアドレス <span className="req">*</span></label>
        <input className="form-input" name="email" type="email" placeholder="yamada@company.co.jp" required />
      </div>
      <div className="form-field">
        <label className="form-label">お問い合わせ内容 <span className="req">*</span></label>
        <textarea className="form-textarea" name="message" rows={5}
          placeholder="現在の課題や自動化したい業務、ご要望などをご記入ください。" required />
      </div>
      <div className="form-field">
        <label className="form-label">
          ファイル添付
          <span className="form-label-note">（任意 — 課題のExcel・業務フロー図・データなど）</span>
        </label>
        <div
          className={`drop-zone${dragging ? " drag-over" : ""}${file ? " has-file" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input id="file-input" type="file" style={{ display: "none" }}
            accept=".xlsx,.xls,.csv,.pdf,.docx,.doc,.png,.jpg,.jpeg,.zip"
            onChange={(e) => handleFile(e.target.files?.[0])} />
          {file ? (
            <div className="drop-zone-file">
              <span className="dz-icon">📎</span>
              <div>
                <div className="dz-filename">{file.name}</div>
                <div className="dz-size">{(file.size / 1024).toFixed(0)} KB</div>
              </div>
              <button type="button" className="dz-remove"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
            </div>
          ) : (
            <div className="drop-zone-idle">
              <span className="dz-icon">📂</span>
              <div>
                <div className="dz-main">ファイルをドラッグ＆ドロップ、またはクリックして選択</div>
                <div className="dz-sub">Excel・CSV・PDF・画像など。添付いただければ、より具体的な見積もりと実行提案書を即座に作成します。</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* プライバシーポリシー同意 */}
      <div className="privacy-agree-wrap">
        <input
          type="checkbox"
          id="privacy-agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="privacy-agree-check"
        />
        <label htmlFor="privacy-agree" className="privacy-agree-label">
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="privacy-agree-link">
            プライバシーポリシー
          </a>
          を読み、内容に同意します。<span className="req" style={{ marginLeft: "4px" }}>*</span>
        </label>
      </div>
      {submitAttempted && !agreed && (
        <p className="privacy-agree-error">プライバシーポリシーへの同意が必要です</p>
      )}

      {status === "error" && <div className="form-error">{errorMsg}</div>}
      <button type="submit"
        className={`btn btn-primary form-submit${status === "sending" ? " sending" : ""}${!agreed ? " form-submit-disabled" : ""}`}
        disabled={status === "sending"}>
        {status === "sending" ? <><span className="spinner"/>送信中…</> : "相談・見積もり依頼を送る →"}
      </button>
      <p className="form-note">ファイルを送っていただければ、現状分析と改善提案書を無料でお送りします。</p>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════
   Agent Card SVG Illustrations — flat design, no outlines
   ══════════════════════════════════════════════════════════════ */
const SKIN = "#FFD5A8";
const HAIR = "#1A1A2E";

// 1. 自動見積もり生成 — blue male with tablet, docs flying
function IllustQuotation() {
  return (
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Chair */}
      <rect x="78" y="112" width="44" height="6" rx="3" fill="#C8D8E8"/>
      <rect x="88" y="118" width="6" height="16" rx="2" fill="#B0C4D8"/>
      <rect x="106" y="118" width="6" height="16" rx="2" fill="#B0C4D8"/>
      {/* Body */}
      <rect x="82" y="72" width="36" height="42" rx="8" fill="#4A90D9"/>
      {/* Head */}
      <ellipse cx="100" cy="60" rx="18" ry="20" fill={SKIN}/>
      {/* Hair */}
      <ellipse cx="100" cy="44" rx="18" ry="12" fill={HAIR}/>
      <rect x="82" y="44" width="7" height="18" rx="3" fill={HAIR}/>
      {/* Tablet */}
      <rect x="104" y="82" width="26" height="20" rx="3" fill="#E8F4FD"/>
      <rect x="106" y="84" width="22" height="14" rx="2" fill="#3B9EE8"/>
      <rect x="108" y="86" width="10" height="2" rx="1" fill="rgba(255,255,255,0.8)"/>
      <rect x="108" y="90" width="14" height="2" rx="1" fill="rgba(255,255,255,0.6)"/>
      {/* Arm */}
      <rect x="96" y="88" width="12" height="8" rx="4" fill={SKIN}/>
      {/* Flying docs */}
      <rect x="138" y="48" width="22" height="28" rx="3" fill="#FFF8E7" transform="rotate(12 138 48)"/>
      <rect x="140" y="54" width="14" height="2" rx="1" fill="#F5C842" transform="rotate(12 140 54)"/>
      <rect x="140" y="58" width="10" height="2" rx="1" fill="#E0D8CC" transform="rotate(12 140 58)"/>
      <rect x="125" y="35" width="18" height="22" rx="3" fill="#E8F4FD" transform="rotate(-8 125 35)"/>
      <rect x="127" y="40" width="11" height="2" rx="1" fill="#3B9EE8" transform="rotate(-8 127 40)"/>
      <rect x="127" y="44" width="8" height="2" rx="1" fill="#C8D8E8" transform="rotate(-8 127 44)"/>
      {/* Check mark */}
      <circle cx="152" cy="85" r="9" fill="#6DD44A"/>
      <polyline points="147,85 151,89 157,82" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 2. 欠品処理・タイマー自動化 — coral female running, boxes + clock
function IllustStockout() {
  return (
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="95" cy="138" rx="28" ry="5" fill="rgba(0,0,0,0.06)"/>
      {/* Legs */}
      <rect x="72" y="100" width="16" height="38" rx="8" fill="#2ECC71" transform="rotate(-15 72 100)"/>
      <rect x="90" y="98" width="16" height="38" rx="8" fill="#2ECC71" transform="rotate(10 90 98)"/>
      {/* Shoes */}
      <ellipse cx="64" cy="136" rx="10" ry="6" fill={HAIR}/>
      <ellipse cx="104" cy="132" rx="10" ry="6" fill={HAIR}/>
      {/* Body */}
      <rect x="68" y="62" width="38" height="42" rx="10" fill="#FF6B6B"/>
      {/* Head */}
      <ellipse cx="87" cy="50" rx="18" ry="20" fill={SKIN}/>
      {/* Hair */}
      <ellipse cx="87" cy="34" rx="18" ry="12" fill={HAIR}/>
      <ellipse cx="78" cy="46" rx="5" ry="12" fill={HAIR}/>
      {/* Arms */}
      <rect x="50" y="68" width="24" height="12" rx="6" fill="#FF6B6B" transform="rotate(20 50 68)"/>
      <rect x="94" y="64" width="24" height="12" rx="6" fill="#FF6B6B" transform="rotate(-25 94 64)"/>
      {/* Box */}
      <rect x="30" y="60" width="28" height="28" rx="4" fill="#FFF3D0"/>
      <rect x="30" y="60" width="28" height="10" rx="4" fill="#F5C842"/>
      <rect x="42" y="60" width="4" height="28" fill="rgba(245,200,66,0.5)"/>
      {/* Clock */}
      <circle cx="158" cy="65" r="22" fill="#E8F4FD"/>
      <circle cx="158" cy="65" r="18" fill="white"/>
      <line x1="158" y1="65" x2="158" y2="51" stroke="#3B9EE8" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="158" y1="65" x2="168" y2="70" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="158" cy="65" r="3" fill="#1A1A2E"/>
      {/* Auto label */}
      <rect x="140" y="92" width="36" height="14" rx="7" fill="#6DD44A"/>
      <text x="158" y="103" textAnchor="middle" fontSize="7" fill="white" fontWeight="700" fontFamily="system-ui">AUTO</text>
    </svg>
  );
}

// 3. 自動シフト管理 — purple male arms crossed, calendar
function IllustShift() {
  return (
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Calendar */}
      <rect x="106" y="28" width="72" height="80" rx="8" fill="white" stroke="#F0EBE0" strokeWidth="1.5"/>
      <rect x="106" y="28" width="72" height="20" rx="8" fill="#3B9EE8"/>
      <rect x="106" y="40" width="72" height="8" fill="#3B9EE8"/>
      {/* Calendar circles */}
      {[0,1,2,3,4,5].map(i => (
        <circle key={i} cx={118 + (i % 3) * 20} cy={72 + Math.floor(i/3) * 22} r="7"
          fill={i === 1 || i === 4 ? "#6DD44A" : i === 2 ? "#FF6B6B" : "#E8F4FD"}/>
      ))}
      {/* Legs */}
      <rect x="56" y="104" width="16" height="38" rx="8" fill="#2C3E50"/>
      <rect x="74" y="104" width="16" height="38" rx="8" fill="#2C3E50"/>
      {/* Body */}
      <rect x="50" y="64" width="48" height="44" rx="10" fill="#8E44AD"/>
      {/* Arms crossed */}
      <rect x="28" y="76" width="28" height="12" rx="6" fill="#8E44AD" transform="rotate(-10 28 76)"/>
      <rect x="90" y="72" width="28" height="12" rx="6" fill="#8E44AD" transform="rotate(10 90 72)"/>
      {/* Head */}
      <ellipse cx="74" cy="52" rx="18" ry="20" fill={SKIN}/>
      {/* Hair */}
      <rect x="56" y="36" width="36" height="20" rx="10" fill={HAIR}/>
      <text x="74" y="100" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)" fontFamily="system-ui">✓ AUTO</text>
    </svg>
  );
}

// 4. 医療・売上予測 — white coat female with rising chart
function IllustMedical() {
  return (
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Chart board */}
      <rect x="100" y="22" width="78" height="80" rx="8" fill="white" stroke="#F0EBE0" strokeWidth="1.5"/>
      <rect x="100" y="22" width="78" height="14" rx="8" fill="#3B9EE8"/>
      <rect x="100" y="28" width="78" height="8" fill="#3B9EE8"/>
      {/* Chart line */}
      <polyline points="112,88 126,76 140,80 154,62 168,48" fill="none" stroke="#6DD44A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="168" cy="48" r="5" fill="#6DD44A"/>
      {/* Y axis */}
      <line x1="112" y1="44" x2="112" y2="92" stroke="#E0D8CC" strokeWidth="1.5"/>
      <line x1="112" y1="92" x2="172" y2="92" stroke="#E0D8CC" strokeWidth="1.5"/>
      {/* Legs */}
      <rect x="52" y="106" width="14" height="36" rx="7" fill="#4A4A6A"/>
      <rect x="68" y="106" width="14" height="36" rx="7" fill="#4A4A6A"/>
      {/* White coat */}
      <rect x="42" y="64" width="50" height="46" rx="10" fill="#F8F8F8"/>
      <rect x="62" y="64" width="10" height="20" fill="#3B9EE8"/>
      {/* Arm holding chart */}
      <rect x="88" y="68" width="18" height="10" rx="5" fill="#F8F8F8"/>
      {/* Head */}
      <ellipse cx="67" cy="52" rx="18" ry="20" fill={SKIN}/>
      {/* Hair */}
      <ellipse cx="67" cy="36" rx="18" ry="12" fill={HAIR}/>
      <rect x="49" y="40" width="7" height="20" rx="3" fill={HAIR}/>
      {/* Cross */}
      <rect x="58" y="69" width="4" height="12" rx="2" fill="#FF6B6B"/>
      <rect x="55" y="73" width="10" height="4" rx="2" fill="#FF6B6B"/>
    </svg>
  );
}

// 5. 定期レポート通知 — mustard male resting, notifications flying
function IllustReport() {
  return (
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Couch / desk */}
      <rect x="30" y="106" width="100" height="12" rx="6" fill="#C8D8E8"/>
      <rect x="36" y="90" width="88" height="20" rx="8" fill="#E8F4FD"/>
      {/* Body resting */}
      <rect x="42" y="72" width="52" height="22" rx="10" fill="#F39C12"/>
      {/* Head resting */}
      <ellipse cx="68" cy="68" rx="18" ry="16" fill={SKIN}/>
      {/* Hair */}
      <rect x="50" y="54" width="36" height="16" rx="8" fill={HAIR}/>
      {/* ZZZ */}
      <text x="92" y="68" fontSize="13" fill="#8A8AAA" fontWeight="700" fontFamily="system-ui">z</text>
      <text x="104" y="58" fontSize="11" fill="#8A8AAA" fontWeight="700" fontFamily="system-ui">z</text>
      <text x="114" y="50" fontSize="9" fill="#8A8AAA" fontWeight="700" fontFamily="system-ui">z</text>
      {/* Notifications flying */}
      <rect x="136" y="32" width="38" height="28" rx="8" fill="#3B9EE8"/>
      <text x="155" y="44" textAnchor="middle" fontSize="9" fill="white" fontFamily="system-ui">レポート</text>
      <text x="155" y="55" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.85)" fontFamily="system-ui">✓ 送信完了</text>
      <circle cx="170" cy="28" r="8" fill="#FF6B6B"/>
      <text x="170" y="32" textAnchor="middle" fontSize="9" fill="white" fontWeight="700" fontFamily="system-ui">!</text>
      <rect x="128" y="70" width="46" height="22" rx="8" fill="#6DD44A"/>
      <text x="151" y="85" textAnchor="middle" fontSize="8" fill="white" fontFamily="system-ui">Slack 通知済</text>
      {/* Arm */}
      <rect x="40" y="82" width="14" height="28" rx="7" fill="#F39C12"/>
    </svg>
  );
}

// 6. ドキュメント自動生成 — lavender female, magic pose, docs flying
function IllustDocGen() {
  return (
    <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Sparkles */}
      <circle cx="142" cy="38" r="5" fill="#F5C842" opacity="0.9"/>
      <circle cx="162" cy="28" r="3.5" fill="#F5C842" opacity="0.7"/>
      <circle cx="128" cy="28" r="4" fill="#F5C842" opacity="0.8"/>
      {/* Flying documents */}
      <rect x="138" y="46" width="28" height="34" rx="4" fill="white" stroke="#F0EBE0" strokeWidth="1" transform="rotate(15 138 46)"/>
      <rect x="141" y="54" width="16" height="2.5" rx="1" fill="#3B9EE8" transform="rotate(15 141 54)"/>
      <rect x="141" y="59" width="12" height="2.5" rx="1" fill="#E0D8CC" transform="rotate(15 141 59)"/>
      <rect x="118" y="36" width="24" height="30" rx="4" fill="white" stroke="#F0EBE0" strokeWidth="1" transform="rotate(-10 118 36)"/>
      <rect x="121" y="44" width="14" height="2.5" rx="1" fill="#8E44AD" transform="rotate(-10 121 44)"/>
      <rect x="121" y="49" width="10" height="2.5" rx="1" fill="#E0D8CC" transform="rotate(-10 121 49)"/>
      <rect x="154" y="72" width="22" height="26" rx="4" fill="white" stroke="#F0EBE0" strokeWidth="1" transform="rotate(8 154 72)"/>
      <rect x="157" y="79" width="12" height="2" rx="1" fill="#6DD44A" transform="rotate(8 157 79)"/>
      {/* Legs */}
      <rect x="58" y="106" width="14" height="36" rx="7" fill="#27AE60"/>
      <rect x="74" y="106" width="14" height="36" rx="7" fill="#27AE60"/>
      {/* Body */}
      <rect x="50" y="66" width="48" height="44" rx="10" fill="#9B59B6"/>
      {/* Magic arm raised */}
      <rect x="94" y="52" width="12" height="28" rx="6" fill="#9B59B6" transform="rotate(-40 94 52)"/>
      {/* Left arm */}
      <rect x="34" y="72" width="20" height="10" rx="5" fill="#9B59B6" transform="rotate(15 34 72)"/>
      {/* Head */}
      <ellipse cx="74" cy="54" rx="18" ry="20" fill={SKIN}/>
      {/* Hair */}
      <ellipse cx="74" cy="38" rx="18" ry="12" fill={HAIR}/>
      <ellipse cx="64" cy="50" rx="5" ry="14" fill={HAIR}/>
      {/* Wand */}
      <line x1="110" y1="44" x2="122" y2="32" stroke="#F5C842" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="122" cy="30" r="5" fill="#F5C842"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   Hero Illustration — person at PC + floating AI data particles
   ══════════════════════════════════════════════════════════════ */
function HeroIllustSVG() {
  return (
    <div className="hero-person-illust">
      <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Desk */}
        <rect x="20" y="128" width="160" height="8" rx="4" fill="#E8D5B0"/>
        <rect x="45" y="136" width="8" height="32" rx="3" fill="#D4C09A"/>
        <rect x="147" y="136" width="8" height="32" rx="3" fill="#D4C09A"/>
        {/* Monitor */}
        <rect x="60" y="72" width="100" height="60" rx="6" fill="#1A1A2E"/>
        <rect x="64" y="76" width="92" height="52" rx="4" fill="#2A5AA0"/>
        {/* Screen: chart bars */}
        <rect x="72"  y="90" width="8" height="28" rx="2" fill="#6DD44A" opacity="0.9"/>
        <rect x="84"  y="82" width="8" height="36" rx="2" fill="#3B9EE8" opacity="0.9"/>
        <rect x="96"  y="87" width="8" height="31" rx="2" fill="#F5C842" opacity="0.9"/>
        <rect x="108" y="78" width="8" height="40" rx="2" fill="#6DD44A" opacity="0.9"/>
        <rect x="120" y="85" width="8" height="33" rx="2" fill="#3B9EE8" opacity="0.9"/>
        <rect x="132" y="74" width="8" height="44" rx="2" fill="#F5C842" opacity="0.9"/>
        {/* Monitor stand */}
        <rect x="106" y="132" width="8" height="8" rx="2" fill="#B0C4D8"/>
        <rect x="96"  y="140" width="28" height="4" rx="2" fill="#B0C4D8"/>
        {/* Head */}
        <ellipse cx="100" cy="58" rx="14" ry="15" fill="#FFD5A8"/>
        {/* Hair */}
        <ellipse cx="100" cy="47" rx="14" ry="9" fill="#1A1A2E"/>
        <rect x="86" y="47" width="5" height="14" rx="2.5" fill="#1A1A2E"/>
        {/* Body */}
        <rect x="86" y="72" width="28" height="36" rx="8" fill="#4A90D9"/>
        {/* Arms */}
        <rect x="68" y="96" width="20" height="8" rx="4" fill="#FFD5A8"/>
        <rect x="112" y="96" width="20" height="8" rx="4" fill="#FFD5A8"/>
        {/* Keyboard */}
        <rect x="62" y="124" width="76" height="6" rx="3" fill="#C8D8E8"/>
        {/* Floating AI data particles */}
        <circle cx="170" cy="50" r="5" fill="#3B9EE8" opacity="0.7">
          <animate attributeName="cy" values="50;40;50" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="185" cy="78" r="3.5" fill="#F5C842" opacity="0.8">
          <animate attributeName="cy" values="78;68;78" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="160" cy="32" r="4" fill="#6DD44A" opacity="0.6">
          <animate attributeName="cy" values="32;22;32" dur="3.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="178" cy="28" r="2.5" fill="#FF6B6B" opacity="0.7">
          <animate attributeName="cy" values="28;18;28" dur="2.8s" repeatCount="indefinite"/>
        </circle>
        {/* Dashed lines: monitor → particles */}
        <line x1="160" y1="76" x2="170" y2="50" stroke="#3B9EE8" strokeWidth="1" opacity="0.22" strokeDasharray="3 3"/>
        <line x1="160" y1="76" x2="185" y2="78" stroke="#F5C842" strokeWidth="1" opacity="0.22" strokeDasharray="3 3"/>
        <line x1="160" y1="76" x2="160" y2="32" stroke="#6DD44A" strokeWidth="1" opacity="0.22" strokeDasharray="3 3"/>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Back to Top Button
   ══════════════════════════════════════════════════════════════ */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={`back-to-top${visible ? " visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="トップに戻る"
    >
      ↑
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   Tiltable Card
   ══════════════════════════════════════════════════════════════ */
function TiltCard({ className, children, style }: {
  className?: string; children: React.ReactNode; style?: React.CSSProperties;
}) {
  const { ref, onMouseMove, onMouseLeave } = useTilt();
  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={className} style={style}
      onMouseMove={onMouseMove as unknown as React.MouseEventHandler<HTMLElement>}
      onMouseLeave={onMouseLeave as unknown as React.MouseEventHandler<HTMLElement>}
    >
      {children}
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════ */
export default function HomePage() {

  const heroRef    = useRef<HTMLElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  /* Parallax */
  useEffect(() => {
    const hero = heroRef.current; if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const r  = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      if (orb1Ref.current)    orb1Ref.current.style.transform    = `translate(${nx * 28}px,${ny * 18}px)`;
      if (orb2Ref.current)    orb2Ref.current.style.transform    = `translate(${nx * -18}px,${ny * 24}px)`;
      if (svgWrapRef.current) svgWrapRef.current.style.transform = `translate(${nx * 10}px,${ny * 8}px)`;
    };
    hero.addEventListener("mousemove", onMove, { passive: true });
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Data ── */
  const results = [
    {
      company: "北海道の金融機関", tag: "金融機関",
      impact: "80h+", impactLabel: "月間業務削減",
      desc: "VBAを活用したExcelワークフローの大幅見直しと社内業務効率化ツールを設計・実装。取引先DX推進と地域AIセミナー講師も担当。",
      tools: ["VBA", "Excel自動化", "業務効率化"],
    },
    {
      company: "建設会社", tag: "建設業",
      impact: "1名分", impactLabel: "事務コスト削減",
      desc: "Dify × LINE APIによる自動見積もりシステムを設計・実装。見積もり業務を全自動化し、事務スタッフ1名分相当の工数削減を実現。",
      tools: ["Dify", "LINE API", "業務自動化"],
    },
    {
      company: "大型業務スーパー", tag: "小売・流通",
      impact: "5施策", impactLabel: "店舗DX同時実装",
      desc: "ロボティクスによる棚割り自動化、配送ルート最適化、AIエージェントによる欠品全自動処理、HACCP異常検知通知など複数DX施策を同時展開。",
      tools: ["AIエージェント", "経路最適化", "HACCP自動化"],
    },
    {
      company: "ホンダ系列企業", tag: "製造・自動車",
      impact: "全自動化", impactLabel: "定例業務のAI処理",
      desc: "Excel管理だった社内業務をWebアプリ化。AIエージェントを活用して定例業務の自動化を実現し、担当者が判断業務に集中できる体制を構築。",
      tools: ["Webアプリ開発", "AIエージェント", "業務自動化"],
    },
    {
      company: "山形大手ファーム企業", tag: "農業・食品",
      impact: "完全移行", impactLabel: "デジタル在庫管理",
      desc: "QRコードを活用した在庫管理システムを設計・実装。アナログ台帳によるミスと時間ロスを解消し、リアルタイム在庫可視化を実現。",
      tools: ["QRコード連携", "在庫管理システム", "業務設計"],
    },
    {
      company: "大手スポーツクラブ", tag: "フィットネス",
      impact: "AI分析", impactLabel: "経営レポート自動生成",
      desc: "GA4データをLooker Studioで可視化し、AI分析で経営陣・店舗スタッフ向け改善提案レポートを自動生成。意思決定スピードを大幅向上。",
      tools: ["GA4", "Looker Studio", "AI分析"],
    },
  ];

  const services = [
    { icon: "⚡", title: "Workflow Automation",
      desc: "業務フローを可視化し、繰り返し作業をAI・ノーコードで自動化。SaaSツール間の連携から社内フロー再設計まで、現場に定着する仕組みを作ります。" },
    { icon: "🔗", title: "System Integration",
      desc: "LINE、Gmail、CRM、ERP、Slackなど既存ツールをAPIでつなぎ、データの流れを自動化。ツールを変えず、仕組みを変えて業務負担を削減します。" },
    { icon: "📊", title: "Data & Analytics",
      desc: "GA4・スプレッドシート・各種DBのデータをLooker StudioやAIで分析。経営判断を支えるダッシュボードと定期レポートの自動生成を実現します。" },
    { icon: "🤖", title: "AI Agents",
      desc: "問い合わせ対応・見積もり作成・報告書生成など、業務文脈を理解して動くAIエージェントを構築。LINE・Slack・Webアプリへ組み込みます。" },
  ];

  const agentFeatures: { title: string; text: string; img: string }[] = [
    { title: "自動見積もり生成",              text: "LINE・Webフォームからの問い合わせをAIが解析し、自動で見積もり書を生成・送付。人手ゼロで対応完結。",      img: "/mitsumori1.png" },
    { title: "欠品処理・タイマー自動化",      text: "在庫欠品の検知からタイマー起動による自動発注・担当者通知まで、定型処理をフル自動化。",                   img: "/keppin2.png" },
    { title: "自動シフト管理",                text: "スタッフの希望・スキル・法令制約を学習したAIが最適シフトを自動生成。管理工数を大幅削減。",               img: "/shift3.png" },
    { title: "医療現場の売上予測・価格提案",  text: "診療データ・来院履歴から売上を予測し、現場に適した価格サジェスチョンをリアルタイムで提供。",            img: "/yosoku4.png" },
    { title: "定期レポート自動通知",          text: "KPIダッシュボードを自動集計し、経営陣・現場スタッフへのレポートをSlack・メールで自動配信。",            img: "/reppot5.png" },
    { title: "ドキュメント自動生成（近日公開）", text: "議事録・業務マニュアル・提案書など、各種ドキュメントのAI自動作成機能を順次リリース予定。",           img: "/documen6.png" },
  ];

  const consultingItems = [
    { icon: "🌐", num: "01", title: "AI横展開・デジタル戦略",
      desc: "自社で実証したAIサービスを同業他社へ横展開するビジネスモデルを設計。デジタル戦略の全体像をグランドデザインとして策定します。" },
    { icon: "✈️", num: "02", title: "海外展開支援",
      desc: "自社のサービス・コンテンツ・商品を海外市場へ展開するための戦略立案とデジタルマーケティング設計をご支援します。" },
    { icon: "⚖️", num: "03", title: "ワークライフバランス設計",
      desc: "「金曜15時終業」など、AI活用で削減した業務時間を社員の生活の質向上に還元。社内定着率・採用競争力の向上を設計します。" },
    { icon: "🌏", num: "04", title: "海外人材リクルーティング",
      desc: "正社員採用を海外にも広げるため、SNS発信・多言語求人・ビザ対応まで含めたグローバル採用戦略を構築します。" },
    { icon: "🏗️", num: "05", title: "グランドデザイン設計",
      desc: "経営者と並走し、3〜5年の事業グランドデザインを策定。AIを起点とした次のステージへの道筋を具体化します。" },
    { icon: "📈", num: "06", title: "DX後の成長戦略",
      desc: "業務削減で生まれた「余白」を新規事業・新サービスの創出エネルギーへ転換。持続的成長の設計をサポートします。" },
  ];

  const tools = [
    "Dify", "LINE Messaging API", "Make (Integromat)", "Google Workspace",
    "Looker Studio", "GA4", "Python", "VBA / Excel",
    "Next.js / React", "Notion API", "Slack API", "QRコード連携",
    "n8n", "Zapier", "OpenAI API", "Claude API",
  ];

  const steps = [
    { no: "01", title: "Hearing",  text: "現場の業務フローと課題をヒアリング。ムダな工程と自動化できる領域を特定します。" },
    { no: "02", title: "Design",   text: "最適なツール選定と実装設計。既存システムとの接続方法まで具体化します。" },
    { no: "03", title: "Build",    text: "スピーディに実装し、実際の業務フローに組み込みます。小さく始めて確実に動かします。" },
    { no: "04", title: "Improve",  text: "運用データを見ながら継続改善・拡張。「使われる仕組み」へと育てます。" },
  ];

  const faqs = [
    { q: "相談・見積もりは無料ですか？",            a: "はい、初回ヒアリングと実行提案書の作成は完全無料です。課題のExcelや業務フロー図を送っていただければ、具体的な改善提案書をお送りします。" },
    { q: "どのような企業が対象ですか？",            a: "中小企業・地域企業を中心に、金融・建設・医療・製造・農業・フィットネスなど幅広い業種に対応しています。北海道全域での現地対応が可能です。" },
    { q: "IT・DXの知識がなくても大丈夫ですか？",   a: "はい、業務フローの棚卸しから始めますので、IT知識は不要です。現場の「困りごと」をヒアリングし、最適な自動化・AI化の方針をご提案します。" },
    { q: "既存システムやツールとの連携はできますか？", a: "はい、LINE・Gmail・Excel・CRM・ERPなど既存ツールとのAPI連携に対応しています。ツールを変えずに仕組みを改善することも可能です。" },
    { q: "AIエージェント導入までどのくらいかかりますか？", a: "業務の複雑さや規模によりますが、シンプルな自動化であれば1〜2週間で動く仕組みを構築します。まずヒアリングで具体的なスケジュールをご提案します。" },
    { q: "北海道以外でも対応できますか？",          a: "はい、オンラインでの対応が可能です。ただし、現地訪問・現場密着型の支援については北海道全域を主な対応エリアとしています。" },
  ];

  const innerStyle = { width: "min(100%, 1200px)", margin: "0 auto", padding: "0 28px" } as const;

  return (
    <main>
      <CursorGlow />
      <BackToTop />


      {/* ── Hero ── */}
      <section className="hero-section" id="top" ref={heroRef}>
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb-1" ref={orb1Ref} />
        <div className="hero-orb hero-orb-2" ref={orb2Ref} />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              AI × 業務自動化 × DX戦略
            </div>
            <h1 className="hero-title">
              業務の<span className="grad-text">ムダ</span>を、<br />
              AIが動く<span className="grad-text">仕組み</span>に。
            </h1>
            <p className="hero-desc">
              中小企業・地域企業の現場に入り込み、業務フローの棚卸しから
              AIエージェント実装・コンサルティングまで一気通貫で支援します。
              金融・建設・医療・製造など、業種を問わず実績多数。
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">無料で相談する</a>
              <a className="btn btn-outline" href="#results">実績を見る</a>
            </div>
            <div className="hero-chips">
              <div className="chip"><span className="chip-check">✓</span>業務フロー可視化から対応</div>
              <div className="chip"><span className="chip-check">✓</span>AIエージェント導入実績多数</div>
              <div className="chip"><span className="chip-check">✓</span>定着・戦略まで伴走</div>
            </div>
          </div>
          <div className="hero-visual" ref={svgWrapRef} style={{ position: "relative" }}>
            <WorkflowSVG />
            <HeroIllustSVG />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-strip">
        <div className="stats-inner">
          {[
            { to: 80,  suffix: "h+/月", label: "業務時間削減実績" },
            { to: 10,  suffix: "社+",   label: "DX支援実績" },
            { to: 6,   suffix: "業種+", label: "対応業種数" },
            { to: 5,   suffix: "施策",  label: "単一企業内最大導入数" },
          ].map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-value"><Counter to={s.to} suffix={s.suffix}/></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Results ── */}
      <section id="results" className="section reveal">
        <div className="section-head centered" style={innerStyle}>
          <div className="eyebrow">Results</div>
          <h2>数字で証明する、現場での実績</h2>
          <p>金融・建設・スーパー・製造・農業・フィットネス。業種を超えて、業務の無駄を削り、AIが動く仕組みに変えてきました。</p>
        </div>
        <div className="result-grid">
          {results.map((r, i) => (
            <TiltCard className="result-card reveal" key={r.company}
              style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="result-top">
                <span className="result-tag">{r.tag}</span>
                <div className="result-impact-wrap">
                  <span className="result-impact">{r.impact}</span>
                  <span className="result-impact-label">{r.impactLabel}</span>
                </div>
              </div>
              <h3 className="result-company">{r.company}</h3>
              <p className="result-desc">{r.desc}</p>
              <div className="result-tools">
                {r.tools.map(t => <span className="tool-badge" key={t}>{t}</span>)}
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── Services Overview ── */}
      <section id="services" className="section section-tinted reveal">
        <div className="section-head centered" style={innerStyle}>
          <div className="eyebrow">Services</div>
          <h2>提供するサービス</h2>
          <p>業務整理から実装・AI戦略まで、必要な支援をワンストップで提供します。PoC止まりではなく、現場で「使われる仕組み」を作ります。</p>
        </div>
        <div className="service-grid">
          {services.map((s, i) => (
            <TiltCard className="service-card reveal" key={s.title}
              style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="service-icon-wrap">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AI AGENT DETAIL SECTION
          ════════════════════════════════════════════ */}
      <section id="ai-agent" className="section agent-section reveal">
        <div className="agent-inner">
          <div className="agent-copy">
            <div className="eyebrow">AI Agent Implementation</div>
            <h2 className="agent-title">
              企業の課題を<br />
              <span className="grad-text">AIに覚えさせ</span>、<br />
              業務を自動化する。
            </h2>
            <p className="agent-desc">
              単なるツール導入ではなく、企業固有の業務フロー・ルール・判断基準を
              AIに学習させることで、自律的に動くエージェントを構築します。
              現場の「繰り返し業務」を根本から削減し、人材が本来の創造的業務に
              集中できる体制を実現します。
            </p>
            <div className="agent-achievements">
              <span className="achieve-chip"><span className="dot"/>自動見積もり ✓</span>
              <span className="achieve-chip"><span className="dot"/>欠品自動処理 ✓</span>
              <span className="achieve-chip"><span className="dot"/>タイマー自動化 ✓</span>
              <span className="achieve-chip"><span className="dot"/>レポート自動通知 ✓</span>
            </div>
            <div className="agent-doc-note">
              <span className="doc-note-icon">📄</span>
              <p className="doc-note-text">
                <strong>今後対応予定</strong>：議事録・業務マニュアル・提案書など、
                各種ドキュメントのAI自動生成機能を順次リリース予定です。
                現在はヒアリングベースでご提案を進めています。
              </p>
            </div>
            <div style={{ marginTop: 28 }}>
              <a className="btn btn-primary" href="#contact">AIエージェント導入を相談する →</a>
            </div>
          </div>
          <div className="agent-cards">
            {agentFeatures.map((f, i) => (
              <div className="agent-card reveal" key={f.title}
                style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="agent-card-illust">
                  <Image src={f.img} alt={f.title} width={400} height={220} className="agent-card-img" />
                </div>
                <div className="agent-card-body">
                  <h4 className="agent-card-title">{f.title}</h4>
                  <p className="agent-card-text">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CONSULTING SECTION
          ════════════════════════════════════════════ */}
      <section id="consulting" className="section consulting-section reveal">
        <div className="consulting-inner">
          <div className="section-head centered">
            <div className="eyebrow">AI Strategy Consulting</div>
            <h2>AIで削減したその先を、<br /><span className="grad-text">グランドデザイン</span>する。</h2>
            <p>
              業務効率化はゴールではなく、スタートです。生まれた「余白」と「データ」を活かし、
              経営者と共に次のステージへの道筋を描きます。
            </p>
          </div>
          <div className="consulting-grid">
            {consultingItems.map((c, i) => (
              <div className="consult-card reveal" key={c.title}
                style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="consult-icon">{c.icon}</div>
                <div className="consult-num">{c.num}</div>
                <h3 className="consult-title">{c.title}</h3>
                <p className="consult-desc">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="consulting-tagline reveal">
            <p>
              <strong>コンサルティングとは</strong>、AIで業務を削減したその先のデザインサービスです。<br />
              自社のAIサービスを同業他社へ横展開するデジタル戦略、海外への事業展開、
              ワークライフバランス設計、海外人材のSNSリクルーティングまで——
              <strong>「AIの先にある経営」</strong>を、経営者と共に設計します。
            </p>
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <a className="btn btn-primary" href="#contact">コンサルティングを相談する →</a>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="section reveal">
        <div className="section-head centered" style={{ ...innerStyle, marginBottom: 40 }}>
          <div className="eyebrow">Tech Stack</div>
          <h2>活用するツール・技術</h2>
          <p>現場の状況に合わせて最適なツールを選定。既存環境を活かしながら、最速で自動化・AI化を実現します。</p>
        </div>
        <div className="tools-grid">
          {tools.map((t, i) => (
            <span className="tool-chip reveal" key={t} style={{ transitionDelay: `${i * 0.04}s` }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" className="section section-tinted reveal">
        <div className="section-head centered" style={{ ...innerStyle, marginBottom: 56 }}>
          <div className="eyebrow">Process</div>
          <h2>進め方</h2>
          <p>現場を理解してから動く。小さく始めて、確実に成果を積み重ねます。</p>
        </div>
        <div className="process-grid">
          {steps.map((s, i) => (
            <article className="process-card reveal" key={s.no}
              style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="process-no-wrap">
                <span className="process-no">{s.no}</span>
              </div>
              <h3 className="process-title">{s.title}</h3>
              <p className="process-text">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq-section reveal">
        <div className="section-head centered" style={innerStyle}>
          <div className="eyebrow">FAQ</div>
          <h2>よくあるご質問</h2>
          <p>導入前の疑問にお答えします。お気軽にお問い合わせください。</p>
        </div>
        <div className="faq-list" style={innerStyle}>
          {faqs.map((f, i) => (
            <details className="faq-item reveal" key={i} style={{ transitionDelay: `${i * 0.06}s` }}>
              <summary className="faq-q">{f.q}</summary>
              <p className="faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="section contact-section reveal">
        <div className="contact-inner">
          <div className="contact-copy">
            <div className="eyebrow">Contact</div>
            <h2 className="contact-title">
              まずは、現場の話を<br />聞かせてください。
            </h2>
            <p className="contact-desc">
              「どこから手をつければいいか分からない」という段階から
              相談できます。課題のExcelやデータを送っていただければ、
              現状分析と具体的な実行提案書を無料でお送りします。
            </p>
            <ul className="contact-trust-list">
              <li><span className="ctrust-icon">✓</span>無料ヒアリング・提案書対応</li>
              <li><span className="ctrust-icon">✓</span>北海道全域対応可能</li>
              <li><span className="ctrust-icon">✓</span>ファイル送付で即見積もり</li>
              <li><span className="ctrust-icon">✓</span>実績ベースの具体的提案</li>
            </ul>
          </div>
          <div className="contact-form-wrap">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <a href="#top" className="brand-wrap">
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
              <rect width="32" height="32" rx="9" fill="#3B9EE8"/>
              <polygon points="16,5 7,27 12,27 16,16 20,27 25,27" fill="#FFF8E7"/>
              <rect x="13" y="19" width="6" height="2.5" rx="1" fill="#F5C842"/>
            </svg>
            <span className="brand-name">AISupports</span>
          </a>
          <div className="footer-copy">© 2026 AISupports（mlma）. All rights reserved.</div>
        </div>
        <div className="footer-links">
          <a href="/company">会社概要</a>
          <a href="/privacy">プライバシーポリシー</a>
          <a href="/terms">利用規約</a>
        </div>
      </footer>
    </main>
  );
}
