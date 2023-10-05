"use server"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { revalidatePath } from "next/cache";
import { ThermometerSnowflake } from "lucide-react";
import { skip } from "node:test";
import { connect } from "http2";
import { error } from "console";

interface Parms{
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}
export async function createThread({ text, author, communityId, path }: Parms) {
    try {
        connectToDB();
    const createdThread = await Thread.create({
        text,
        author,
        community: null,
    })
    // updating the user model 
    await User.findByIdAndUpdate(author, { $push: { threads: createdThread._id } })
    revalidatePath(path);
    } catch (error:any) {
    throw new Error(`Faild to create a  thread: ${error.message}`)

    }
  
    
}


export async function fetchPosts (pageNumbre = 1 , pageSize = 50){
    try {
       connectToDB();
        //Calculate the number of posts to skip so we can implement the pagination
        const skipAmount = (pageNumbre - 1) * pageSize;
        // fetch the posts that have no parents (top-level threads)
        // threads with no paretn means they are not a comment!!
        const postsQuery =  Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path : 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            })
        
        const posts = await postsQuery.exec();
        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
       
        
        const isNext = totalPostsCount > skipAmount + posts.length;
        return {posts,isNext}
    } catch (error:any) {
    throw new Error(`Faild to fetch Threads posts : ${error.message}`)
    }
  
    
}

export async function fetchThreadById(id: string) {
    connectToDB();
    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: {
                            path: "author",
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();
        
        return thread;
    } catch (error : any) {
        throw new Error(`problem with fetching a specefic thread ${error}`)
    }
}


interface addCommentToThreadParms{
    threadId: string,
    commentText: string,
    userId: string | null,
    path: string,
}
export async function addCommentToThread({ threadId, commentText, userId, path }: addCommentToThreadParms) {
    try {
        connectToDB();
        // Find the original thread by its id
        const originalThread = await Thread.findById(threadId)
        if (!originalThread) {
            throw new Error("Thread was not found");
        }

        // Create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId:threadId,
        })


        // Save the new thread
        const savedCommentThread = await commentThread.save();

        //Update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id);
        
        // save the original thread
        await originalThread.save();


        revalidatePath(path);

    } catch (error:any) {
    return { success: false, message: `Problem with adding a thread comment: ${error.message}` };

    }
}