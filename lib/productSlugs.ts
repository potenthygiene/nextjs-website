// Maps older or alternative product addresses to the slug stored in the
// database, so old links and older card data still find the product.
export function resolveCanonicalSlug(s: string): string {
  const lower = (s || "").toLowerCase();
  if (
    lower === "looway-pee-funnel" ||
    lower === "pee-funnel" ||
    lower === "looway-funnel" ||
    lower === "looway-reusable-female-pee-funnel"
  ) {
    return "looway-pee-funnel";
  }
  if (
    lower === "looway-pee-puke" ||
    lower === "looway-pee-puke-bags" ||
    lower === "pee-puke-bags" ||
    lower === "looway-pee-and-puke-bags" ||
    lower === "pee-puke"
  ) {
    return "looway-pee-puke";
  }
  if (lower === "looway-toilet-seat-covers" || lower === "toilet-seat-covers") {
    return "looway-toilet-seat-covers";
  }
  if (
    lower === "ovy-cup" ||
    lower === "menstrual-cup" ||
    lower === "ovy-reusable-menstrual-cup"
  ) {
    return "ovy-cup";
  }
  if (
    lower === "ovy-teen" ||
    lower === "ovy-teen-pads" ||
    lower === "ovy-teen-starter-pack" ||
    lower === "ovy-organic-teen-sanitary-pads"
  ) {
    return "ovy-teen";
  }
  if (
    lower === "ovy-pads" ||
    lower === "sanitary-pads" ||
    lower === "ovy-organic-sanitary-pads"
  ) {
    return "ovy-pads";
  }
  if (
    lower === "ovy-liners" ||
    lower === "panty-liners" ||
    lower === "ovy-daily-panty-liners"
  ) {
    return "ovy-liners";
  }
  if (lower === "ovy-panty" || lower === "period-panty") {
    return "ovy-panty";
  }
  return s;
}
