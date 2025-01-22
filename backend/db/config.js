import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const dbURL = process.env.MONGO_URI;
mongoose.connect("mongodb+srv://2022brijeshsharma:U2FLQoRYfbUuC9M9@cluster0.3ly68.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));
