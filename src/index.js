//externel imports
import dotenv from "dotenv";

//internal imports
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env"
});

//database connection
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Server connection Error :", error)
      throw error
    })
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at port : ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log("Mongo DB connection failed !!!", error);
  });



























// Another approch for mongoDB connecting process

/*
import { DB_NAME } from "./constants";
import express from "express";
const app = express();
;(async () => {
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("error", (error)=>{
          console.log("Error :", error)
          throw error
      })
      app.listen(process.env.PORT, ()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
      })
    } catch (err) {
        console.log("Error :", err);
        throw err
    }
})()
*/