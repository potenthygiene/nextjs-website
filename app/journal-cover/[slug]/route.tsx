import { ARTICLES } from "@/const/journal";
import { renderCover } from "@/app/components/common/journal/coverArt";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderCover(slug, "cover");
}
