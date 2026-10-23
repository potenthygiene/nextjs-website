import { NextResponse } from "next/server";
import { getImageKit } from "@/lib/imagekit";
import { getAuthSession } from "@/helper/auth/session";
import { IMAGE_TYPES } from "@/lib/requestGuard";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session.authenticated || !session.user?.userId) {
      return NextResponse.json({ error: "Please sign in to upload." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!IMAGE_TYPES.includes(file.type) || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Only pictures up to 10 MB can be uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imagekit = getImageKit();
    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
