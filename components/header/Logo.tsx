import Link from "next/link";
import Image from "next/image";
export function Logo() {
    return (
        <>
         <div className="flex items-center">
            <Link href={"/"}>
              <div className="flex  items-center justify-center">
                <div className="relative sm:w-10 sm:h-10 w-8 h-8  justify-end">
                  <Image
                    src="/monogram.svg"
                    alt="Crackora logo"
                    fill
                    priority
                  />
                </div>
                <div className="relative sm:w-38 sm:h-15 w-28 h-10">
                  <Image
                    src="/brand-name-slogan.svg"
                    alt="Crackora logo"
                    fill
                    priority
                    className="object-contain object-left absolute left-0
                    "
                  />
                </div>
              </div>
            </Link>
          </div>
        
        </>
    )
}