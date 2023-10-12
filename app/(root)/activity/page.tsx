import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profile } from "console";
import Image from "next/image";
import { profileTabs } from "@/constants";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import { PersonStanding } from "lucide-react";
import { format } from "@/utils/errorDisplayer";
import { Oranienbaum } from "next/font/google";
import Link from "next/link";

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onBoarded) {
        redirect("/onboarding");
    }

    // get Activity
    const activity = await getActivity(userInfo._id)
    format("from the activity ", activity);
    return (
        <section>
            <h1 className="head-text mb-10">Your Activities</h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    activity.map((act, index) => (
                        <Link key={act._id} href={`thread/${act.parentId}`}>
                        <article className="activity-card">
                        <Image
                            src={act.author.image}
                            alt="Profile Picture"
                            width={20}
                            height={20}
                            className="rounded-full object-cover"
                        />
                        <p className="!text-small-regular text-light-1">
                            <span className="mr-1 text-primary-500">
                                {act.author.name}
                            </span>
                            {" "}
                            replied to your thread
                        </p>
                        </article>
                    </Link>

                    ))
                ) : (
                    <p className="!text-base-regular text-light-3">No Activities Yet</p>
                )}
            </section>
        </section>
    );
}

export default Page;

