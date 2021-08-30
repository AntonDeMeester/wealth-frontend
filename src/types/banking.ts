export interface EditAccount {
    isActive?: boolean;
    name?: string;
    bankAlias?: string;
}

export interface WealthItem {
    date: string;
    amount: number;
    amountInEuro: number;
}
export interface Account {
    accountId: string;
    source: string;
    accountNumber: string;
    currency: string;
    type: string;
    bank: string;
    bankAlias: string;
    externalId: string;
    name: string;
    isActive: boolean;
    balances?: WealthItem[];
}
