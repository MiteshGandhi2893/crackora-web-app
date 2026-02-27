import Link from "next/link";
import Image from "next/image";
export function Logo() {
    return (
        <>
         <div className="flex items-center">
            <Link href={"/"}>
              <div className="flex  items-center justify-center">
                <div className="relative w-10 h-10  justify-end">
                  <Image
                    src="/monogram.svg"
                    alt="Crackora logo"
                    fill
                    priority
                  />
                </div>
                <div className="relative sm:w-38 sm:h-15 w-35 h-15">
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