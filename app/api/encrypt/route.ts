import { LCSaveType } from "@/components/save-file-editor";
import { decrypt, encrypt } from "@/lib/crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const save = data.get("save");
  if (!save) {
    return NextResponse.json({
      success: false,
      message: "No save provided.",
    });
  }

  try {
    const str = await save.toString();
    const parsed: LCSaveType = JSON.parse(str);
    if (!parsed.FileGameVers) {
      return NextResponse.json({
        success: false,
        message: "No save provided.",
      });
    }

    const encrypted = encrypt(str);
    return NextResponse.json({
      success: true,
      encrypted,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "encryption failed." });
  }
}
