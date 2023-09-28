import mongoose from "mongoose";


let isConnected = false // varible to check if mongoose is connected 
export const connectToDB = async () => {
    // to prevent unknown field queries 
    mongoose.set('strictQuery', true);
    console.log("this is the env file aasdf asd " , process.env.MONGODB_URL)

    if (!process.env.MONGODB_URL)
        return console.log('MONGODB_URL  NOT FOUND');
    if (isConnected)
        return console.log("ALREADY CONNECTED TO MONGODB");

    // connecting to the database  
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Successful Connection hahah")
    } catch (error) {
        console.log("NOOO there is an error which is => ", error);
    }
}