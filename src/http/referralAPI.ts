// referralAPI.ts
import { $authHost } from "./index";

export const getReferralsSpentByDay = async (
  year?: number,
  month?: number,
  page = 1,
  limit = 30
) => {
  const { data } = await $authHost.get("api/referral/referrals", {
    params: { year, month, page, limit },
  });
  return data; // { data, totalSpent, totalEarned, page, limit, totalItems }
};
