const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("./db/config"); // Ensure this file sets up the database connection
const Article = require("./db/Article"); // Ensure this path is correct
const Photo = require("./db/Photos");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

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
    const { title, author, content, council, section, designer, coverphoto } = req.body;

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});