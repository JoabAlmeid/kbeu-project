import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// Connection event handlers
redis.on("connect", () => {
  console.log("🟢 Redis connected to Upstash");
});

redis.on("error", (err) => {
  console.error("🔴 Redis connection error:", err);
});

// Test the connection immediately
(async () => {
  try {
    const pong = await redis.ping();
    console.log("Redis ping response:", pong); // Should log "PONG" if working
  } catch (err) {
    console.error("Redis ping failed:", err);
  }
})();
