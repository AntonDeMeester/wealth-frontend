import { createSlice, EntityState } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { AppThunk } from "src/store";
import { AssetEvent, CustomAsset, NewCustomAsset, EditCustomAsset } from "src/types/customAssets";
import {assetService} from "src/services/customAssetService";


const assetsAdapter = createEntityAdapter<CustomAsset>({
    selectId: (asset) => asset.assetId,
});

interface CustomAssetsState {
    assets: EntityState<CustomAsset>;
}

const initialState: CustomAssetsState = {
    assets: assetsAdapter.getInitialState()
};

const nestedSelectors = assetsAdapter.getSelectors();
export const { selectAllAssets, selectAssetById, selectAssetIds } = {
    selectAllAssets: (state: CustomAssetsState) => nestedSelectors.selectAll(state.assets),
    selectAssetById: (state: CustomAssetsState, id: string | number) => nestedSelectors.selectById(state.assets, id),
    selectAssetIds: (state: CustomAssetsState) => nestedSelectors.selectIds(state.assets),
};

export const selectAllBalances = (state: CustomAssetsState) =>
    selectAllAssets(state).reduce((balances, asset) => balances.concat(asset.balances ?? []), []);

const slice = createSlice({
    name: "stocks",
    initialState,
    reducers: {
        upsertAssets: (state: CustomAssetsState, action: PayloadAction<CustomAsset[]>) => {
            state.assets = assetsAdapter.upsertMany(state.assets, action.payload);
        },
        upsertAsset: (state: CustomAssetsState, action: PayloadAction<CustomAsset>) => {
            state.assets = assetsAdapter.upsertOne(state.assets, action.payload);
        },
        removeAsset: (state: CustomAssetsState, action: PayloadAction<string>) => {
            state.assets = assetsAdapter.removeOne(state.assets, action.payload);
        },
        removeAllAssets: (state: CustomAssetsState, action: PayloadAction<string>) => {
            state.assets = assetsAdapter.removeAll(state.assets);
        },
    },
});

export const { reducer } = slice;

export const getAssets =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await assetService.getCustomAssets();
        dispatch(slice.actions.upsertAssets(response.data));
    };

export const getAssetsWithBalances =
    (): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await assetService.getCustomAssets();
        const Assets = response.data;
        await Promise.all(
            Assets.map(async (asset) => {
                const balanceResponse = await assetService.getCustomAssetBalances(asset.assetId);
                dispatch(
                    slice.actions.upsertAsset({
                        ...asset,
                        balances: balanceResponse.data,
                    })
                );
            })
        );
    };

export const getAsset =
    (AssetId: string): AppThunk =>
    async (dispatch): Promise<void> => {
        const response = await assetService.getCustomAsset(AssetId);
        const balances = await assetService.getCustomAssetBalances(response.data.assetId)
        dispatch(slice.actions.upsertAsset({...response.data, balances: balances.data}));
    };

export function createAsset(asset: NewCustomAsset): AppThunk {
    return async (dispatch): Promise<void> => {
        const response = await assetService.createCustomAsset(asset);
        const balances = await assetService.getCustomAssetBalances(response.data.assetId)
        dispatch(slice.actions.upsertAsset({...response.data, balances: balances.data}));
    };
}

export function editAsset(assetId: string, asset: EditCustomAsset): AppThunk {
    return async (dispatch): Promise<void> => {
        const response = await assetService.updateCustomAsset(assetId, asset);
        dispatch(slice.actions.upsertAsset(response.data));
    };
}

export function deleteAsset(assetId: string): AppThunk {
    return async (dispatch): Promise<void> => {
        await assetService.deleteCustomAsset(assetId);
        dispatch(slice.actions.removeAsset(assetId));
    };
}

export function putAssetEvent(assetId: string, assetEvent: AssetEvent): AppThunk {
    return async (dispatch): Promise<void> => {
        await assetService.putAssetEvent(assetId, assetEvent);
        const responseAsset = await assetService.getCustomAsset(assetId)
        const responseBalances = await assetService.getCustomAssetBalances(assetId);
        dispatch(slice.actions.upsertAsset({
            ...responseAsset.data,
            balances: responseBalances.data
        }));
    };
}

export function deleteAssetEvent(assetId: string, assetEvent: AssetEvent): AppThunk {
    return async (dispatch): Promise<void> => {
        await assetService.deleteAssetEvent(assetId, assetEvent);
        const responseAsset = await assetService.getCustomAsset(assetId)
        const responseBalances = await assetService.getCustomAssetBalances(assetId);
        dispatch(slice.actions.upsertAsset({
            ...responseAsset.data,
            balances: responseBalances.data
        }));
    };
}

export const removeAllAssets =
    (): AppThunk =>
    (dispatch): void => {
        dispatch(slice.actions.removeAllAssets());
    };

export default slice;
