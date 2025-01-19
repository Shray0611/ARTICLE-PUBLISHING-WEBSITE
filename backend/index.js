import express from "express";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import multer from "multer";
import path from "path";
import cors from "cors";
import User from './models/User.js'
import './db/config.js'
import Article from "./models/Article.js"; 
import Photo from "./models/Photos.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve()

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

const jwtKey = process.env.JWTSECRET;
const PORT = process.env.PORT;

app.post('/register', async(req,res) => {
  const {name, authorName, email, password} = req.body
  try {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();

    delete result.password;
    jwt.sign({userId: user._id}, jwtKey, {expiresIn:'7d'},(err,token)=>{
      if(err){
        return res.status(400).json({error: `Something went wrong + ${err}`})
      }
      res.send({user, auth:token});
    });
    console.log(result);
  } catch (error) {
    return res.status(500).json({error: 'Internal Server Error'})
  }
})

app.post('/login', async(req,res) => {
  const {email,password} = req.body;
  try {
    if(email && password){
      let user = await User.findOne({email: email, password: password}).select('-password');
      if(user){
        jwt.sign({userId: user._id}, jwtKey, {expiresIn: '7d'}, (err,token) => {
          if(err) {
            return res.status(400).json({error: `Something went wrong: ${err}`})
          }
          res.send({user, auth:token});
        })
      }
    }
  } catch (error) {
    return res.status(500).json({error: `Internal Server Error: ${error}`})
  }
})

// app.put("/update-article/:id", async(req,res) => {
//   try {
//     const articleId = req.params.id;
//     const article = await Article.findByIdAndUpdate({
//       _id: articleId
//     },{
//       $set: req.body
//     })
//     res.send(article);
//   } catch (error) {
//     return res.status(500).json({error: `Internal Server Error: ${error}`})
//   }
// })

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});


app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newPhoto = new Photo({
      photo: req.file.buffer, // Store binary buffer directly
      contentType: req.file.mimetype, // Store MIME type
    });

    const savedPhoto = await newPhoto.save();
    console.log("uploaded");
    
    res.status(200).json({ _id: savedPhoto._id });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post("/articles", async (req, res) => {
  try {
    const { title, author, content, council, section, designer, coverphoto, userId} = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({ error: "Title, author, and content are required" });
    }

    const newArticle = new Article({
      title,
      author,
      content,
      council,
      section,
      designer,
      coverphoto,
      userId,
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error("Error saving article:", error);
    res.status(500).json({ message: "Failed to save article", error });
  }
});


app.get('/get-image/:id', async (req, res) => {
  try {
    const image = await Photo.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', image.contentType);
    res.send(image.photo); // Send raw binary data
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/articles", async (req, res) => {
  let result = await Article.find();
  res.send(result);
});

app.get("/article/:id", async (req,res) => {
  console.log(req.params.id);
  
  let result = await Article.findOne({_id: req.params.id});
  res.send(result);
})

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
  app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});