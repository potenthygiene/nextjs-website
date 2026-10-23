// Reward and referral amounts with no database code, so client components can
// import them. lib/rewards.ts re-exports these; change the numbers here only.

export const SIGNUP_BONUS_RUPEES = 50; // ₹50 welcome credit when an account is created
export const REFERRAL_EARNING_RUPEES = 100; // ₹100 credit for the referrer once the friend's first order is delivered
export const REFERRAL_FRIEND_BONUS_RUPEES = 100; // ₹100 extra credit for a friend who joins with a referral link
export const REVIEW_TEXT_REWARD_RUPEES = 50; // ₹50 for review
export const REVIEW_PHOTO_REWARD_RUPEES = 50; // ₹50 for review with photo
export const REVIEW_REWARD_RUPEES = 50;
export const BIRTHDAY_REWARD_RUPEES = 50; // ₹50 annual birthday credit (valid for 3 months)
export const ORDER_REWARD_RATE = 0.05; // 5% of amount paid for products (delivered)
export const REFERRAL_MIN_ORDER_AMOUNT = 399; // Friend's first order must be ₹399 or more
export const MAX_REFERRALS_PER_MONTH = 5; // Up to 5 referrals per person per month
export const MAX_REWARD_REDEEM_PER_ORDER = 150; // at most ₹150 per order
export const MAX_REWARD_REDEEM_PERCENT = 0.2; // up to 20% of product total

const REDEEM_PERCENT_LABEL = `${Math.round(MAX_REWARD_REDEEM_PERCENT * 100)}%`;

/**
 * The referral offer, worded once. Use these lines wherever the referral
 * programme is described, so every page says the same thing.
 */
export const REFERRAL_FRIEND_LINE = `Your friend gets ₹${REFERRAL_FRIEND_BONUS_RUPEES} credit when they join with your link, on top of the ₹${SIGNUP_BONUS_RUPEES} welcome credit and FIRSTCARE15 that every new customer gets.`;
export const REFERRAL_REFERRER_LINE = `You get ₹${REFERRAL_EARNING_RUPEES} credit and SHARECARE15 once their first order of ₹${REFERRAL_MIN_ORDER_AMOUNT} or more is delivered.`;
export const REWARD_CREDIT_LIMIT_LINE = `Credit can pay for up to ${REDEEM_PERCENT_LABEL} of a bag, at most ₹${MAX_REWARD_REDEEM_PER_ORDER} per order.`;
export const REFERRAL_ONE_LINE = `${REFERRAL_FRIEND_LINE} ${REFERRAL_REFERRER_LINE} ${REWARD_CREDIT_LIMIT_LINE}`;
