import Link from "next/link"
import Image from "next/image"
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs"
import { dark } from '@clerk/themes'
function Topbar() {
    return (
        <nav className="topbar">
            <Link href="/" className="flex items-center gap-4">
                <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
            </Link>

            
            <div className="flex items-center gap-1">
                <div className="block md:hidden">
     {/*This is a clerk protery that will tell if the user is logged or not basically !! */}
                    <SignedIn>
                     {/*This is a clerk protery that will will sigin out the user !! */}
                        <SignOutButton>
                            <div className="flex cursor-pointer">
                                <Image
                                    src="/assets/logout.svg"
                                    alt="logout"
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
                {/*used to enable the ability to switch between available organizations the user may be part of in your application*/}
                <OrganizationSwitcher
                    appearance={{
                        baseTheme:dark,
                        elements: {
                        organizationSwitcherTrigger:"py-2 px-4"
                    }
                    }}
                />
            </div>
        </nav>
    )
}


export default Topbar