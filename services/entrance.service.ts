import { apiService } from "./api.service";

export const entranceService = {
    getEntrances: async () => {
        const response = await apiService.get('/entrances')
        if (!response.success) throw new Error(response.error);
        return response.data;
    }
}