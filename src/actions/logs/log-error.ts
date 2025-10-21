/** biome-ignore-all lint/suspicious/noExplicitAny: *** */
"use server";

import { logger } from "@/lib/logger";

export async function logError(message: string, ...meta: any[]) {
  logger.error(message, ...meta);
}
