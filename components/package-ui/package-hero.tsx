// "use client"
// import { CoursePackage } from "@/interfaces/CoursePackage.interface";

// export function PackageHero({
//   coursePackage,
// }: {
//   coursePackage: CoursePackage;
// }) {
//   return (
//     <section className="relative w-full mt-16 text-white overflow-hidden">

//       {/* ================= BACKGROUND LAYER ================= */}
//       <div className="absolute inset-0 z-0">
//         {/* Deep space base */}
//         <div className="absolute inset-0 bg-[#020617]" />

//         {/* Cyan nebula */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,.5),transparent_60%)]" />

//         {/* Green nebula */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_460%)]" />

//         {/* Soft diffusion */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_120%)]" />

//         {/* Star texture */}
//         <div
//           className="absolute inset-0 opacity-[0.15]
//           bg-[radial-gradient(circle_at_10px_1px,rgba(255,255,255,.8)_1px,transparent_0)]
//           bg-size-[30px_30px]"
//         />
//       </div>

//       {/* ================= CONTENT LAYER ================= */}
//       <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

//         {/* ================= LEFT SIDE ================= */}
//         <div>
//           {/* Badge */}
//           <span className="inline-block bg-amber-600/80 text-white border border-cyan-500/40 px-4 py-2 rounded-r-full sm:text-md text-sm font-medium">
//             {coursePackage.entrance_name}
//           </span>

//           {/* Title */}
//           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 leading-tight">
//             {coursePackage.course_name}
//           </h1>

//           {/* Description */}
//           <p className="mt-6 text-gray-300 text-base md:text-lg max-w-xl">
//             Structured preparation, expert guidance and exam-focused strategy
//             designed to help you crack the exam confidently.
//           </p>

//           {/* Trust Points */}
//           <div className="mt-8 flex flex-wrap gap-5 text-sm text-gray-400">
//             <span>✔ Instant Access</span>
//             <span>✔ Valid till {coursePackage.expiry_date}</span>
//             <span>✔ Updated for 2026</span>
//           </div>
//         </div>

//        {/* ================= RIGHT SIDE (PREMIUM FLOATING CARD) ================= */}
// <div className="relative">
//   <div className="lg:sticky lg:top-28 flex justify-center lg:justify-end">

//     <div className="group relative w-full max-w-sm">

//       {/* Gradient Border Layer */}
//       <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-cyan-500/40 via-blue-500/30 to-green-500/30 opacity-60 blur-sm group-hover:opacity-80 transition" />

//       {/* Card */}
//       <div
//         className="
//           relative
//           rounded-2xlx
//           bg-white/5
//           backdrop-blur-xl
//           border border-white/10
//           p-6
//           shadow-[0_25px_70px_rgba(0,0,0,0.7)]
//           transition-all duration-300
//           group-hover:-translate-y-1
//         "
//       >

//         {/* Top Row */}
//         <div className="flex items-center justify-between mb-4">
//           <span className="text-xs uppercase tracking-wider text-cyan-400">
//             Limited Offer
//           </span>

//           <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
//             {coursePackage.discount_percentage}% OFF
//           </span>
//         </div>

//         {/* Price */}
//         <div className="mb-5">
//           <div className="flex items-end gap-3">
//             <span className="text-3xl font-semibold text-white">
//               ₹{coursePackage.discounted_price}
//             </span>
//             <span className="line-through text-gray-400 text-sm">
//               ₹{coursePackage.price}
//             </span>
//           </div>
//           <p className="text-xs text-gray-400 mt-1">
//             One-time payment • Instant access
//           </p>
//         </div>

//         <div className="h-px bg-white/10 my-5" />

//         {/* Features */}
//         <div className="space-y-2 text-sm text-gray-300 mb-6">
//           <div>✔ Full syllabus coverage</div>
//           <div>✔ Valid till {coursePackage.expiry_date}</div>
//           <div>✔ Updated for 2026</div>
//         </div>

//         {/* CTA */}
//         <a
//           href={coursePackage.checkout_link}
//           className="
//             block
//             w-full
//             text-center
//             bg-amber-600
//             transition
//             hover:scale-105
//             py-3.5
//             rounded-xl
//             font-medium
//             text-white
//             shadow-lg
//           "
//         >
//           Enroll Now
//         </a>

//       </div>
//     </div>

//   </div>
// </div>
//       </div>
//     </section>
//   );
// }