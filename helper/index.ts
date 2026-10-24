// category
export {
  createCategory,
  updateCategory,
  attachProductCategory,
  getCategories,
  getProductCategory,
  updateProductCategory,
  getCategoriesPagination,
  deleteCategory,
} from "./category/action";

export {
  createCoupon,
  updateCoupon,
  getCouponsPagination,
  getCouponById,
  deleteCoupon,
} from "./coupon/action";

export {
  getCheckoutPricing,
  getDirectCheckoutPricing,
  calculateCheckoutPricingForUser,
  validateCartCoupon,
} from "./checkout/action";

// order
export {
  fetchOrders,
  fetchOrderDetails,
  updateOrderStatus,
  createOrder,
  createPendingCheckoutOrder,
  createCancelRequest,
  createReturnRequest,
  updateCancelRequestStatus,
  updateReturnRequestStatus,
} from "./order/action";

export {
  getAddresses,
  createUserAddress,
  getUserAddressById,
  updateProfile,
  getProfile,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  subscribeEmail,
} from "./user/action";

//cart
export {
  getCart,
  addToCart,
  removeFromCart,
  syncCartWithDatabase,
  updateCartItemQuantity,
  clearCart,
} from "./cart/action";

//profile

export { getUserProfile, updateUserProfile } from "./profile/action";

//auth
export {
  signIn,
  signUp,
  refreshToken,
  verifyOtp,
  confirmForgotPassword,
  resendOtp,
  forgotPassword,
} from "./auth/action";
export {
  addToWishlistDB,
  getWishlistDB,
  removeFromWishlistDB,
} from "./wishlist/action";

export { useFileUpload } from "./useFileUpload";

export {
  getProductSimilarProducts,
  getFullProduct,
  getBestSellingProducts,
  getCategoryName,
  getBrandBestSellingProducts,
  getBrandNewArrivalProducts,
  getQuizSuggestedProducts
} from "./product/action";

export {
  createReview,
  getProductReviews,
  toggleApproveReview,
  rejectReview,
  deleteReview,
  getReviewStats,
  getUserAllReviews,
  getReviewableProducts,
} from "./review/action";




export {
  getUserSubscriptions,
  pauseUserSubscription,
  resumeUserSubscription,
  cancelUserSubscription,
} from "./subscription/action";
