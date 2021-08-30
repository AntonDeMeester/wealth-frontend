import { AxiosResponse } from "axios";
import { EditStockPosition, NewStockPosition, StockPosition, TickerSearchItem, WealthItem } from "src/types/stocks";
import apiService from "./apiService";

class StockService {
    private basePath = "stocks";
    private routes = {
        balances: `${this.basePath}/balances`,
        positions: `${this.basePath}/positions`,
        positionsBalances: `${this.basePath}/positions/{position}/balances`,
    };

    public async getBalances(): Promise<AxiosResponse<WealthItem[]>> {
        return await apiService.get<WealthItem[]>(this.routes.balances);
    }

    public async getPositions(): Promise<AxiosResponse<StockPosition[]>> {
        return await apiService.get<StockPosition[]>(this.routes.positions);
    }

    public async getPosition(positionId: string): Promise<AxiosResponse<StockPosition>> {
        return await apiService.get<StockPosition>(`${this.routes.positions}/${positionId}`);
    }

    public async createPosition(newPosition: NewStockPosition): Promise<AxiosResponse<StockPosition>> {
        return await apiService.post<StockPosition>(`${this.routes.positions}`, newPosition);
    }

    public async updatePosition(
        positionId: string,
        updatedPosition: EditStockPosition
    ): Promise<AxiosResponse<StockPosition>> {
        return await apiService.patch<StockPosition>(`${this.routes.positions}/${positionId}`, updatedPosition);
    }

    public async getPositionBalances(positionId: string): Promise<AxiosResponse<WealthItem[]>> {
        return await apiService.get<WealthItem[]>(`${this.routes.positions}/${positionId}/balances`);
    }

    public async searchTicker(ticker: string): Promise<AxiosResponse<TickerSearchItem[]>> {
        return await apiService.get<TickerSearchItem[]>(`stocks/search/${ticker}`);
    }
}

export const stockService = new StockService();
export default stockService;
