import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PartialsTab from "@/components/shared/PartialsTab";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  let member: any;
  console.log("Params-ID", params.id);

  if (!user) {
    return null;
  }

  const communityDetails = await fetchCommunityDetails(params.id);
    member = communityDetails.members;
  return (
    <section>
      <ProfileHeader
        accountId={communityDetails._id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgurl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="partials" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger className="tab" key={tab.label} value={tab.value}>
                <Image
                  className="object-contain"
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Partials" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityDetails?.partials?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="partials" className="w-full text-light-1">
            <PartialsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="mt-9 flex flex-col gap-1-">
            <section className = "mt-14 flex flex-col gap-9">

            {
              member.map((member:any) => (
                
            <UserCard
            key = {member.id}
            id = {member.id}    
            name = {member.name}
            username = {member.username}
            imageUrl = {member.image}
            personType = "User"
            
            />
              ))
            }

            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            <PartialsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
export default Page;
