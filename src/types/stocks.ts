export interface StockPosition {
    positionId: string;
    amount: number;
    startDate: string;
    ticker: string;
    currentValue: number;
    currentValueInEuro: number;
    balances?: WealthItem[];
}

export type NewStockPosition = Omit<StockPosition, "positionId" | "currentValue" | "currentValueInEuro">;

export type EditStockPosition = Partial<Pick<StockPosition, "amount" | "startDate">>;

export interface WealthItem {
    date: string;
    amount: number;
    amountInEuro: number;
}

export interface TickerSearchItem {
    ticker: string;
    name: string;
    type: string;
    region: string;
    matchScore: number;
}
