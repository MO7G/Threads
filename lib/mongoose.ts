import mongoose from "mongoose";

let isConnected = false // varible to check if mongoose is connected 
export const connectToDB = async () => {
    // to prevent unknown field queries 
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL)
        return console.log('MONGODB_URL  NOT FOUND');
    if (isConnected)
        return console.log("ALREADY CONNECTED TO MONGODB");

    
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Successful Connection to Mongose")
    } catch (error:any) {
        throw new Error("Connection to Mongose Failed ", error);
    }
}
