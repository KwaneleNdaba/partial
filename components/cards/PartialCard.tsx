import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDateString } from "@/lib/utils";
interface Props {
  id: string;
  currentUserId?: string;
  parentid: string | null;
  content: string;
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  author: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];

  isComment?: boolean;
}
function PartialCard({
  id,
  currentUserId,
  parentid,
  content,
  community,
  author,
  createdAt,
  comments,
  isComment,
}: Props) {
  console.log("Community", community);


  

  return (
    <article
      className={`flex w-full flex-col rounded- ${
        isComment ? "px-0 xs:px-7 mt-2" : "bg-dark-2 p-7 "
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="profile-image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="partial-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="text-base-semibold text-light-1 cursor-pointer">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-1">{content}</p>
            <div
              className={`${isComment && `mb-10`}  mt-5 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5 ">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />

                <Link href={`/partial/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {isComment && comments?.length > 0 && (
                <Link href={`partial/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} - {community.name} Community
          </p>

          <Image
            src={community.image}
            alt={community.name}
            height={14}
            width={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
}

export default PartialCard;
