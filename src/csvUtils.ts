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