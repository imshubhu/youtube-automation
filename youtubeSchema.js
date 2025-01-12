const { default: mongoose } = require("mongoose");

 // Define a schema
 const youtubeSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
  });

  // Create a model
const Youtube = mongoose.model('Youtube', youtubeSchema);

module.exports = Youtube;