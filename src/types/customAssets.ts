
export interface AssetEvent {
    date: string;
    amount: number;
}   

export interface CustomAsset {
    assetId: string;
    description: string;
    currency: string;
    currentValue: number;
    currentValueInEuro: number;
    balances?: WealthItem[];
    events?: AssetEvent[];
}

export interface NewCustomAsset {
    description:string;
    amount: number
    currency: string
    assetDate: string;
}

export type EditCustomAsset = Partial<Pick<CustomAsset, "description" | "currency" | "events">>;

export interface WealthItem {
    date: string;
    amount: number;
    amountInEuro: number;
}
