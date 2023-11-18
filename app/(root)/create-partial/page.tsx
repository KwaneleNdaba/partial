import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser } from '@/lib/actions/user.actions'
import Postpartial from '@/components/forms/Postpartial'

async function Page() {
  const user = await currentUser()

  if(!user){
    return null
  }

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded){
    redirect("/onboarding")
  }
  return (
   <>
    <h1 className='head-text'>Create Partial</h1>
    <Postpartial userId={userInfo._id}/>
   </>
  )
}

export default Page
