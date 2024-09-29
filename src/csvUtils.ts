import parse from "csv-simple-parser";
export type CSVData = { [key: string]: string; }[];

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

export function parseCSV(data: string): CSVData[] {
    return parse(data, { delimiter: ";", header: true }) as CSVData[];
}