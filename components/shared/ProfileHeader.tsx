import Image from "next/image";
import React from "react";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgurl: string;
  bio: string;
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgurl,
  bio,
}: Props) {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative  h-20 w-20 object-cover">
            <Image
              fill
              src={imgurl}
              alt="profile image"
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>
        {/*ToDO: Community*/}
        <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-fullbg-dark-3 "/>
    </div>
  );
}

export default ProfileHeader;