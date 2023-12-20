import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

// Pre is a middleware/hook of mongoose, which is used for checking anything in the database just before saved it


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // use which make searchable in database
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // saved as cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // saved as cloudinary url
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });


// Hash Password before saving
//workinging just before saving in database
userSchema.pre("save", async function (next) {
    // use if condition, so that not every saving operation password encrypted
    // so it need to run when password save for first time
    // so check if the password is already modified or not
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10); // here you can see this object shows password field suggestion
    }
    next();
}) //never use here arrow function, as arrow function don't have the access of "this" keyword (associated with class)




//compare the password, by using custom methods
// but user sent the raw (unencoded or decoded ), so we need to compare with hashed password
// this also can do by bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
    // return Boolean (true/false)
    return await bcrypt.compare(password, this.password);
}


// we will use both cookies and session for high security, so two tokens wil be used
//access token will not save in database, but refresh token will be save in database
// access and refresh tokens are jwt, but usages are different

// so create them by also custom methods
userSchema.methods.generateAccessToken = function () {
    // here keys are the name of payload and values are the field's name in database 
   return Jwt.sign({
        _id: this._id,
        username: this.username,
        fullName: this.fullName,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};
// same as access token generation, but here used less payloads, as it refreshes continuously all time
userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};




export const User = mongoose.model("User", userSchema);