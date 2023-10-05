import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false // varible to check if mongoose is connected 
export const connectToDB = async () => {
    // to prevent unknown field queries 
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL)
        return console.log('MONGODB_URL  NOT FOUND');
    if (isConnected)
        return console.log("ALREADY CONNECTED TO MONGODB");

    
    
   await mongoose
      .connect(process.env.MONGODB_URL!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
      .then((res) => {
        console.log(
          'Connected to Distribution API Database - Initial Connection'
        );
      })
      .catch((err) => {
        console.log(
          `Initial Distribution API Database connection error occured -`,
          err
        );
      });
}

