"use server";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import { exec } from "child_process";
import { ChevronDownSquareIcon } from "lucide-react";
import { format } from "@/utils/errorDisplayer";
import { Children } from "react";
import { Elsie_Swash_Caps } from "next/font/google";
interface Parms {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
// passing an object instead of a parameter is better !!
// improved readablity and maintainability
// avoiding argument order mistakes
// flexability and extensibility
// named argument
// destructing the object inside the function
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Parms): Promise<void> {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onBoarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      // allows you to revalidate data associated with a specific path.
      // useful when you want to update your cached data without waiting for a revalidation period  to expire
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Faild to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    //     .populate({
    //      path: 'communities',
    //      model: Community
    //   })
  } catch (error: any) {
    throw new Error(`Error from the fetchUser actioin ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch posts ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString,
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder;
}) {
  try {
    connectToDB();

    if (searchString.trim() === "") {
      // If searchString is empty, return an empty result.
      return { users: [], isNext: false };
    }

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = { id: { $ne: userId } };
    query.$or = [
      { username: { $regex: regex } },
      { name: { $regex: regex } },
    ];

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users ${error.message}`);
  }
}


export async function getActivity(userId: string) {
  try {
    connectToDB();
    // find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // collect all the child thread ids ( replies ) from the "children"
    const childThreadIds = userThreads.reduce((acc, userThreads) => {
      return acc.concat(userThreads.children); // Use optional chaining to safely access children
    }, []);

    format("from the actions " , childThreadIds);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activity ${error.message}`);
  }
}
