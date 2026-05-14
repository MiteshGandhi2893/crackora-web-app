import { API_BASE_URL } from "@/services/api.service";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
   rules :[ 
    {
        userAgent: "*",
        allow:"/",
        disallow: ["/contact/", "/api/", "/dashboard/" ]
    },
     {
        userAgent: "Googlebot",
        allow:"/",
        disallow: ["/terms-and-conditions" ]
    }],
    sitemap:`${API_BASE_URL}/sitemap.xml`
  };
}
