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
    credentialId: string | null;
    credentialStatus: string | null;
    balances?: WealthItem[];
}

export interface TinkLinkParameters {
    market: string;
    test: string | undefined;
}

export interface TinkLinkResponse {
    url: string;
}

export interface TinkLinkCallbackParameters {
    code?: string;
    credentialsId?: string;
}
