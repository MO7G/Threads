"use server"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Parms{
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
export async function updateUser(
    { userId,
        username,
        name,
        bio,
        image,
        path,
    }: Parms ): Promise<void>{
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
    
    if (path === '/profile/edit') {
        // allows you to revalidate data associated with a specific path.
        // useful when you want to update your cached data without waiting for a revalidation period  to expire
        revalidatePath(path);
        } 
        
    } catch (error:any) {
        throw new Error(`Faild to create/update user: ${error.message}`)
    }
}


export async function fetchUser(userId: string) {
    try {
        connectToDB();
        return await User
            .findOne({ id: userId })
        //     .populate({
        //      path: 'communities',
        //      model: Community
        //   })
    } catch (error:any) {
        throw new Error(`Error from the fetchUser actioin ${error.message}`)

    }
}