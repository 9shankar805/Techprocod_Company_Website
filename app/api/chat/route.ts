import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a helpful customer service assistant for Tech Procod Pvt Ltd, a digital solutions company based in Siraha, Nepal.

About Tech Procod:
- Founded in 2019 in Siraha, Madhesh Pradesh, Nepal
- 50+ projects delivered, 30+ happy clients, 5+ years experience
- Phone/WhatsApp: +977-9800000000
- Email: info@techprocod.com

Services (with starting prices):
- Web Development (React, Next.js, Laravel): from NPR 30,000
- Mobile App Development (React Native): from NPR 50,000
- E-commerce Solutions: from NPR 40,000
- UI/UX Design (Figma): from NPR 15,000
- AI Integration: contact for quote
- Ride Sharing Systems: contact for quote
- Hotel Booking Systems: contact for quote
- Payment Gateway (eSewa, Khalti, Stripe): contact for quote
- SEO & Digital Marketing: from NPR 10,000/month
- Hosting Services: from NPR 3,000/month
- Custom Software: contact for quote

Ready-Made Products (monthly subscription):
- POS System: from NPR 5,000/month
- Hotel Management System: from NPR 8,000/month
- Delivery Management System: from NPR 7,000/month
- School Management System: from NPR 6,000/month
- E-commerce Platform: from NPR 9,000/month

Portfolio: StyleAura (fashion e-commerce), RideSewa (ride-hailing app), HotelSewa (hotel management), Siraha Bazaar (local marketplace), SchoolPro, FoodRun.

Instructions:
- Be friendly, concise, and professional
- Reply in the same language the user uses (English or Nepali)
- Keep replies short (2-4 sentences) unless listing items
- For pricing, give starting price and suggest contacting for a custom quote
- Always end with a helpful next step`;

function fallbackReply(msg: string): string {
  const m = msg.toLowerCase();
  if (/hi|hello|hey|namaste/.test(m)) return "Hello! 👋 Welcome to Tech Procod. How can I help you today?";
  if (/service|offer|what do you/.test(m)) return "We offer web development, mobile apps, e-commerce, UI/UX design, AI integration, and more. Visit our Services page for details!";
  if (/price|cost|how much/.test(m)) return "Pricing starts from NPR 15,000 for design, NPR 30,000 for websites, and NPR 50,000 for mobile apps. Contact us for a free custom quote!";
  if (/contact|phone|email|whatsapp/.test(m)) return "📞 +977-9800000000 | ✉️ info@techprocod.com — We respond within 24 hours!";
  if (/portfolio|project/.test(m)) return "We've built StyleAura, RideSewa, HotelSewa, Siraha Bazaar, and more. Check our Portfolio page!";
  return "Thanks for reaching out! Contact us at +977-9800000000 or info@techprocod.com for the best assistance.";
}

export async function POST(request: NextRequest) {
  let message = "";
  let history: { role: string; text: string }[] = [];

  try {
    const body = await request.json();
    message = body.message || "";
    history = body.history || [];
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Debug log — visible in terminal
  console.log("[Chat API] key present:", !!apiKey, "| starts with:", apiKey?.slice(0, 10));

  if (!apiKey) {
    console.log("[Chat API] No API key — using fallback");
    return NextResponse.json({ reply: fallbackReply(message) });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chatHistory = history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    console.log("[Chat API] Gemini replied OK");
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[Chat API] Gemini error:", errMsg);
    return NextResponse.json({ reply: fallbackReply(message) });
  }
}
