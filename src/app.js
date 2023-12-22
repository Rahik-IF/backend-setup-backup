import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// app calling
const app = express();
//cors setup
app.use(cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true
}))

// configurations
// allow passing the json data to the server
app.use(express.json({ limit: "'16kb" }));
// generally urls are encoded like by %, & and other special characters, which should be accepted by the server.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// permission for static assets like pics, files 
app.use(express.static("public"));
// create secure cookies(CRUD) system which is only accessible by the server
app.use(cookieParser());



// routes import 
import userRouter from "./routes/user.routes.js";


//routes declaration
app.use("/api/v1/users", userRouter); // not app.get or app.post

export { app };