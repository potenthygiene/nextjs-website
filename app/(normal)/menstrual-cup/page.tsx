import { permanentRedirect } from "next/navigation";

// Duplicate of /product-detail/ovy-cup. next.config.ts redirects this address
// first; this keeps it a redirect if that rule is ever removed.
export default function Page() {
  permanentRedirect("/product-detail/ovy-cup");
}
