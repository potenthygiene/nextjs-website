import Footer from "@/app/components/common/Footer";
import { Navbar } from "@/app/components/common/Navbar";
import { NotFoundView } from "@/app/components/common/site/NotFoundView";

// Unknown addresses outside the shop's own layout still get the header and footer.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <NotFoundView />
      <Footer />
    </>
  );
}
