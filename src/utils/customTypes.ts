export type CategoryName = "food" | "travel" | "ATM" | "freetime" | "income" | "living" | "other";

export const categoryColors: Record<CategoryName, string> = {
    food: '#FFD8A8',       // Soft orange
    travel: '#B3D1FF',     // Light blue
    ATM: '#FFA8A8',        // Light red
    living: '#FFA8A8',     // Light red
    income: '#A8D8A8',     // Light green
    freetime: '#D8A8FF',   // Soft purple
    other: '#E0E0E0'       // Light gray
};

export const defaultMapping: Record<string, CategoryName> = {
    "bolt.eu/o": "travel",
    "operator ict": "travel",
    "www.cd.cz": "travel",
    "studentagency": "travel",
    "leoexpress": "travel",
    "uber": "travel",

    "lidl": "food",
    "tesco": "food",
    "albert": "food",
    "kaufland": "food",
    "zabka": "food",
    "kebab": "food",
    "donalds": "food",  // McDonalds
    "burger": "food",
    "penny": "food",
    "kfc": "food",
    "subway": "food",
    "pizz": "food",     // pizza, pizzeria...
    "bageterie": "food",
    "potraviny": "food",
    "restaur": "food",  // restaurant

    "bankomat": "ATM",

    "ikea": "living",
};
