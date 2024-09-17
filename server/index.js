const express = require("express");
const cors = require("cors")
const mongoose = require('mongoose');
require("dotenv/config")

const app = express();
const authRouter  = require("./routes/auth");
const accountRouter = require("./routes/account");

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);


// Connect to MongoDB
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
};
connectToDB();

app.listen(8000, () => {
    console.log("Bank server running on port 8000");
});

