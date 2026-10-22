import Frequently from '../../components/common/Frequently'
import { pageMetadata } from "@/const/seo";

export const metadata = pageMetadata("faq");


const page = () => {
  return (
    <div>
      <Frequently />
    </div>
  )
}

export default page