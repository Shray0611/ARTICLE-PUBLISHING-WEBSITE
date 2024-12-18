const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  photo: { type: Buffer, required: true }, // Binary data
  contentType: { type: String, required: true }, // MIME type (e.g., 'image/png')
});

module.exports = mongoose.model('Photo', photoSchema);
