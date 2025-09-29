import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");
const guestbookFile = path.join(dataDir, "guestbooks.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(guestbookFile)) {
  fs.writeFileSync(guestbookFile, JSON.stringify({}));
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = JSON.parse(fs.readFileSync(guestbookFile, "utf8"));
    if (!data[id]) {
      data[id] = [{
        timestamp: new Date().toISOString(),
        type: "guestbook_created"
      }];
      fs.writeFileSync(guestbookFile, JSON.stringify(data, null, 2));
    }
    
    return NextResponse.json({ entries: data[id] });
  } catch (error) {
    console.error("Error reading guestbook:", error);
    return NextResponse.json({ error: "Failed to load guestbook" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = await params;
  return NextResponse.json({ message: "Guestbook API ready", id });
}