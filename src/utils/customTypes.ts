export type CategoryName = "food" | "travel" | "ATM" | "freetime" | "other";

export const categoryColors: Record<CategoryName, string> = {
    food: '#FFD8A8',       // Soft orange
    travel: '#B3D1FF',     // Light blue
    ATM: '#A8D8A8',        // Lime darker green
    freetime: '#D8A8FF',   // Soft purple
    other: '#E0E0E0'       // Light gray
};