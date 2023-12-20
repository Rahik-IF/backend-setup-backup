import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    username
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);