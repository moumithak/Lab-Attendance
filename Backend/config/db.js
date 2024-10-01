const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://moumi17:km123@SystemLab.nuu2n.mongodb.net/SystemLab?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error: ", err));

// Your models and server code go here
