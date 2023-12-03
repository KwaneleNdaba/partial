import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { fetchUser } from '@/lib/actions/user.actions'
import Postpartial from '@/components/forms/Postpartial'
import ProfileHeader from '@/components/shared/ProfileHeader'
import { Tabs, TabsList , TabsTrigger, TabsContent} from '@/components/ui/tabs'
import { profileTabs } from '@/constants'
import Image from 'next/image'
import PartialsTab from '@/components/shared/PartialsTab'

async function Page({params}: {params:{id:string}}) {
  const user = await currentUser()
  console.log("Params-ID",params.id)

  if(!user){
    return null
  }

  const userInfo = await fetchUser(params.id)
  if(!userInfo?.onboarded){
    redirect("/onboarding")
  }
  console.log("Length",userInfo)
return (
    <section>
       <ProfileHeader
        accountId = {userInfo.id} 
       authUserId={user.id}
       name ={userInfo.name}
       username = {userInfo.username}
       imgurl = {userInfo.image} 
       bio = {userInfo.bio}/>

       <div className='mt-9'>
        <Tabs defaultValue = "partials" className = "w-full">
          <TabsList className = "tab">
           {profileTabs.map((tab) => (
            <TabsTrigger className = "tab" key = {tab.label} value = {tab.value}>
              <Image className='object-contain' src = {tab.icon} alt = {tab.label} width = {24} height={24}/>
              <p className = "max-sm:hidden">
              {tab.label}
              </p>
              {tab.label === "Partials" && <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
              {userInfo.partials.length}
              </p>}
            </TabsTrigger>
           ))}

           
          </TabsList> 
            {profileTabs.map((tab) => (
              <TabsContent key = {`content-${tab.label}`} value = {tab.value}
              className = "w-full text-light-1">
                <PartialsTab 
                currentUserId = {user.id}
                accountId = {userInfo.id}
                accountType = "User"
                />
              </TabsContent>
            ))}

       </Tabs>
        </div>
    </section>
)
}
export default Page
