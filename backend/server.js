require("dotenv").config();

const express = require("express");
const notes = require("./data/notes");
const mongoose = require("mongoose");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

// connectDB();

//middleware
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/notes", noteRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(
      process.env.PORT,
      console.log("connected to db and listening on port", process.env.PORT)
    );
  })
  .catch((error) => {
    console.log(error);
  });
