import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import Image from 'next/image'
import UserCard from '@/components/cards/UserCard'



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

    const results = await fetchUsers({
        userId: user.id,
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
            {results.users.length == 0 ? (
                <p className='no-result'>no user</p>
            ) : (
                <>
                {results.users.map((person:any) => (
                    <UserCard
                    key = {person.id}
                    id = {person.id}    
                    name = {person.name}
                    username = {person.username}
                    imageUrl = {person.image}
                    personType = "User"
                    
                    />
                ))}
                </>
            )}

        </div>
        </section>
  )
}

export default Page
