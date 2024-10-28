import parse from "csv-simple-parser";

export type FioCSVData = {
    "Zdrojový účet": string;
    "Datum": string;
    "Objem": string;
    "Měna": string;
    "Protiúčet": string;
    "Kód banky": string;
    "Zpráva pro příjemce": string;
    "Poznámka": string;
    "Typ": string;
};

export type CategorizedFioCSVData = FioCSVData & { category: string; };

export function loadCSV(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = (event) => {
            if (event.target) {
                resolve(event.target.result as string);
            }
        };

        reader.onerror = (event) => {
            reject(event);
        };

        reader.readAsText(file);
    });
}

export function parseCSV(data: string): FioCSVData[] {
    return parse(data, { delimiter: ";", header: true }) as FioCSVData[];
}