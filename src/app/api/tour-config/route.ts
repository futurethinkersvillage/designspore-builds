import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const CONFIG_PATH = path.join(process.cwd(), "public", "tour-calibrations.json");

export async function GET() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await fs.writeFile(CONFIG_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("tour-config write failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
