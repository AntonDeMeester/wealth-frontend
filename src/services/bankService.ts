import { AxiosResponse } from "axios";
import {
    Account,
    EditAccount,
    TinkLinkCallbackParameters,
    TinkLinkParameters,
    TinkLinkResponse,
    WealthItem,
} from "src/types/banking";
import apiService from "./apiService";

class BankService {
    private basePath = "banking";
    private routes = {
        balances: `${this.basePath}/balances`,
        accounts: `${this.basePath}/accounts`,
        accountBalances: `${this.basePath}/accounts/{account}/balances`,
    };

    private tinkBaseBath = "tink";
    private tinkRoutes = {
        tinkLink: `${this.tinkBaseBath}/bank`,
        tinkCallback: `${this.tinkBaseBath}/callback`,
        tinkRefreshCredentials: `${this.tinkBaseBath}/bank/refresh`
    };

    public async getBalances(): Promise<AxiosResponse<WealthItem[]>> {
        return await apiService.get<WealthItem[]>(this.routes.balances);
    }

    public async getAccounts(): Promise<AxiosResponse<Account[]>> {
        return await apiService.get<Account[]>(this.routes.accounts);
    }

    public async getAccount(accountId: string): Promise<AxiosResponse<Account>> {
        return await apiService.get<Account>(`${this.routes.accounts}/${accountId}`);
    }

    public async updateAccount(accountId: string, updatedAccount: EditAccount): Promise<AxiosResponse<Account>> {
        return await apiService.patch<Account>(`${this.routes.accounts}/${accountId}`, updatedAccount);
    }

    public async getAccountBalances(accountId: string): Promise<AxiosResponse<WealthItem[]>> {
        return await apiService.get<WealthItem[]>(`${this.routes.accounts}/${accountId}/balances`);
    }

    public async getTinkLink(params: TinkLinkParameters): Promise<AxiosResponse<TinkLinkResponse>> {
        return await apiService.get<TinkLinkResponse>(`${this.tinkRoutes.tinkLink}`, undefined, { ...params });
    }
    
    public async refreshTink(credentialId: string): Promise<AxiosResponse<TinkLinkResponse>> {
        return await apiService.get<TinkLinkResponse>(`${this.tinkRoutes.tinkRefreshCredentials}/${credentialId}`);
    }

    public async tinkCallback(params: TinkLinkCallbackParameters): Promise<AxiosResponse<{}>> {
        return await apiService.post<{}>(`${this.tinkRoutes.tinkCallback}`, params);
    }
}

export const bankService = new BankService();
export default bankService;
