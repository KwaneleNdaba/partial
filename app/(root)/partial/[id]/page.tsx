import PartialCard from "@/components/cards/PartialCard";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchPartialById, fetchPartials } from "@/lib/actions/partial.actions";
import Comment from "@/components/forms/Comment";
export default async function Page({ params }: { params: { id: string } }) {
  
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user?.id);

  if (!userInfo?.onboarded) redirect("/onbording");

  const partial = await fetchPartialById(params.id);

  

  return (
    <section className="relative ">
      <div>
        <PartialCard
          key={partial._id}
          id={partial._id}
          currentUserId={user?.id}
          parentid={partial.parentId}
          content={partial.text}
          community={partial.community}
          author={partial.author}
          createdAt={partial.createdAt}
          comments={partial.comments}
        />
      </div>
      <div className="mt-7 ">
        <Comment
          partialId={partial.id}
          currentUserImage={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {partial.children.map((partial:any) => (
          <PartialCard
          
          key={partial._id}
          id={partial._id}
          currentUserId={user?.id}
          parentid={partial.parentId}
          content={partial.text}
          community={partial.community}
          author={partial.author}
          createdAt={partial.createdAt}
          comments={partial.comments}
          isComment
          />
        ))}
      </div>
    </section>
  );
}
