import { fetchUserPosts } from "@/lib/actions/user.actions";
import React from "react";
import PartialCard from "../cards/PartialCard";
import { redirect } from "next/navigation";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function PartialsTab({ currentUserId, accountId, accountType }: Props) {
  let result: any;
  
  if(accountType === "Community"){
    result = await fetchCommunityPosts(accountId);
    
  }else{
    result = await fetchUserPosts(accountId)
  }
console.log("Results",result);
  if (!result) redirect("/");

  return (
    <section className="mt-9 flex-col pag-10">
      {result.partials.map((partial: any) => (
        <PartialCard
          key={partial._id}
          id={partial._id}
          currentUserId={currentUserId}
          parentId={partial.parentId}
          content={partial.text}
          community={partial.community}
          author={
            accountType == "User"
              ? { name: result.name, image: result.image, id: result.id }
              : { name: partial.author.name, image: partial.author.image, id: partial.author.id }
          }
          createdAt={partial.createdAt}
          comments={partial.comments}
        />
      ))}
    </section>
  );
}

export default PartialsTab;
