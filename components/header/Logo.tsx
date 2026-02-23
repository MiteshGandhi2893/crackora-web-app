import Link from "next/link";
import Image from "next/image";
export function Logo() {
    return (
        <>
         <div className="flex items-center">
            <Link href={"/"}>
              <div className="flex items-center  ">
                <div className="relative w-10 h-10 flex justify-end">
                  <Image
                    src="/monogram.svg"
                    alt="Crackora logo"
                    fill
                    priority
                    className="object-contain object-left absolute left-0"
                  />
                </div>
                <div className="relative w-30 h-18 left-0 ">
                  <Image
                    src="/text-only.svg"
                    alt="Crackora logo"
                    fill
                    priority
                    className="object-cover object-left absolute left-0"
                  />
                </div>
              </div>
            </Link>
          </div>
        
        </>
    )
}