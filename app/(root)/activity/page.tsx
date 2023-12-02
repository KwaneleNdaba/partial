import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser, fetchUsers, getActivity } from '@/lib/actions/user.actions'
import { fetchCommunityDetails } from '@/lib/actions/community.actions'
import Link from 'next/link'
import Image from 'next/image'



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

    const activity =  await getActivity(userInfo._id);

    return (
          <section >
          <h1 className = "head-text mb-10">
              Activity
          </h1>

          <section className = "mt-10 flex flex-col gap-5">
            {
                activity.length > 0 ? (
                    <>
                        {
                            activity.map((activity:any) => (
                                <Link href ={`/partial/${activity.parentId}`} key = {activity.id}>
                                    <article className = "activity-card">
                                        <Image 
                                        src = {activity.author.image} 
                                        alt = "activity" 
                                        width ={20}
                                        height = {20}
                                        className = "rounded-full object-cover"
                                        />
                                        <p className='!text-small-regular text-light-1'>
                                            <span className = "mr-1 text-primary-500">
                                                {activity.author.name}
                                            </span>
                                            replied to your partial 
                                        </p>
                                    </article>
                                
                                </Link>
                            ))
                        }
                    </>
                ): <p className='!text-base-regular text-light-3'>no activity yet</p>
            }

          </section>

          </section>
    )
  }
  
  export default Page
  