"use server"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { revalidatePath } from "next/cache";

interface Parms{
    text: string,
    author: string,
    communityId: string | null,
    path:string
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