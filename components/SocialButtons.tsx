import Link from "next/link";
import { BiLogoInstagram, BiLogoTelegram, BiLogoWhatsapp, BiLogoYoutube } from "react-icons/bi";

export function Socials() {
  return (
    <>
      {/* ───────────────── SOCIAL PROOF ───────────────── */}
      <div className="flex flex-col items-center lg:items-start  w-full">
        {/* Social Buttons */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
          {/* YouTube */}
          <Link
            href="https://www.youtube.com/@CrackoraMCAEntranceHub"
            target="_blank"
            rel="noopener noreferrer"
            className="
        group flex items-center
        backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.03]
      "
          >
            <div
              className="
          w-8 h-8 rounded-xl
          bg-red-600
          flex items-center justify-center
          shadow-lg shadow-red-500/20
        "
            >
              <BiLogoYoutube size={24} className="text-white" />
            </div>

            {/* <div className="text-left">
              <p className="text-white text-sm font-semibold leading-none">
                YouTube
              </p>

              <p className="text-red-100/80 text-xs mt-1">
                Free strategy & PYQs
              </p>
            </div> */}
          </Link>

          {/* Instagram */}
          <Link
            href="https://www.instagram.com/crackora.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="
        group flex items-center
            backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.03]
      "
          >
            <div
              className="
          w-8 h-8 rounded-xl
          flex items-center justify-center
          shadow-lg shadow-pink-500/20
          bg-gradient-to-tr
          from-yellow-400
          via-pink-500
          to-purple-600
        "
            >
              <BiLogoInstagram size={24} className="text-white" />
            </div>

            {/* <div className="text-left">
              <p className="text-white text-sm font-semibold leading-none">
                Instagram
              </p>

              <p className="text-pink-100/80 text-xs mt-1">Reels & exam tips</p>
            </div> */}
          </Link>

          {/* WhatsApp */}
          <Link
            href="https://wa.me/917738831585"
            target="_blank"
            rel="noopener noreferrer"
            className="
        group flex items-center
     
        backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.03]
      "
          >
            <div
              className="
          w-8 h-8 rounded-xl
          bg-green-600
          flex items-center justify-center
          shadow-lg shadow-green-500/20
        "
            >
              <BiLogoWhatsapp size={24} className="text-white" />
            </div>

            {/* <div className="text-left">
              <p className="text-white text-sm font-semibold leading-none">
                WhatsApp
              </p>

              <p className="text-green-100/80 text-xs mt-1">
                Quick counselling help
              </p>
            </div> */}
          </Link>

            {/* telegram */}
          <Link
            href="https://web.telegram.org/a/#-1003741811541"
            target="_blank"
            rel="noopener noreferrer"
            className="
        group flex items-center gap-3
        backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.03]
      "
          >
            <div
              className="
          w-8 h-8 rounded-xl
          bg-blue-500
          flex items-center justify-center
          shadow-lg shadow-green-500/20
        "
            >
              <BiLogoTelegram  size={24} className="text-white" />
            </div>

            {/* <div className="text-left">
              <p className="text-white text-sm font-semibold leading-none">
                WhatsApp
              </p>

              <p className="text-green-100/80 text-xs mt-1">
                Quick counselling help
              </p>
            </div> */}
          </Link>
        </div>

        {/* Trust Line */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-center lg:text-left">
          {/* <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="
              w-7 h-7 rounded-full
              border-2 border-[#020617]
              bg-gradient-to-br
              from-amber-400
              to-amber-600
            "
                />
              ))}
            </div>

            <span className="text-sm text-white/75">
              Trusted by MCA aspirants across India
            </span>
          </div> */}

          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />

          <span className="text-sm text-emerald-300 font-medium">
            Free guidance • Real mentors • No fake promises
          </span>
        </div>
      </div>
    </>
  );
}
