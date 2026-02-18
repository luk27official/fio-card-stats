export type CategoryName = string;

export type Category = {
  id: string;
  name: string;
  prettyName: string;
  color: string;
};

export const defaultCategories: Category[] = [
  { id: "food", name: "food", prettyName: "Food", color: "#FF9933" },
  { id: "travel", name: "travel", prettyName: "Travel", color: "#3399FF" },
  { id: "ATM", name: "ATM", prettyName: "ATM", color: "#FF3333" },
  { id: "living", name: "living", prettyName: "Living", color: "#FF6666" },
  { id: "income", name: "income", prettyName: "Income", color: "#33CC33" },
  { id: "freetime", name: "freetime", prettyName: "Free Time", color: "#9933FF" },
  { id: "other", name: "other", prettyName: "Other", color: "#999999" },
  { id: "transfer", name: "transfer", prettyName: "Transfers", color: "#666666" },
];

// Generate a random vibrant color for new categories
export const generateCategoryColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 50 + Math.floor(Math.random() * 10); // 50-60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Load categories from localStorage or return defaults
export const loadCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem("customCategories");
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCategories;
    }
  } catch (e) {
    console.error("Failed to load categories from localStorage:", e);
  }
  return defaultCategories;
};

// Save categories to localStorage
export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem("customCategories", JSON.stringify(categories));
  } catch (e) {
    console.error("Failed to save categories to localStorage:", e);
  }
};

// Helper functions to get category properties
export const getCategoryColor = (categoryName: string, categories: Category[]): string => {
  const category = categories.find((c) => c.name === categoryName);
  return category?.color || "#999999";
};

export const getCategoryPrettyName = (categoryName: string, categories: Category[]): string => {
  const category = categories.find((c) => c.name === categoryName);
  return category?.prettyName || categoryName;
};

// Legacy support for old code
export const categoryColors: Record<string, string> = defaultCategories.reduce(
  (acc, cat) => {
    acc[cat.name] = cat.color;
    return acc;
  },
  {} as Record<string, string>
);

export const defaultCategoryMapping: Record<string, string> = {
  "bolt.eu/o": "travel",
  "operator ict": "travel",
  "www.cd.cz": "travel",
  studentagency: "travel",
  leoexpress: "travel",
  "gopay  *leoexpress": "travel",
  uber: "travel",

  lidl: "food",
  tesco: "food",
  albert: "food",
  kaufland: "food",
  zabka: "food",
  kebab: "food",
  donalds: "food", // McDonalds
  burger: "food",
  kfc: "food",
  subway: "food",
  pizz: "food", // pizza, pizzeria...
  bageterie: "food",
  potraviny: "food",
  restaur: "food", // restaurant
  penny: "food",
  billa: "food",
  geco: "food",
  "dm drogerie": "food",
  rangoli: "food",
  wok: "food",
  cafe: "food",
  kavarna: "food",
  kozlovna: "food",
  foodora: "food",
  sodexo: "food",
  relay: "food",

  bankomat: "ATM",
  "vyber z bankomatu": "ATM",

  ikea: "living",
  jysk: "living",
  sportisimo: "living",
  action: "living",
  najem: "living",
  rent: "living",
  byt: "living",
  alza: "living",
  o2: "living",
  vodafone: "living",
  mobile: "living",

  "platba prevodem uvnitr banky": "transfer",
  transfer: "transfer",
  revolut: "transfer",
  "okamžitá odchozí platba": "transfer",

  "bezhotovostní příjem": "income",
  "okamžitá příchozí platba": "income",
  mzda: "income",
  výplata: "income",
  plat: "income",
  salary: "income",
  bonus: "income",
};

// Legacy support for old code
export const prettifiedCategoryNames: Record<string, string> = defaultCategories.reduce(
  (acc, cat) => {
    acc[cat.name] = cat.prettyName;
    return acc;
  },
  {} as Record<string, string>
);
