const express = require("express");
const app = express();
const mongooes = require("mongoose");
const cors = require("cors");
const userRouter = require("./userRouter");
mongooes.set("strictQuery", true);
mongooes.connect(
  "mongodb+srv://gandhitamilarasan:9585157515@cluster0.hfw02eq.mongodb.net",
  () => {
    console.log("server connect successfully");

    app.use(express.json());
    app.use(cors());

    app.use("/api", userRouter);

    app.listen(8080, () => {
      console.log("locall host connected successfully");
    });
  }
);

// mongooes.set('strictQuery', true);
// mongooes.connect('mongodb+srv://tamil:9585157515@cluster0.ypnxadj.mongodb.net/?retryWrites=true&w=majority',()=>{
//     console.log("server connect successfully")
// })
