import Link from "next/link";
import {
  BiLogoInstagram,
  BiLogoTelegram,
  BiLogoWhatsapp,
  BiLogoYoutube,
} from "react-icons/bi";

export function Socials() {
  return (
    <>
      {/* ───────────────── SOCIAL PROOF ───────────────── */}
      <div className="flex flex-col items-center lg:items-start  w-full gap-1">
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
              lg:w-8 lg:h-8 w-7 h-7
           rounded-xl
          bg-red-600
          flex items-center justify-center
          shadow-lg shadow-red-500/20
        "
            >
              <BiLogoYoutube className="text-white lg:w-7 lg:h-7 w-5 h-5" />
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
          lg:w-8 lg:h-8 w-7 h-7 rounded-xl
          flex items-center justify-center
          shadow-lg shadow-pink-500/20
          bg-gradient-to-tr
          from-yellow-400
          via-pink-500
          to-purple-600
        "
            >
              <BiLogoInstagram className="text-white lg:w-7 lg:h-7 w-5 h-5" />
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
            href="https://whatsapp.com/channel/0029VbCTPAe9Bb61q5F63s21"
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
          lg:w-8 lg:h-8 w-7 h-7 rounded-xl
          bg-green-600
          flex items-center justify-center
          shadow-lg shadow-green-500/20
        "
            >
              <BiLogoWhatsapp className="text-white lg:w-7 lg:h-7 w-5 h-5" />
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
          lg:w-8 lg:h-8 w-7 h-7 rounded-xl
          bg-blue-500
          flex items-center justify-center
          shadow-lg shadow-green-500/20
        "
            >
              <BiLogoTelegram className="text-white lg:w-7 lg:h-7 w-5 h-5" />
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
        <div className="flex flex-wrap items-center justify-center lg:justify-start text-center lg:text-left ">
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
          <span className="text-sm text-green-800 font-medium">
            Free guidance • Real mentors • No fake promises
          </span>
        </div>
      </div>
    </>
  );
}
