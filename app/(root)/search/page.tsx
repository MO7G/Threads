
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
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
import UserSearchBar from "@/components/searchBar/userSearchBar";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";
import { format } from "@/utils/errorDisplayer";

const page = async({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string  | undefined }
}) =>{
  const user = await currentUser();
  const searchValue = searchParams[''];
  const searchPerformed: boolean = !!searchParams[''] && searchParams[''].length > 0;


  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) {
    redirect("/onboarding");
  }

  //format("this is the search term " ,searchValue)
  // Fetch users
  
  const result = await fetchUsers({
    userId: user.id,
    searchString: searchValue || "" ,
    pageNumber: 1,
    pageSize: 25,
    sortBy: "desc",
  });



  return (
    <section>
      <h1 className="head-text mb-10">search</h1>
      <UserSearchBar/> 
      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">{!searchPerformed ? "Search for users" : "Not Found"}</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default page;
