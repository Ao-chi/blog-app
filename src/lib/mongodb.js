import mongoose from "mongoose";

// const connectDB = async () => {
//     if (!process.env.MONGO_URI) {
//         throw new Error("Please add your MongoDB connection string to .env.local");
//     }
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI, {});
//         console.log(`MongoDB connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`Error connecting to MongoDB: ${error.message}`);
//     }
// };

// export default connectDB;

// import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Please add your MongoDB connection string to .env.local");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });
        console.log(`MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit with failure status code
    }
};

export default connectDB;
