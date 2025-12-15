export const parseExpiry = (expiry: string): number => {
  if (!expiry) return 0;

  const trimmed = expiry.trim().toLowerCase();
  const unit = trimmed.slice(-1);
  const value = parseFloat(trimmed.slice(0, -1));

  if (isNaN(value)) return 0;

  switch (unit) {
    case "h":
      return value * 60 * 60 * 1000; // hours to ms
    case "m":
      return value * 60 * 1000; // minutes to ms
    case "s":
      return value * 1000; // seconds to ms
    case "d":
      return value * 24 * 60 * 60 * 1000; // days to ms
    default:
      return value * 60 * 60 * 1000; // default to hours
  }
};
