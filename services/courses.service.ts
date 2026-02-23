import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { Entrance } from "../interfaces/entrance-interface";
import { apiService } from "./api.service";

export const coursesService = {
  getCoursesByExam: async () => {
    const response = await apiService.get("/coursesByExams");
    if (!response.success) throw new Error(response.error);
    return response.data as Entrance[];
  },
  getCoursePackages: async () => {
    const response = await apiService.get("/course-packages");
    if (!response.success) throw new Error(response.error);
    if (!response.data?.success) throw new Error("Failed to fetch packages");
    return response.data.packages as CoursePackage[];
  },
};
