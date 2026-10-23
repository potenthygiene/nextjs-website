/**
 * Products that are announced but cannot be bought yet.
 * The First Period Box will launch soon: it is shown as "Coming soon"
 * everywhere and must never reach the bag or checkout.
 */
export const COMING_SOON_SKUS = ["OVY-TEEN-FPB"];

type ItemLike =
  | {
      sku?: string | null;
      name?: string | null;
      variantName?: string | null;
      title?: string | null;
      size?: string | null;
    }
  | null
  | undefined;

export function isComingSoonItem(item: ItemLike): boolean {
  if (!item) return false;
  const sku = String(item.sku || "").toUpperCase();
  if (COMING_SOON_SKUS.includes(sku) || /(^|-)FPB(-|$)/.test(sku)) return true;
  const text = [item.name, item.variantName, item.title, item.size]
    .filter(Boolean)
    .join(" ");
  return /first\s+period\s+box/i.test(text);
}

export const COMING_SOON_MESSAGE =
  "The First Period Box is coming soon. It can't be ordered yet.";
