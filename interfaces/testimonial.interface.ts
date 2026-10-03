// As provided — kept verbatim. NOTE: `display_order` is typed as `boolean`
// here, but a "display order" field is almost always a numeric sort index
// (0, 1, 2 …) rather than a true/false flag. It's implemented as given below
// (a checkbox), but double check this isn't meant to be `number`.
export interface Testimonial {
  id: string;
  fullname: string;
  designation: string;
  achievement: string;
  category_label: string;
  location: string;
  message: string;
  rating: number;
  entrance_id: string;
  exam_id: string;
  course_package_id: string;
  category: string;
  photo_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: boolean;
}



export interface GetTestimonialsParams {
  page?: number;
  limit?: number;
  category?: string;
  is_active?: boolean;
  is_featured?: boolean;
}



export interface TestimonialListResponse {
  success: boolean;
  data: Testimonial[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TestimonialResponse {
  success: boolean;
  data: Testimonial;
}