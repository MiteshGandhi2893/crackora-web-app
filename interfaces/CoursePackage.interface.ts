export interface CoursePackage {
    id: string;
    entrance_id: string;
    course_name: string;
    description: string;
    content: string;
    image: string;
    features?: string;
    facility: string;
    teacher?: string;
    price: number;
    discounted_price: number;
    discount_percentage: number;
    duration?: number;
    expiry_date: string;
    entrance_name: string;
    checkout_link: string;
    is_active?: boolean;
    in_top?: boolean;
    hero_content?: string;
    faq?: object;

}