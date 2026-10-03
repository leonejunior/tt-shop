import { getDb } from "./db";

// In-memory sliding fallback cache for edge worker instances
const inMemoryCache = new Map<string, { count: number; resetAt: number }>();

/**
 * Extract verified client IP from request headers (Cloudflare, proxies, or fallback)
 */
export function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return "127.0.0.1";
}

/**
 * Distributed rate limiter backed by Cloudflare D1 with in-memory edge fallback
 */
export async function checkRateLimit(
  actionKey: string,
  ip: string,
  {
    limit = 5,
    windowSeconds = 600, // 10 minutes default
  }: {
    limit?: number;
    windowSeconds?: number;
  } = {},
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}> {
  const key = `rl:${actionKey}:${ip}`;
  const now = Date.now();
  const resetAt = now + windowSeconds * 1000;

  const db = await getDb();

  if (db) {
    try {
      // Clean up old expired entries occasionally (1 in 20 requests)
      if (Math.random() < 0.05) {
        db.prepare("DELETE FROM rate_limits WHERE reset_at < ?")
          .bind(now)
          .run()
          .catch(() => {});
      }

      const record = await db
        .prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?")
        .bind(key)
        .first<{ count: number; reset_at: number }>();

      if (record && now < record.reset_at) {
        if (record.count >= limit) {
          return {
            success: false,
            limit,
            remaining: 0,
            resetInSeconds: Math.ceil((record.reset_at - now) / 1000),
          };
        }

        await db
          .prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?")
          .bind(key)
          .run();

        return {
          success: true,
          limit,
          remaining: Math.max(0, limit - record.count - 1),
          resetInSeconds: Math.ceil((record.reset_at - now) / 1000),
        };
      }

      // First request or reset expired
      await db
        .prepare(
          "INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)",
        )
        .bind(key, resetAt)
        .run();

      return {
        success: true,
        limit,
        remaining: limit - 1,
        resetInSeconds: windowSeconds,
      };
    } catch (err) {
      console.error("D1 rate limit query failed, falling back to in-memory:", err);
    }
  }

  // Edge memory cache fallback
  const cached = inMemoryCache.get(key);
  if (cached && now < cached.resetAt) {
    if (cached.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetInSeconds: Math.ceil((cached.resetAt - now) / 1000),
      };
    }
    cached.count += 1;
    return {
      success: true,
      limit,
      remaining: limit - cached.count,
      resetInSeconds: Math.ceil((cached.resetAt - now) / 1000),
    };
  }

  inMemoryCache.set(key, { count: 1, resetAt });
  return {
    success: true,
    limit,
    remaining: limit - 1,
    resetInSeconds: windowSeconds,
  };
}

/**
 * Honeypot bot detection: checks if hidden honeypot fields were filled by automated scripts
 */
export function isHoneypotTriggered(body: Record<string, any>): boolean {
  // Check hidden decoy fields that real users never see or fill
  const honeypotFields = ["website", "company", "fax", "phone_hp"];
  for (const field of honeypotFields) {
    if (body && typeof body[field] === "string" && body[field].trim().length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Cloudflare Turnstile token verification (optional, if TURNSTILE_SECRET_KEY is configured)
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  ip?: string,
): Promise<{ success: boolean; message?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // If Turnstile is not configured, pass validation
    return { success: true };
  }

  if (!token) {
    return { success: false, message: "Security verification token is missing" };
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip && ip !== "127.0.0.1") {
      formData.append("remoteip", ip);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      return {
        success: false,
        message: "Bot verification failed. Please try again.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Turnstile verification error:", err);
    // On unexpected validation server error, pass or fail depending on security policy
    return { success: true };
  }
}
