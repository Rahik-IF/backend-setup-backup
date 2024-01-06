import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/AplResponse.js";
const registerUser = asyncHandler(
  async (req, res) => {

    // first get detais/data from front-end
    const { username, email, fullName, password } = req.body;
    console.log("email: ", email);

    // then do the validations (check here - not empty)
    if ([fullName, username, email, password].some((field) => field.trim() === "")) {
      throw new ApiError(400, "All fields are required")
    }
    // then, check if user already exists (by username and email)
    const existedUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if (existedUser) {
      throw new ApiError(409, " with username or email already exists");
    }

    // check if the files(avatar and cover image) are uploaded
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // check if the files actually in the local server
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    // if uploaded, then upload in the cloudinary, then check again if avatar uploaded
    const avatar = await uploadOnCloudinary(avatarLocalPath); // that's why we used async function here
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    // create user object (for mongoDB) - craete entry in db
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      username: username.toLowerCase()
    })
    // now check first that, user is really in DB or not!! Then select/choose the required field
    const createdUser = await User.findById(user._id)
      .select(
        // remove password and refresh token field from response(user) object
        "-password -refreshToken"
      )
    // check if user create successfully (response null or user object)
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong, while registering the user");
    }
    // return response
    return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")
    )

  }

)

export { registerUser };
