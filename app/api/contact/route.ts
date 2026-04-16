import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL ?? "ai.hokkaidorisu@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, name, email, message, fileUrl } = body;

    if (!company || !name || !email || !message) {
      return NextResponse.json({ error: "必須項目が不足しています。" }, { status: 400 });
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#3B9EE8;border-bottom:2px solid #3B9EE8;padding-bottom:8px;">
          AISupports お問い合わせ
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:120px;">企業名</td>
              <td style="padding:8px;border-bottom:1px solid #eee;">${company}</td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">担当者名</td>
              <td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">メール</td>
              <td style="padding:8px;border-bottom:1px solid #eee;">
                <a href="mailto:${email}">${email}</a>
              </td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">ファイルURL</td>
              <td style="padding:8px;border-bottom:1px solid #eee;">
                ${fileUrl ? `<a href="${fileUrl}">${fileUrl}</a>` : "なし"}
              </td></tr>
        </table>
        <h3 style="margin-top:24px;color:#333;">お問い合わせ内容</h3>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;white-space:pre-wrap;">
          ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </div>
        <p style="color:#999;font-size:12px;margin-top:24px;">
          送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from:    "AISupports <hello@aisupports.cc>",
      to:      [TO_EMAIL],
      replyTo: email,
      subject: `【お問い合わせ】${company} ${name}様`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "メール送信に失敗しました。" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}

