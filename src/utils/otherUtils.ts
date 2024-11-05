export const convertToCZK = (amount: string, currency: string) => {
    if (currency === "CZK") {
        return parseFloat(amount);
    }

    if (currency === "EUR") {
        return parseFloat(amount) * 25;
    }

    if (currency === "USD") {
        return parseFloat(amount) * 23;
    }

    if (currency === "GBP") {
        return parseFloat(amount) * 30;
    }

    if (currency === "PLN") {
        return parseFloat(amount) * 6;
    }

    throw new Error("Unknown currency: " + currency);
};