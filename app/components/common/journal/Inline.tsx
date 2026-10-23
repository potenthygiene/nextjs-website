import Link from "next/link";
import { Fragment, type ReactNode } from "react";

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

/** Renders the Journal's inline format: **bold**, *italic*, [text](href). */
export function Inline({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        let node: ReactNode = part;
        if (part.startsWith("**") && part.endsWith("**")) {
          node = <strong className="font-semibold text-[#14302F]">{part.slice(2, -2)}</strong>;
        } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          node = <em>{part.slice(1, -1)}</em>;
        } else {
          const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
          if (link) {
            const [, label, href] = link;
            const cls =
              "font-medium text-[#016271] underline decoration-[#1A8D91]/40 decoration-2 underline-offset-4 transition-colors hover:decoration-[#016271]";
            node = href.startsWith("/") ? (
              <Link href={href} className={cls}>
                {label}
              </Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                {label}
              </a>
            );
          }
        }
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}
