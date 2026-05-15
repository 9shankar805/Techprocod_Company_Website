import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey && apiKey !== "your_resend_api_key_here") {
      try {
        const emailBody = {
          from: "Tech Procod Contact Form <noreply@techprocod.com>",
          to: ["info@techprocod.com"],
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td><td style="padding: 8px 0; color: #6b7280;">${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px 0; color: #6b7280;">${email}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px 0; color: #6b7280;">${phone || "Not provided"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Service:</td><td style="padding: 8px 0; color: #6b7280;">${service || "Not specified"}</td></tr>
              </table>
              <div style="margin-top: 16px;">
                <p style="font-weight: bold; color: #374151;">Message:</p>
                <p style="color: #6b7280; line-height: 1.6;">${message}</p>
              </div>
            </div>
          `,
        };

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailBody),
        });

        if (!resendRes.ok) {
          console.error("Resend API error:", await resendRes.text());
        }
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Graceful fallback — still return success
      }
    } else {
      // Fallback: log to console
      console.log("=== New Contact Form Submission ===");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone || "Not provided");
      console.log("Service:", service || "Not specified");
      console.log("Message:", message);
      console.log("===================================");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
