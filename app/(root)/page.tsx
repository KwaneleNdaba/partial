import PartialCard from "@/components/cards/PartialCard";
import { fetchPartials } from "@/lib/actions/partial.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";



export default async function Home() {
  
  const results = await fetchPartials();

  const user = await currentUser();

  console.log(results);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt=9 flex flex-col gap-10">
        {results.posts.length === 0 ? (
          <p className="no-result">No partials found</p>
        ) : (
          <>
            {results.posts.map((post) => (
              <PartialCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id}
                parentid={post.parentId}
                content={post.text}
                community={post.community}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.comments}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
