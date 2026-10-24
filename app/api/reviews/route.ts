import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { product, review, users } from "@/src/db/schema";
import { getCurrentUser } from "@/helper/user/action";
import { syncAndGetUserRewards } from "@/lib/rewards";
import { REVIEW_PHOTO_REWARD_RUPEES, REVIEW_TEXT_REWARD_RUPEES } from "@/lib/rewardsRules";
import { NOT_A_BUYER_MESSAGE, hasReceivedProduct } from "@/lib/reviewEligibility";
import { getImageUrl } from "@/lib/imageUrl";
import { and, desc, eq, ilike } from "drizzle-orm";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET REVIEWS
export async function GET() {
  try {
    const data = await db
      .select({
        id: review.id,
        productId: review.productId,
        name: review.name,
        rating: review.rating,
        message: review.message,
        imageUrl: review.imageUrl,
        createdAt: review.createdAt,
      })
      .from(review)
      .where(eq(review.isAdminApproved, true))
      .orderBy(desc(review.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// CREATE REVIEW
export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser?.userId) {
      return NextResponse.json(
        {
          error:
            `Please sign in to write a review and earn ₹${REVIEW_TEXT_REWARD_RUPEES}, or ₹${REVIEW_PHOTO_REWARD_RUPEES} with a photo.`,
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const rawProductId = String(body.productId || "").trim();
    const rawProductName = String(body.productName || "").trim();
    const message = String(body.message || "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    if (!message) {
      return NextResponse.json(
        { error: "Please write a review message." },
        { status: 400 },
      );
    }

    const [dbUser] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.id, sessionUser.userId))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let resolvedProductId: string | null = null;
    if (UUID_REGEX.test(rawProductId)) {
      const [foundById] = await db
        .select({ id: product.id })
        .from(product)
        .where(eq(product.id, rawProductId))
        .limit(1);
      resolvedProductId = foundById?.id ?? null;
    }

    if (!resolvedProductId && rawProductId && rawProductId !== "general") {
      const [foundBySlug] = await db
        .select({ id: product.id })
        .from(product)
        .where(eq(product.slug, rawProductId))
        .limit(1);
      resolvedProductId = foundBySlug?.id ?? null;
    }

    if (!resolvedProductId && rawProductName && rawProductName !== "Product") {
      const [foundByName] = await db
        .select({ id: product.id })
        .from(product)
        .where(ilike(product.name, `%${rawProductName}%`))
        .limit(1);
      resolvedProductId = foundByName?.id ?? null;
    }

    if (!resolvedProductId) {
      return NextResponse.json(
        { error: "Please choose the product you are reviewing." },
        { status: 400 },
      );
    }

    if (!(await hasReceivedProduct(dbUser.id, resolvedProductId))) {
      return NextResponse.json({ error: NOT_A_BUYER_MESSAGE }, { status: 403 });
    }

    {
      const [existing] = await db
        .select({ id: review.id })
        .from(review)
        .where(
          and(
            eq(review.userId, dbUser.id),
            eq(review.productId, resolvedProductId),
          ),
        )
        .limit(1);

      if (existing) {
        return NextResponse.json(
          { error: "You have already reviewed this product. Thank you!" },
          { status: 400 },
        );
      }
    }

    const reviewerName =
      String(body.name || "").trim() || dbUser.name || "Potent customer";

    const mediaList = Array.isArray(body.media)
      ? body.media
      : body.fileKey
        ? [body.fileKey]
        : body.imageUrl
          ? [body.imageUrl]
          : body.photoUrl
            ? [body.photoUrl]
            : [];
    const normalizedMedia = mediaList
      .filter(Boolean)
      .map((m: any) => {
        const raw = typeof m === "string" ? m : m?.mediaURL ? m.mediaURL : String(m);
        return getImageUrl(raw);
      });
    const primaryImageUrl = normalizedMedia[0] || null;

    const mediaJson = normalizedMedia.length > 0 ? JSON.stringify(normalizedMedia) : null;

    const [created] = await db
      .insert(review)
      .values({
        userId: dbUser.id,
        name: reviewerName,
        productId: resolvedProductId,
        rating,
        message,
        varient: mediaJson,
        imageUrl: primaryImageUrl,
        isAdminApproved: false, // Rule: Added when we approve the review
      })
      .returning();

    const synced = await syncAndGetUserRewards(dbUser.id);

    return NextResponse.json({
      success: true,
      review: created,
      pendingApproval: true,
      rewardAdded: 0,
      balance: synced.balance,
      message: `Review submitted! ₹${primaryImageUrl ? REVIEW_PHOTO_REWARD_RUPEES : REVIEW_TEXT_REWARD_RUPEES} will be added to your Rewards once our team approves it.`,
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}