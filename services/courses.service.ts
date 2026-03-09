import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { Entrance } from "../interfaces/entrance-interface";
import { apiService } from "./api.service";

export const packageService = {
  getCoursesByExam: async () => {
    const response = await apiService.get("/coursesByExams");
    if (!response.success) throw new Error(response.error);
    return response.data as Entrance[];
  },
  getPackages: async () => {
    const response = await apiService.get("/course-packages");
    if (!response.success) throw new Error(response.error);
    if (!response.data?.success) throw new Error("Failed to fetch packages");
    return response.data.packages as CoursePackage[];
  },
  getPackageBySlug: async(slug: string) => {
    const response = await apiService.get(`/course-packages/view/${slug}`);
     if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      package: response.data,
      status: response.status,
    };
  }
};
