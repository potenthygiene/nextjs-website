import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { AWS_BUCKET } from "@/env";
import { s3 } from "@/lib/s3";
import { getAuthSession } from "@/helper/auth/session";
import { IMAGE_TYPES, allowRequest } from "@/lib/requestGuard";

const FOLDERS = ["blog", "category", "product", "order-issues", "review"];

export async function POST(req: Request) {
  // Only signed-in people may upload, only pictures, only to known folders.
  const session = await getAuthSession();
  const userId = session.authenticated ? session.user?.userId : null;
  if (!userId) {
    return NextResponse.json({ error: "Please sign in to upload." }, { status: 401 });
  }
  if (!allowRequest(`upload:${userId}`, 40, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many uploads. Please wait a few minutes." }, { status: 429 });
  }

  const { fileName, fileType, folder } = await req.json();
  if (!FOLDERS.includes(folder) || !IMAGE_TYPES.includes(fileType)) {
    return NextResponse.json({ error: "Only pictures can be uploaded." }, { status: 400 });
  }
  const safeName = String(fileName || "image")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(-80);
  const fileKey = `${folder}/${Date.now()}-${safeName}`;
  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET!,
    Key: fileKey,
    ContentType: fileType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  return NextResponse.json({ uploadUrl, fileKey });
}
