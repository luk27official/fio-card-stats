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