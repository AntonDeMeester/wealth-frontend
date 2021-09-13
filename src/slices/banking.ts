import { createSlice, EntityState } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { Account, EditAccount } from "src/types/banking";
import { AppThunk } from "src/store";
import { bankService } from "../services/bankService";

const accountsAdapter = createEntityAdapter<Account>({
    selectId: (account) => account.accountId,
});

interface BankingState {
    accounts: EntityState<Account>;
    selectedAccountId: string | null;
    isModalOpen: boolean;
}

const initialState: BankingState = {
    accounts: accountsAdapter.getInitialState(),
    selectedAccountId: null,
    isModalOpen: false,
};

const nestedSelectors = accountsAdapter.getSelectors();
export const { selectAllAccounts, selectAccountById, selectAccountIds } = {
    selectAllAccounts: (state: BankingState) => nestedSelectors.selectAll(state.accounts),
    selectAccountById: (state: BankingState, id: string | number) => nestedSelectors.selectById(state.accounts, id),
    selectAccountIds: (state: BankingState) => nestedSelectors.selectIds(state.accounts),
};
export const selectedAccount = (state: BankingState) => selectAccountById(state, state.selectedAccountId);

export const selectAllBalances = (state: BankingState) =>
    selectAllAccounts(state).reduce((balances, acc) => balances.concat(acc.balances ?? []), []);

const slice = createSlice({
    name: "banking",
    initialState,
    reducers: {
        upsertAccounts: (state: BankingState, action: PayloadAction<Account[]>) => {
            state.accounts = accountsAdapter.upsertMany(state.accounts, action.payload);
        },
        upsertAccount: (state: BankingState, action: PayloadAction<Account>) => {
            state.accounts = accountsAdapter.upsertOne(state.accounts, action.payload);
        },
        selectAccount(state: BankingState, action: PayloadAction<string>): void {
            state.isModalOpen = true;
            state.selectedAccountId = action.payload;
        },
        unselectAccount(state: BankingState): void {
            state.selectedAccountId = null;
        },
        openModal(state: BankingState): void {
            state.isModalOpen = true;
        },
        closeModal(state: BankingState): void {
            state.isModalOpen = false;
            state.selectedAccountId = null;
        },
    },
});

export const { reducer } = slice;

export const getAccounts =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await bankService.getAccounts();
        dispatch(slice.actions.upsertAccounts(response.data));
    };

export const getAccountsWithBalances =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await bankService.getAccounts();
        const accounts = response.data;
        dispatch(slice.actions.upsertAccounts(accounts));
        await Promise.all(
            accounts.map(async (acc) => {
                const balanceResponse = await bankService.getAccountBalances(acc.accountId);
                dispatch(
                    slice.actions.upsertAccount({
                        ...acc,
                        balances: balanceResponse.data,
                    })
                );
            })
        );
    };

export const getAccount =
    (accountId: string): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await bankService.getAccount(accountId);
        dispatch(slice.actions.upsertAccount(response.data));
    };

export function editAccount(accountId: string, account: EditAccount): AppThunk {
    return async (dispatch): Promise<void> => {
        const response = await bankService.updateAccount(accountId, account);
        dispatch(slice.actions.upsertAccount(response.data));
    };
}

export const selectAccount =
    (accountId: string): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.selectAccount(accountId));
    };

export const unselectAccount =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.unselectAccount());
    };

export const openModal =
    (): AppThunk =>
    (dispatch): void => {
        dispatch(slice.actions.openModal());
    };

export const closeModal =
    (): AppThunk =>
    (dispatch): void => {
        dispatch(slice.actions.closeModal());
    };

export default slice;
