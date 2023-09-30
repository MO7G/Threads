import ThreadCard from "@/components/cards/ThreadCards";
import { fetchPosts } from "@/lib/actions/thread.actions";
import Thread from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import "../../lib/intialize";

export default async function Home() {
  const user = await currentUser();
  const result = await fetchPosts();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-results">No threads Found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId} // this should be null in general
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
