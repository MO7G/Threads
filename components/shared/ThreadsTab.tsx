import { redirect } from "next/navigation";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import ThreadCard from "../cards/ThreadCards";
import { ArrowUpAZ } from "lucide-react";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    } | null;
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface temp {
  name: string;
  age: string;
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  //let result: Result | undefined;
  let result: Result;
  try {
    result = await fetchUserPosts(accountId);
  } catch (error: any) {
    throw new Error("this is something bad for real ", error.message);
  }

  if (!result) {
    redirect("/");
  } else {
  }
  return (
    // [{},{},{}] is mapping over array of objects
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread) => (
        <div>
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: thread.author?.name,
                    image: thread.author?.image,
                    id: thread.author?.id,
                  }
            }
            community={
              accountType === "Community"
                ? { name: result.name, id: result.id, image: result.image }
                : thread.community
            }
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        </div>
      ))}
    </section>
  );
}

export default ThreadsTab;
