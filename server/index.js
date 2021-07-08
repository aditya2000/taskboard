const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require('cors');

dotenv.config();

// Server setup
const app = express();
const PORT = process.env.PORT || 5000; // proess.env.PORT is for heroku deployment
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true, // allows browser to set cookies
}))

// Connect to DB
mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err) => {
    if(err) return console.error(err)
    console.log("Connected to MongoDB")
})

app.use("/auth", require("./routers/userRouter"))
app.use("/tasks", require("./routers/taskRouter"))