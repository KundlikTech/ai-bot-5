const requests = new Map<string, { count: number; time: number }>();

const WINDOW = 60 * 1000; // 1 min
const LIMIT = 20;

export const rateLimit = async (c, next) => {
  const ip =
    c.req.header("x-forwarded-for") ||
    "local";

  const now = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, time: now });
    return next();
  }

  const record = requests.get(ip)!;

  if (now - record.time > WINDOW) {
    requests.set(ip, { count: 1, time: now });
    return next();
  }

  if (record.count >= LIMIT) {
    return c.json(
      { error: "Too many requests. Please wait." },
      429
    );
  }

  record.count++;
  return next();
};
