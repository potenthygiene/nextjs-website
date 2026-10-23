"use client";

import { useEffect } from "react";

// One listener for the whole site: a link to the page you are already on
// (footer, header, menus, anywhere) scrolls smoothly back to the top, and a
// link to a #section on this page scrolls to that section. Links to other
// pages, new tabs, downloads, mail and phone links, and ctrl/cmd/shift/middle
// clicks are left alone. Add data-no-page-scroll to a link to opt it out.

function behavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function trimSlash(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

// Height of the sticky site header, so a section does not land under it.
function headerOffset() {
  const header = document.querySelector("header");
  if (!header) return 0;
  const pos = getComputedStyle(header).position;
  return pos === "sticky" || pos === "fixed" ? header.getBoundingClientRect().height : 0;
}

function scrollToSection(el: HTMLElement) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  if (margin > 0) {
    // The section already says how much room it needs above it.
    el.scrollIntoView({ behavior: behavior(), block: "start" });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset() - 12;
  window.scrollTo({ top: Math.max(0, top), behavior: behavior() });
}

export function SamePageLinkScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.hasAttribute("download") || anchor.hasAttribute("data-no-page-scroll")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const raw = (anchor.getAttribute("href") || "").trim();
      // "#" alone is used by buttons-as-links; mail, phone and scripts are not pages.
      if (!raw || raw === "#" || /^(mailto:|tel:|sms:|javascript:)/i.test(raw)) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      const here = window.location;
      if (url.origin !== here.origin) return;
      if (trimSlash(url.pathname) !== trimSlash(here.pathname)) return;
      if (url.search !== here.search) return;

      let hash = url.hash.slice(1);
      try {
        hash = decodeURIComponent(hash);
      } catch {
        // keep the raw hash
      }
      let section: HTMLElement | null = null;
      if (hash) {
        section = document.getElementById(hash);
        if (!section) return; // nothing to scroll to; let the browser decide
      }

      // A plain <a> would jump instantly; take over so the scroll is smooth.
      // Next.js links have already handled the click themselves.
      if (!e.defaultPrevented) {
        e.preventDefault();
        if (url.hash && url.hash !== here.hash) {
          window.history.pushState(window.history.state, "", url.hash);
        }
      }

      const run = () => (section ? scrollToSection(section) : window.scrollTo({ top: 0, behavior: behavior() }));

      // Links inside the mobile menu or another dialog: wait for it to close
      // and release the page's scroll lock first.
      // Otherwise run straight after Next.js has finished with the click.
      window.setTimeout(run, anchor.closest('[role="dialog"]') ? 350 : 0);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
