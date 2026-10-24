import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  SES_AWS_ACCESS_KEY_ID,
  SES_AWS_SECRET_ACCESS_KEY,
} from "@/env";
import { SESClient } from "@aws-sdk/client-ses";

// Email-only keys if they are set, otherwise the site's main AWS key.
const useSesKeys = !!(SES_AWS_ACCESS_KEY_ID && SES_AWS_SECRET_ACCESS_KEY);

export const sesClient = new SESClient({
  region: AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: useSesKeys ? SES_AWS_ACCESS_KEY_ID : AWS_ACCESS_KEY_ID,
    secretAccessKey: useSesKeys ? SES_AWS_SECRET_ACCESS_KEY : AWS_SECRET_ACCESS_KEY,
  },
});
