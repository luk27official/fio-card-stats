export type CategoryName = "food" | "travel" | "ATM" | "freetime" | "income" | "living" | "other" | "transfer";

export const categoryColors: Record<CategoryName, string> = {
    food: '#FFD8A8',       // Soft orange
    travel: '#B3D1FF',     // Light blue
    ATM: '#FFA8A8',        // Light red
    living: '#FFA8A8',     // Light red
    income: '#A8D8A8',     // Light green
    freetime: '#D8A8FF',   // Soft purple
    other: '#E0E0E0',      // Light gray
    transfer: '#A8A8A8',   // Darker gray
};

export const defaultCategoryMapping: Record<string, CategoryName> = {
    "bolt.eu/o": "travel",
    "operator ict": "travel",
    "www.cd.cz": "travel",
    "studentagency": "travel",
    "leoexpress": "travel",
    "gopay  *leoexpress": "travel",
    "uber": "travel",

    "lidl": "food",
    "tesco": "food",
    "albert": "food",
    "kaufland": "food",
    "zabka": "food",
    "kebab": "food",
    "donalds": "food",  // McDonalds
    "burger": "food",
    "kfc": "food",
    "subway": "food",
    "pizz": "food",     // pizza, pizzeria...
    "bageterie": "food",
    "potraviny": "food",
    "restaur": "food",  // restaurant
    "penny": "food",
    "billa": "food",
    "geco": "food",
    "dm drogerie": "food",
    "rangoli": "food",
    "wok": "food",
    "cafe": "food",
    "kavarna": "food",
    "kozlovna": "food",
    "foodora": "food",
    "sodexo": "food",
    "relay": "food",

    "bankomat": "ATM",
    "vyber z bankomatu": "ATM",

    "ikea": "living",
    "jysk": "living",
    "sportisimo": "living",
    "action": "living",
    "najem": "living",
    "rent": "living",
    "byt": "living",
    "alza": "living",
    "o2": "living",
    "vodafone": "living",
    "mobile": "living",

    "platba prevodem uvnitr banky": "transfer",
    "transfer": "transfer",
    "revolut": "transfer",
    "okamžitá odchozí platba": "transfer",

    "bezhotovostní příjem": "income",
    "okamžitá příchozí platba": "income",
    "mzda": "income",
    "výplata": "income",
    "plat": "income",
    "salary": "income",
    "bonus": "income",
};

export const prettifiedCategoryNames: Record<CategoryName, string> = {
    food: "Food",
    travel: "Travel",
    ATM: "ATM",
    living: "Living",
    income: "Income",
    freetime: "Free Time",
    other: "Other",
    transfer: "Transfers"
};