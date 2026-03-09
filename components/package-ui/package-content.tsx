// "use client"
// import { useState } from "react";

// interface Lesson {
//   title: string;
//   duration: string;
// }

// interface Module {
//   title: string;
//   lessons: Lesson[];
// }

// export function PackageContent({ modules }: { modules: Module[] }) {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);

//   return (
//     <section className="relative py-24 text-white">

//       <div className="max-w-5xl mx-auto px-6">

//         {/* ===== Header ===== */}
//         <div className="mb-16 text-center">
//           <h2 className="text-4xl md:text-5xl font-bold">
//             Course Curriculum
//           </h2>
//           <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
//             Structured modules designed for focused preparation and complete syllabus mastery.
//           </p>
//         </div>

//         {/* ===== Modules ===== */}
//         <div className="space-y-6">

//           {modules.map((module, index) => {
//             const isOpen = openIndex === index;

//             return (
//               <div
//                 key={index}
//                 className="
//                   group
//                   relative
//                   rounded-2xl
//                   bg-white/5
//                   backdrop-blur-xl
//                   border border-white/10
//                   transition-all
//                   duration-300
//                   hover:border-cyan-500/40
//                 "
//               >

//                 {/* Module Header */}
//                 <button
//                   onClick={() =>
//                     setOpenIndex(isOpen ? null : index)
//                   }
//                   className="w-full flex justify-between items-center p-6 text-left"
//                 >
//                   <div>
//                     <h3 className="text-lg font-semibold">
//                       {module.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 mt-1">
//                       {module.lessons.length} lessons
//                     </p>
//                   </div>

//                   <div
//                     className={`transition-transform duration-300 ${
//                       isOpen ? "rotate-180" : ""
//                     }`}
//                   >
//                     ▼
//                   </div>
//                 </button>

//                 {/* Lessons */}
//                 <div
//                   className={`overflow-hidden transition-all duration-300 ${
//                     isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//                   }`}
//                 >
//                   <div className="px-6 pb-6 space-y-3">
//                     {module.lessons.map((lesson, i) => (
//                       <div
//                         key={i}
//                         className="flex justify-between text-sm text-gray-300 bg-white/5 px-4 py-3 rounded-lg"
//                       >
//                         <span>{lesson.title}</span>
//                         <span className="text-gray-400">
//                           {lesson.duration}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             );
//           })}

//         </div>
//       </div>
//     </section>
//   );
// }