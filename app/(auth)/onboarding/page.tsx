import AccountPorfile from "@/components/forms/AccountProfile"
import { currentUser } from "@clerk/nextjs"
import { userInfo } from "os";

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userData = {
        id: user?.id,
        objectId: user?._id,
        username: user?.username || user?.username,
        name: user?.name || user?.firstName || "",
        bio: user?.bio || "",
        image: user?.image || user.profileImageUrl
    }

    return (
        <main className="ma-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">onBoarding</h1>
            <p className="mt-3 text-base-regular text-light-2">complete your profile now to use threads</p>

            <section className="mt-10 bg-dark-2 p-10">
                <AccountPorfile user={userData}/>
            </section>
        </main>
    )
}


export default Page