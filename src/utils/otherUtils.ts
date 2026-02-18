export type Currency = "CZK" | "EUR" | "USD" | "GBP" | "PLN";

const exchangeRates: Record<string, number> = {
  EUR: 25,
  USD: 23,
  GBP: 30,
  PLN: 6,
};

export const convertToCZK = (amount: string, currency: string) => {
  const parsedAmount = parseFloat(amount);

  if (currency === "CZK") {
    return parsedAmount;
  }

  if (exchangeRates[currency]) {
    return parsedAmount * exchangeRates[currency];
  }

  throw new Error("Unknown currency: " + currency);
};

export const convertCurrency = (amountInCZK: number, targetCurrency: Currency): number => {
  if (targetCurrency === "CZK") {
    return amountInCZK;
  }

  return amountInCZK / exchangeRates[targetCurrency];
};

const currencyLocales: Record<Currency, string> = {
  CZK: "cs-CZ",
  EUR: "de-DE",
  USD: "en-US",
  GBP: "en-GB",
  PLN: "pl-PL",
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const locale = currencyLocales[currency];
  return amount.toLocaleString(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const normalizeTransactionName = (name: string): string => {
  return name
    .replace(/\*+/g, "")
    .replace(/\/[0-9]+/g, "")
    .replace(/\s+\d+$/g, "")
    .trim();
};

export const createTransactionNameMapping = <T>(data: T[], getItemName: (item: T) => string): Map<string, string> => {
  const mapping = new Map<string, string>();
  const seenNormalized = new Map<string, string>();

  for (const item of data) {
    if (!item) continue;

    const itemName = getItemName(item);
    const normalized = normalizeTransactionName(itemName);

    if (!seenNormalized.has(normalized)) {
      seenNormalized.set(normalized, itemName);
    }

    mapping.set(itemName, seenNormalized.get(normalized)!);
  }

  return mapping;
};

export const calculateItemAmounts = <T extends { Objem?: string; Měna?: string }>(
  data: T[],
  getItemName: (item: T) => string,
  targetCurrency: Currency = "CZK",
  useMappedNames: boolean = true
): Map<string, number> => {
  const amounts = new Map<string, number>();
  const nameMapping = useMappedNames ? createTransactionNameMapping(data, getItemName) : null;

  for (const item of data) {
    if (!item || !item.Objem || !item.Měna) continue;

    const itemName = getItemName(item);
    const representativeName = nameMapping ? nameMapping.get(itemName) || itemName : itemName;
    const amountInCZK = convertToCZK(item.Objem.replace(",", "."), item.Měna);
    const amount = convertCurrency(amountInCZK, targetCurrency);

    amounts.set(representativeName, (amounts.get(representativeName) || 0) + amount);
  }

  return amounts;
};

export const getUniqueItems = <T>(data: T[], getItemName: (item: T) => string, hideDuplicates: boolean): string[] => {
  return data.reduce((acc: string[], item) => {
    if (!item) {
      return acc;
    }

    const it = getItemName(item);

    if (hideDuplicates) {
      const normalizedIt = normalizeTransactionName(it);
      const isDuplicate = acc.some((existingItem) => normalizeTransactionName(existingItem) === normalizedIt);

      if (!isDuplicate) {
        acc.push(it);
      }
    } else {
      if (!acc.includes(it)) {
        acc.push(it);
      }
    }

    return acc;
  }, []);
};

export const groupDataByCategory = <T extends { category: string; Datum?: string }>(data: T[]): Record<string, T[]> => {
  return data.reduce((acc: Record<string, T[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    if (!item.Datum) {
      return acc;
    }

    acc[item.category].push(item);

    return acc;
  }, {});
};

export const calculateTotalSum = (
  data: Array<{ Objem?: string; Měna?: string }>,
  targetCurrency: Currency = "CZK"
): string => {
  let sum = 0;

  for (const record of data) {
    if (!record.Objem || !record.Měna) {
      continue;
    }

    const amountInCZK = convertToCZK(record.Objem.replace(",", "."), record.Měna);
    sum += convertCurrency(amountInCZK, targetCurrency);
  }

  return sum.toFixed(1);
};

export const createItemToTransactionsMap = <T>(
  data: T[],
  getItemName: (item: T) => string,
  useMappedNames: boolean = true
): Map<string, T[]> => {
  const transactionsMap = new Map<string, T[]>();
  const nameMapping = useMappedNames ? createTransactionNameMapping(data, getItemName) : null;

  for (const item of data) {
    if (!item) continue;

    const itemName = getItemName(item);
    const representativeName = nameMapping ? nameMapping.get(itemName) || itemName : itemName;

    if (!transactionsMap.has(representativeName)) {
      transactionsMap.set(representativeName, []);
    }

    transactionsMap.get(representativeName)!.push(item);
  }

  return transactionsMap;
};
