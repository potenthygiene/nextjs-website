import BusinessPage from "@/app/components/common/business/BusinessPage";
import { pageMetadata } from "@/const/seo";

export const metadata = pageMetadata("business");

export default function Page() {
  return <BusinessPage />;
}
