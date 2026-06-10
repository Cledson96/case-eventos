import { Env } from "@/shared/config";

export const authHeader = {
  Authorization: `Bearer ${Env.apiToken}`,
};
