// Default fallback exchange rates (from other currencies to CZK)
const FALLBACK_RATES: Record<string, number> = {
  EUR: 25,
  USD: 23,
  GBP: 30,
  PLN: 6,
};

// Cache for fetched rates
let cachedRates: Record<string, number> | null = null;
let lastFetchTime: number = 0;
let usingLiveRates: boolean = false;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetches current exchange rates from API
 * Returns rates as: 1 [currency] = X CZK
 */
export const fetchExchangeRates = async (): Promise<Record<string, number>> => {
  // Return cached rates if still valid
  const now = Date.now();
  if (cachedRates && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedRates;
  }

  try {
    // Fetch rates using Frankfurter API (based on European Central Bank data)
    // This API is free and requires no API key
    const response = await fetch("https://api.frankfurter.app/latest?from=CZK&to=EUR,USD,GBP,PLN", {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates || typeof data.rates !== "object") {
      throw new Error("Invalid API response format");
    }

    // Convert from "1 CZK = X EUR" to "1 EUR = Y CZK"
    const convertedRates: Record<string, number> = {};
    for (const [currency, rate] of Object.entries(data.rates)) {
      if (typeof rate === "number" && rate > 0) {
        convertedRates[currency] = 1 / rate;
      }
    }

    // Validate that we got all currencies
    const requiredCurrencies = ["EUR", "USD", "GBP", "PLN"];
    const hasAllCurrencies = requiredCurrencies.every((currency) => convertedRates[currency]);

    if (!hasAllCurrencies) {
      throw new Error("Missing required currencies in API response");
    }

    // Cache the rates
    cachedRates = convertedRates;
    lastFetchTime = now;
    usingLiveRates = true;

    return convertedRates;
  } catch (error) {
    console.warn("Failed to fetch exchange rates, using fallback values:", error);
    // Use fallback rates and cache them too
    cachedRates = FALLBACK_RATES;
    lastFetchTime = now;
    usingLiveRates = false;
    return FALLBACK_RATES;
  }
};

/**
 * Gets current exchange rates (from cache or fallback)
 */
export const getExchangeRates = (): Record<string, number> => {
  return cachedRates || FALLBACK_RATES;
};

/**
 * Checks if we're currently using live exchange rates (vs fallback)
 */
export const isUsingLiveRates = (): boolean => {
  return usingLiveRates;
};

/**
 * Clears the cache (useful for testing or manual refresh)
 */
export const clearExchangeRateCache = (): void => {
  cachedRates = null;
  lastFetchTime = 0;
  usingLiveRates = false;
};
