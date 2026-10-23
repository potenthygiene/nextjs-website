import { cache } from "react";
import { getFullProductDetails } from "@/helper/product/action";

// One database read per request, shared by the product page and its layout.
export const getProductOnce = cache((slug: string) => getFullProductDetails(slug));
