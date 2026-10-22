import ContactUsClient from "@/app/components/common/contact/ContactUsClient";
import { pageMetadata } from "@/const/seo";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return <ContactUsClient />;
}