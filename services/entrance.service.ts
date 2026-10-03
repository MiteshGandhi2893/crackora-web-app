import { Entrance } from "@/interfaces/entrance-interface";
import { apiService, unwrap } from "./api.service";

export const entranceService = {
  getEntrances: () => unwrap(apiService.get(`/entrances`)),

  getMCAEntranceExams: () =>
    unwrap(apiService.get<Entrance[]>(`/entrances/mca-entrance`)),
};