// lib/rateLimiter.js
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 5;

const ipRequestMap = new Map();

export function rateLimit(ip) {
  const currentTime = Date.now();

  if (!ipRequestMap.has(ip)) {
    ipRequestMap.set(ip, []);
  }

  const requestTimes = ipRequestMap.get(ip).filter(ts => currentTime - ts < rateLimitWindowMs);
  requestTimes.push(currentTime);

  ipRequestMap.set(ip, requestTimes);

  return requestTimes.length <= maxRequestsPerWindow;
}
