import Image from "next/image";
export function HeroBanner() {
  return (
    <div className="relative w-full lg:min-h-150 min-h-200 overflow-hidden bg-cyan-950 lg:hero  bg-opacity-10">
      <div
        className="absolute inset-0 z-10   top-0 left-0  bg-[url(/hero-banner.jpg)] bg-cover
    bg-center
    bg-no-repeat r w-screen h-full opacity-40"
      ></div>
      <div className="absolute top-0 left-0 w-screen h-full bg-[rgba(0,0,0,0.2)] z-10"></div>

      <div className="absolute top-0 left-0  lg:py-20 py-10 pb-20 flex flex-col lg:flex-row items-center gap-14 z-10">
        {/* ================= LEFT CONTENT ================= */}
        <div className="lg:w-[60%] w-full text-white/90 z-10 flex flex-col justify-center  lg:px-30 md:px-15 px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight lg:text-left text-center">
            Prepare smarter.
            <br className="lg:block hidden" /> Crack exams with confidence.
          </h1>

          <p className="mt-6 text-white/75  lg:text-lg sm:text-lg text-md  lg:text-left text-center">
            Crackora is a focused preparation ecosystem built for Indian
            competitive exams — no noise, only outcomes.
          </p>

          <div className="lg:mt-8 mt-5 flex flex-wrap gap-4 lg:justify-start justify-center">
            <button className="bg-amber-600 cursor-pointer text-white px-3 py-3 lg:text-[15px] text-xs rounded-xl font-medium hover:scale-105 transition">
              Explore Exams
            </button>

            <button className="border border-white/40 cursor-pointer px-6 py-3  lg:text-[16px] text-xs  rounded-xl text-white hover:bg-amber-400/30 transition">
              Talk to Mentor
            </button>
          </div>
        </div>

        {/* ================= RIGHT ORBIT ================= */}
        <div className="lg:w-[45%]  w-full flex lg:justify-center items-center justify-center relative lg:mt-0 sm:mt-25 mt-20">
          {/* Soft radial glow */}

          <div className="absolute -top-10 left-20 sm:left-30  flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-sm drop-shadow-[0px_10px_8px_rgba(255,255,255,0.8)] ">
              NIMCET
            </span>
          </div>

          <div className="absolute lg:bottom-50 lg:-left-30 sm:bottom-25  -bottom-8 left-10 flex items-end rotate-0">
            <span className=" text-white sm:text-lg  text-xs drop-shadow-[0px_10px_8px_rgba(255,255,255,0.8)]">
              MH CET LAW
            </span>
          </div>

          <div className="absolute top-0 right-10 sm:right-30 flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-sm drop-shadow-[0px_10px_8px_rgba(255,255,255,0.9)]">
              CAT
            </span>
          </div>

          <div className="absolute sm:bottom-0 lg:right-8 lg:w-fit -bottom-10 right-20 flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-[13px] drop-shadow-[0px_10px_8px_rgba(255,255,255,0.9)]">
              MBA CET
            </span>
          </div>

          <div className="absolute lg:top-110 lg:left-50  sm:top-15 sm:left-20 top-3  left-6 flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-sm drop-shadow-[0px_10px_8px_rgba(255,255,255,0.9)]">
              CLAT{" "}
            </span>
          </div>

          <div className="absolute lg:top-10 lg:-left-20 sm:-top-20 sm:left-1/2  sm:flex hidden items-end rotate-0">
            <span className=" text-white sm:text-lg drop-shadow-[0px_10px_8px_rgba(255,255,255,0.9)]">
              MAH MCA CET{" "}
            </span>
          </div>

          <div className="absolute lg:bottom-10 lg:-left-12 sm:left-140 md:left-150 sm:flex hidden items-end">
            <span className=" text-white text-lg drop-shadow-[0px_10px_8px_rgba(255,255,255,0.9)]">
              IPMAT{" "}
            </span>
          </div>

          <div className="absolute lg:w-100 lg:h-100 w-60 h-60 rounded-full bg-gradient-to-tr from-white/10 to-white/0 blur-3xl" />

          {/* Orbit container */}
          <div className="relative lg:w-100 sm:w-70 sm:h-70 w-65 lg:h-100 h-65 flex items-center justify-center">
            {/* OUTER RING */}
            <div
              className="absolute lg:inset-0 -inset-3 rounded-full shadow shadow-white
              bg-[radial-gradient(circle,rgba(245,135,11,0.8),rgba(255,255,255,0.02))]
              border border-white/60"
            />

            {/* MIDDLE RING */}
            <div
              className="absolute lg:inset-20 inset-10   rounded-full shadow shadow-white
              bg-[radial-gradient(circle,rgba(245,255,255,0.8),rgba(255,255,255,0.01))]
              border border-white/50"
            />

            {/* INNER CORE */}
            <div className="relative flex items-center justify-center z-20">
              {/* Glow Ring */}
              <div
                className="
      absolute
      lg:w-30 lg:h-30
      w-30 h-30
      rounded-full
      border-10 border-amber-700/50
      blur-[5px]
      shadow-[0_20px_40px_rgba(255,158,11,0.1)]
    "
              />

              {/* Planet */}
              <div
                className="
      lg:w-28 lg:h-28
      w-20 h-20
      rounded-full
      bg-amber-200
      flex items-center justify-center
      relative
    "
              >
                <Image
                  src="/crackora-logo.svg"
                  alt="Crackora"
                  fill
                  className="w-full h-full  object-contain"
                />
              </div>
            </div>

            <div className="absolute lg:bottom-10 lg:left-60 right-20 bottom-4 -translate-x-1/2">
              <OrbitItem
                label="Live Classes"
                size="lg:w-20 lg:h-20 w-13 h-13"
                bg="text-[10px] bg-white text-cyan-900"
              />
            </div>
            <div className="absolute lg:top-30 lg:right-15 top-20 right-3">
              <OrbitItem
                label="Analytics"
                size="lg:w-20 lg:h-20 w-13 h-13"
                bg="text-[10px] bg-white text-cyan-900"
              />
            </div>

            <div className="absolute lg:top-30 lg:left-12 top-20 left-3">
              <OrbitItem
                label="Resources"
                size="lg:w-20 lg:h-20 w-14 h-14"
                bg="text-[10px] bg-white text-cyan-900"
              />
            </div>

            <div className="absolute lg:-left-5 sm:-left-8 -left-4 lg:bottom-5  bottom-0 -translate-y-1/2">
              <OrbitItem
                label="Doubt Solving"
                size="lg:w-22 lg:h-22 sm:w-18 sm:h-18 w-14 h-14"
                bg="bg-amber-600 border-1 border-white/80 lg:text-[13px] text-[9.5px]"
              />
            </div>

            <div className="absolute -top-10  left-1/2 -translate-x-1/2">
              <OrbitItem
                label="Courses"
                size="lg:w-22 lg:h-22 sm:w-18 sm:h-18 w-14 h-14"
                bg="bg-amber-600 border-1 border-white/80 lg:text-[13px] text-[9.5px]"
              />
            </div>

            <div className="absolute  lg:-right-10 sm:-right-11 lg:bottom-20 bottom-0 -right-5 -translate-y-1/2">
              <OrbitItem
                label="Mock Tests"
                size="lg:w-22 lg:h-22 sm:w-18 sm:h-18 w-14 h-14"
                bg="bg-amber-600 border-1 border-white/80 lg:text-[13px] text-[9.5px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ORBIT ITEM ---------- */
function OrbitItem({
  label,
  bg = "bg-white/90",
  size = "w-18 h-18",
}: {
  label: string;
  bg?: string;
  size?: string;
}) {
  return (
    <div
      className={`${bg || "bg-cyan-900/95 text-xs text-cyan-50"}  
      
      
      font-sans font-semibold
      
      px-4 py-1 rounded-full shadow-xl
      ${size} flex items-center justify-center text-center
      hover:scale-105 transition`}
    >
      {label}
    </div>
  );
}
