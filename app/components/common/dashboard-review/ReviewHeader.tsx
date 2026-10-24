
import { WriteReviewModal } from "./WriteReviewModal";
import { REVIEW_PHOTO_REWARD_RUPEES as PHOTO_RS, REVIEW_TEXT_REWARD_RUPEES as TEXT_RS } from "@/lib/rewardsRules";

// Reviews are written per delivered product (the list below), so there is
// no general "write a review" button here.
export const ReviewHeader = (_props: { onReviewSuccess?: () => void }) => (
  <div className="bg-white p-6 rounded-[15px] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h2 className="text-[18px] font-bold text-ink">Reviews & Ratings</h2>
      <p className="text-[13px] text-gray-500 font-medium">
        Review the products you have received: earn ₹{TEXT_RS} for a review, or ₹{PHOTO_RS} with a photo, once it is approved.
      </p>
    </div>
  </div>
);

export const ReviewCard = ({
  product,
  onSuccess,
}: {
  product: any;
  onSuccess?: () => void;
}) => (
  <div className="flex md:flex-row flex-col gap-4 justify-between items-start md:items-center p-4 border border-gray-200 rounded-xl transition-all">
    <div className="space-y-1">
      <p className="text-[14px] font-bold text-ink">{product.name}</p>
      <p className="text-[12px] text-gray-400 font-medium">
        Order: {product.orderId}
        {product.deliveredDate ? ` · Ordered: ${product.deliveredDate}` : ""}
      </p>
    </div>
    <WriteReviewModal product={product} onSuccess={onSuccess} />
  </div>
);