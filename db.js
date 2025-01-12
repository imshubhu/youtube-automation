const mongoose = require('mongoose');

// Connection URI
// yYUC5l9JDvqnZvTW
const uri = process.env.MONGODB_URL;

async function connectDB(){

    try {
        
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

    } catch (error) {
        console.log('db error', error)
    }

}

module.exports = connectDB