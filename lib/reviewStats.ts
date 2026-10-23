// Rating summary worked out only from real, admin-approved reviews loaded
// from the database (getProductReviews in helper/review/action.ts).
// Never hardcode a rating, a review count or a star breakdown anywhere on
// the site: when there are no real reviews, the rating block is hidden.

export type ReviewStarRow = {
  stars: number;
  count: number;
  /** Whole-number percentage of all rated reviews, 0 to 100. */
  percent: number;
};

export type ReviewStats = {
  /** Number of reviews with a valid 1 to 5 star rating. */
  count: number;
  /** Mean rating, 0 when there are no reviews. */
  average: number;
  /** Mean rating to one decimal place, e.g. "4.6". Empty when count is 0. */
  averageLabel: string;
  /** Rows for 5 down to 1 stars. */
  breakdown: ReviewStarRow[];
};

export function getReviewRating(review: unknown): number | null {
  const raw = (review as { rating?: unknown } | null)?.rating;
  const n = Math.round(Number(raw));
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
}

export function getReviewStats(reviews: unknown): ReviewStats {
  const list = Array.isArray(reviews) ? reviews : [];
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let sum = 0;

  for (const r of list) {
    const rating = getReviewRating(r);
    if (rating === null) continue;
    counts[rating] += 1;
    total += 1;
    sum += rating;
  }

  const average = total === 0 ? 0 : sum / total;

  return {
    count: total,
    average,
    averageLabel: total === 0 ? "" : average.toFixed(1),
    breakdown: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars],
      percent: total === 0 ? 0 : Math.round((counts[stars] / total) * 100),
    })),
  };
}

/** "1 review" / "12 reviews". */
export function reviewCountLabel(count: number): string {
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}
