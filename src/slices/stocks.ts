import { createSlice, EntityState } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { AppThunk } from "src/store";
import { stockService } from "../services/stockService";
import { EditStockPosition, NewStockPosition, StockPosition } from "src/types/stocks";

const positionsAdapter = createEntityAdapter<StockPosition>({
    selectId: (position) => position.positionId,
});

interface StocksState {
    positions: EntityState<StockPosition>;
    selectedPositionId: string | null;
    isModalOpen: boolean;
}

const initialState: StocksState = {
    positions: positionsAdapter.getInitialState(),
    selectedPositionId: null,
    isModalOpen: false,
};

const nestedSelectors = positionsAdapter.getSelectors();
export const { selectAllPositions, selectPositionById, selectPositionIds } = {
    selectAllPositions: (state: StocksState) => nestedSelectors.selectAll(state.positions),
    selectPositionById: (state: StocksState, id: string | number) => nestedSelectors.selectById(state.positions, id),
    selectPositionIds: (state: StocksState) => nestedSelectors.selectIds(state.positions),
};
export const selectedPosition = (state: StocksState) => selectPositionById(state, state.selectedPositionId);

export const selectAllBalances = (state: StocksState) =>
    selectAllPositions(state).reduce((balances, position) => balances.concat(position.balances ?? []), []);

const slice = createSlice({
    name: "stocks",
    initialState,
    reducers: {
        upsertAccounts: (state: StocksState, action: PayloadAction<StockPosition[]>) => {
            state.positions = positionsAdapter.upsertMany(state.positions, action.payload);
        },
        upsertPosition: (state: StocksState, action: PayloadAction<StockPosition>) => {
            state.positions = positionsAdapter.upsertOne(state.positions, action.payload);
        },
        selectPosition(state: StocksState, action: PayloadAction<string>): void {
            state.isModalOpen = true;
            state.selectedPositionId = action.payload;
        },
        unselectPosition(state: StocksState): void {
            state.selectedPositionId = null;
        },
        openModal(state: StocksState): void {
            state.isModalOpen = true;
        },
        closeModal(state: StocksState): void {
            state.isModalOpen = false;
            state.selectedPositionId = null;
        },
    },
});

export const { reducer } = slice;

export const getPositions =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await stockService.getPositions();
        dispatch(slice.actions.upsertAccounts(response.data));
    };

export const getPositionsWithBalances =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await stockService.getPositions();
        const positions = response.data;
        await Promise.all(
            positions.map(async (position) => {
                const balanceResponse = await stockService.getPositionBalances(position.positionId);
                dispatch(
                    slice.actions.upsertPosition({
                        ...position,
                        balances: balanceResponse.data,
                    })
                );
            })
        );
    };

export const getPosition =
    (positionId: string): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await stockService.getPosition(positionId);
        dispatch(slice.actions.upsertPosition(response.data));
    };

export function createPosition(position: NewStockPosition): AppThunk {
    return async (dispatch): Promise<void> => {
        const response = await stockService.createPosition(position);
        dispatch(slice.actions.upsertPosition(response.data));
    };
}

export function editPosition(positionId: string, position: EditStockPosition): AppThunk {
    return async (dispatch): Promise<void> => {
        const response = await stockService.updatePosition(positionId, position);
        dispatch(slice.actions.upsertPosition(response.data));
    };
}

export const selectPosition =
    (positionId: string): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.selectPosition(positionId));
    };

export const unselectPosition =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        dispatch(slice.actions.unselectPosition());
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
