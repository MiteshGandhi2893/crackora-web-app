/* eslint-disable @typescript-eslint/no-explicit-any */

import { TestimonialListResponse } from "@/interfaces/testimonial.interface";
import { apiService, unwrap } from "./api.service";

export const testimonialService = {
  getTestimonials: async () => {
    const testimonials = await unwrap<TestimonialListResponse>(
      apiService.get("/testimonials"),
    );
    return testimonials;
  }
};
