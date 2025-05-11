import mongoose from 'mongoose';

const connectDB = async()=>{
    // Check if the connection is already established
    // If it is, return to avoid creating a new connection
    if(mongoose.connections[0].readyState) return;

    try {
        // If not, create a new connection
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB connected');
        
    } catch (error) {
        // Handle any errors that occur during the connection process
        console.log(error);
        throw new Error('Error connecting to the database');
    }
}