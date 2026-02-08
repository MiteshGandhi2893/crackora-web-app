/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { coursesService } from "../../services/courses.service";
import { Entrance } from "../../interfaces/entrance-interface";
import { useNavigate } from "react-router-dom";

export function MegaCourseMenu(props: any) {
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntrance, setSelectedEntrance] = useState<Entrance>();
  const { onClose } = props;
  const navigate = useNavigate();
  console.log(error)

  
  const handleSelectedEntrance = (entrance: Entrance) => {
    setEntrances((prevEntrances) =>
      prevEntrances.map((item) => ({
        ...item,
        isActive: item.title === entrance.title,
      }))
    );
    setSelectedEntrance({ ...entrance, isActive: true });
  };

  useEffect(() => {
    const fetchEntrances = async () => {
      try {
        const entrances: Entrance[] = await coursesService.getCoursesByExam();
        if (Array.isArray(entrances)) {
          setEntrances(entrances);
          handleSelectedEntrance(entrances[0]);
        }
      } catch (err: any) {
        setError(err.message);
        console.log(err);
      }
    };
    fetchEntrances();
  }, []);

  // --- Group exams by category ---
  const groupExamsByCategory = (exams: any[]) => {
    const grouped: Record<string, any[]> = {};
    exams.forEach((exam) => {
      if (exam.category) {
        if (!grouped[exam.category]) grouped[exam.category] = [];
        grouped[exam.category].push(exam);
      } else {
        grouped[exam.title] = [exam]; // treat as individual card
      }
    });
    return grouped;
  };

  return (
    <div className="w-full h-full max-h-full flex">
      {/* Sidebar */}
      <div className="w-[35%] border-r-4 border-r-cyan-900">
        <ul>
          {entrances.map((entrance, index) => (
            <li
              onClick={() => handleSelectedEntrance(entrance)}
              key={index}
              className={`text-cyan-900 
                ${entrance.isActive ? "bg-cyan-900 text-white font-semibold" : "bg-white"}
                flex justify-between 
                cursor-pointer border-b-1
                 border-b-gray-100 py-5
                  px-5 hover:bg-cyan-900 hover:text-white`}
            >
              {entrance.title} <BiChevronRight className="w-6 h-6" />
            </li>
          ))}
        </ul>
      </div>

      {/* Exams area */}
      <div className="bg-cyan-900 w-full p-4 flex flex-col overflow-auto relative">
        {/* Close button */}
        <div
          className="flex absolute w-full justify-end pr-5 font-semibold text-xl text-white cursor-pointer right-1 top-3
           hover:text-white"
          onClick={onClose}
        >
          X
        </div>

        {/* Cards */}
        {selectedEntrance && (
          <div className="mt-8 w-full h-full bg-cyan-900 p-5">
            {Object.values(groupExamsByCategory(selectedEntrance.exams))[0][0]
              .category ? (
              // --- CASE 1: Grouped exams (show two-column layout) ---
              <div className="grid grid-cols-1 gap-10 ">
                {Object.entries(
                  groupExamsByCategory(selectedEntrance.exams)
                ).map(([category, exams], idx) => (
                  <div
                    key={idx}
                    className=" rounded-xl border-gray-200 p-4 flex flex-col hover:scale-105  cursor-pointer bg-white"
                  >
                    {/* Category title */}
                    <div className="font-semibold text-lg mb-2 text-left border-b border-b-gray-200 pb-2 flex gap-2 items-center">
                      {!category.toUpperCase().startsWith("NON") && (
                        <img
                          src="/assets/exams/nim.jpg"
                          alt={category}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span>{category}</span>{" "}
                    </div>

                    {/* Left column → only description */}
                    {idx === 0 ? (
                      <p className="text-sm text-gray-600">
                        {exams[0].description ||
                          "This is a top category exam with multiple courses available."}
                      </p>
                    ) : (
                      // Right column → stacked exams
                      <div className="flex flex-wrap w-full">
                        {exams.map((exam, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded px-2 py-1 cursor-pointer"
                            onClick={() => {
                              onClose();
                              navigate("/course-package");
                            }}
                          >
                            <img
                              src="/assets/exams/nim.jpg"
                              alt=""
                              className="w-10 h-10 object-cover rounded"
                            />

                            <div className="flex flex-col">
                              <span className="text-sm text-cyan-900">
                                {exam.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // --- CASE 2: No categories (show as 50% width row-wrapped cards) ---
              <div className="flex flex-wrap gap-4">
                {selectedEntrance.exams.map((exam, idx) => (
                  <div
                    key={idx}
                    className="w-[48%] bg-white text-cyan-900 rounded-xl shadow-md border border-gray-200 hover:scale-105 cursor-pointer flex flex-col p-4"
                    onClick={() => {
                      onClose();
                      navigate("/course-package");
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src="/assets/exams/nim.jpg"
                        alt=""
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-sm font-medium">{exam.title}</span>
                    </div>
                    <p className="text-xs mt-2 text-gray-600">
                      {exam.description ||
                        "This is government exam. We provide 8+ courses"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
