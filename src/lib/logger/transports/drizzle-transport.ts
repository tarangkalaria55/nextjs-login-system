/** biome-ignore-all lint/suspicious/noExplicitAny: *** */

import { type InferInsertModel, lt, sql } from "drizzle-orm";
import Transport from "winston-transport";
import type { DbType } from "@/drizzle/db";
import { logs } from "@/drizzle/schema";

type NewLog = InferInsertModel<typeof logs>;

// Type for valid PostgreSQL interval units
type IntervalUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

interface LogInfo {
  level: string;
  message: string;
  timestamp?: string;
  [key: string]: any;
}

interface DrizzleTransportOptions extends Transport.TransportStreamOptions {
  db: DbType;

  retentionAmount?: number;

  retentionUnit?: IntervalUnit;
}

export class DrizzleTransport extends Transport {
  private db: DbType;
  retentionAmount: number = 30;
  retentionUnit: IntervalUnit = "day";

  constructor(opts: DrizzleTransportOptions) {
    super(opts);
    this.db = opts.db;
    this.retentionAmount = opts.retentionAmount ?? 30;
    this.retentionUnit = opts.retentionUnit ?? "day";
  }

  async log(info: LogInfo, callback: () => void): Promise<void> {
    const { level, message, timestamp: _timestamp, ...meta } = info;

    const logEntry: NewLog = {
      level: level,
      message: message,
      meta: JSON.stringify(meta || {}),
    };

    try {
      await this.db.insert(logs).values(logEntry);

      this.emit("logged", info);

      try {
        const intervalString = `${this.retentionAmount} ${this.retentionUnit}`;

        const retentionInterval = sql.raw(`INTERVAL '${intervalString}'`);
        const cutoffDate = sql`NOW() - ${retentionInterval}`;

        await this.db.delete(logs).where(lt(logs.timestamp, cutoffDate));
      } catch (cleanupErr) {
        console.error("DrizzleTransport log cleanup failed:", cleanupErr);
      }
    } catch (err) {
      this.emit("error", err);
    } finally {
      callback();
    }
  }
}
