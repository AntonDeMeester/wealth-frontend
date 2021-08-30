const currencyFormatter = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
});

export function formatCurrency(amount: string | number) {
    return currencyFormatter.format(Number(amount));
}
