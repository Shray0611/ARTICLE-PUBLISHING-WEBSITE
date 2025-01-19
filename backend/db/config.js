import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const dbURL = process.env.MONGO_URI;

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));