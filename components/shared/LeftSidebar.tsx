// this will declaretion that this is a client side component !!
"use client"

import { sidebarLinks } from "@/constants"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'
import { SignedIn, SignOutButton } from "@clerk/nextjs"
function LeftSidebar() {
    {/* useroute allow you to programmatically change the routes inside client components */ }
     {/*usepathname a Client Component hook that lets you read the current URL's pathname  */}
    const router = useRouter();
    const pathname = usePathname();
    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                    // checking if the link is active or not 
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname == link.route
                    
                     return (
                        <Link
                             href={link.route}
                             key={link.label}
                             className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
                        >
                        <Image
                            src={link.imgURL}
                            alt={link.label}
                            width={24}
                            height={24}
                        />
                        <p className="text-light-1 max-lg:hidden">{link.label}</p>
                    </Link>
                    )}
                )}
            </div>
            <div className="mt-10 px-6">
                <SignedIn>
                     {/* the signOutCallback is callback function that will take the user to the sigin page when he logs out  */}
                        <SignOutButton signOutCallback={()=> router.push('/sign-in')}>
                            <div className="flex cursor-pointer gap-4 p-4">
                                <Image
                                    src="/assets/logout.svg"
                                    alt="logout"
                                    width={24}
                                    height={24}
                            />
                            <p className="text-light-2">Logout</p>
                            </div>
                        </SignOutButton>
                </SignedIn>
                
            </div>
        </section>
    )
}


export default LeftSidebar