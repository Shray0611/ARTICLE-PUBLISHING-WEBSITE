import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  photo: { type: Buffer, required: true }, // Binary data
  contentType: { type: String, required: true }, // MIME type (e.g., 'image/png')
});

const Photo = mongoose.model('Photo', photoSchema);
export default Photo;