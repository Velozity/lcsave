import { decrypt } from "@/lib/crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({
      success: false,
      message: "No file provided or file is not a Blob.",
    });
  }
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const decrypted = decrypt(buffer);
    return NextResponse.json({ success: true, decrypted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      error: "Failed. Probably not a save file.",
    });
  }
}
