"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Partial from "../models/partial.model";
import Community from "../models/community.model";

export async function fetchPartials(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level Partials) (a Partial that is not a comment/reply).
  const postsQuery = Partial.find({ parentId: { $in: [null, undefined] } })//fetching the posts not comments
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field or comments
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (Partials) i.e., Partials that are not comments.
  const totalPostsCount = await Partial.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createPartial({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdPartial = await Partial.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { Partials: createdPartial._id },//pushing the partial to the user created it
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { Partials: createdPartial._id },
      });
    }

    revalidatePath(path);//makes sure that the changes happens immediately
  } catch (error: any) {
    throw new Error(`Failed to create Partial: ${error.message}`);
  }
}

async function fetchAllChildPartials(PartialId: string): Promise<any[]> {
  const childPartials = await Partial.find({ parentId: PartialId });

  const descendantPartials = [];
  for (const childPartial of childPartials) {
    const descendants = await fetchAllChildPartials(childPartial._id);
    descendantPartials.push(childPartial, ...descendants);
  }

  return descendantPartials;
}

export async function deletePartial(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the Partial to be deleted (the main Partial)
    const mainPartial = await Partial.findById(id).populate("author community");

    if (!mainPartial) {
      throw new Error("Partial not found");
    }

    // Fetch all child Partials and their descendants recursively
    const descendantPartials = await fetchAllChildPartials(id);

    // Get all descendant Partial IDs including the main Partial ID and child Partial IDs
    const descendantPartialIds = [
      id,
      ...descendantPartials.map((Partial) => Partial._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantPartials.map((Partial) => Partial.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPartial.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantPartials.map((Partial) => Partial.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPartial.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child Partials and their descendants
    await Partial.deleteMany({ _id: { $in: descendantPartialIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { Partials: { $in: descendantPartialIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { Partials: { $in: descendantPartialIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete Partial: ${error.message}`);
  }
}

export async function fetchPartialById(PartialId: string) {
  connectToDB();

  try {
    const partial = await Partial.findById(PartialId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Partial, // The model of the nested children (assuming it's the same "Partial" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return partial;
  } catch (err) {
    console.error("Error while fetching Partial:", err);
    throw new Error("Unable to fetch Partial");
  }
}

export async function addCommentToPartial(
  PartialId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original Partial by its ID
    const originalPartial = await Partial.findById(PartialId);

    if (!originalPartial) {
      throw new Error("Partial not found");
    }

    // Create the new comment Partial
    const commentPartial = new Partial({
      text: commentText,
      author: userId,
      parentId: PartialId, // Set the parentId to the original Partial's ID
    });

    // Save the comment Partial to the database
    const savedCommentPartial = await commentPartial.save();

    // Add the comment Partial's ID to the original Partial's children array
    originalPartial.children.push(savedCommentPartial._id);

    // Save the updated original Partial to the database
    await originalPartial.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
