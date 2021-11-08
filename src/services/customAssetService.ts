import { AxiosResponse } from "axios";
import apiService from "./apiService";
import { CustomAsset, NewCustomAsset, EditCustomAsset, AssetEvent, WealthItem } from "src/types/customAssets";
import moment from "moment";

class CustomAssetService {
    private basePath = "custom";
    private routes = {
        balances: `${this.basePath}/balances`,
        assets: `${this.basePath}/assets`,
        assetBalances: `${this.basePath}/assets/{assetId}/balances`,
    };

    public async getBalances(): Promise<AxiosResponse<WealthItem[]>> {
        return await apiService.get<WealthItem[]>(this.routes.balances);
    }

    public async getCustomAssets(): Promise<AxiosResponse<CustomAsset[]>> {
        return await apiService.get<CustomAsset[]>(this.routes.assets);
    }

    public async getCustomAsset(assetId: string): Promise<AxiosResponse<CustomAsset>> {
        return await apiService.get<CustomAsset>(`${this.routes.assets}/${assetId}`);
    }

    public async createCustomAsset(newAsset: NewCustomAsset): Promise<AxiosResponse<CustomAsset>> {
        return await apiService.post<CustomAsset>(`${this.routes.assets}/`, newAsset);
    }

    public async updateCustomAsset(
        assetId: string,
        updatedAsset: EditCustomAsset
    ): Promise<AxiosResponse<CustomAsset>> {
        return await apiService.patch<CustomAsset>(`${this.routes.assets}/${assetId}`, updatedAsset);
    }

    public async deleteCustomAsset(assetId: string): Promise<AxiosResponse<void>> {
        return await apiService.delete<void>(`${this.routes.assets}/${assetId}`);
    }

    public async getCustomAssetBalances(assetId: string): Promise<AxiosResponse<WealthItem[]>> {
        return await apiService.get<WealthItem[]>(`${this.routes.assets}/${assetId}/balances`);
    }

    public async putAssetEvent(assetId: string, assetEvent: AssetEvent): Promise<AxiosResponse<AssetEvent>> {
        return await apiService.put<AssetEvent>(`${this.routes.assets}/${assetId}/events`, assetEvent);
    }

    public async deleteAssetEvent(assetId: string, assetEvent: AssetEvent): Promise<AxiosResponse> {
        return await apiService.delete(`${this.routes.assets}/${assetId}/events/${moment(assetEvent.date).format('YYYY-MM-DD')}`, assetEvent);
    }
}

export const assetService = new CustomAssetService();
export default assetService;
