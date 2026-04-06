import { Entrance } from "@/interfaces/entrance-interface";
import { apiService } from "./api.service";

export const entranceService = {
    getEntrances: async () => {
        const response = await apiService.get('/entrances')
        if (!response.success) throw new Error(response.error);
        return response.data;
    },
     getMCAEntranceExams: async () => {
        const response = await apiService.get("/entrances/mca-entrance");
        if (!response.success) throw new Error(response.error);
        return response.data as Entrance[];
      },
}