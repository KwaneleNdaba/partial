import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import Image from 'next/image'
import UserCard from '@/components/cards/UserCard'
import { fetchCommunities } from '@/lib/actions/community.actions'
import CommunityCard from '@/components/cards/CommunityCard'



async function Page() {

    const user = await currentUser()

  
    if(!user){
      return null
    }
  
    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded){
      redirect("/onboarding")
    }
    console.log("Length",userInfo)

    const results = await fetchCommunities({
        searchString : "",
        pageNumber :1,
        pageSize: 25 
    })
    console.log("users",results)

  return (
        <section >
        <h1 className = "head-text mb-10">
            Search
        </h1>

        <div className = "mt-14 flex flex-col gap-9">
            {results.communities.length == 0 ? (
                <p className='no-result'>no user</p>
            ) : (
                <>
                {results.communities.map((community:any) => (
                    <CommunityCard
                    key = {community.id}
                    id = {community.id}    
                    name = {community.name}
                    username = {community.username}
                    imgUrl = {community.image}
                    bio = {community.bio}
                    members = {community.members}
                    
                    />
                ))}
                </>
            )}

        </div>
        </section>
  )
}

export default Page
