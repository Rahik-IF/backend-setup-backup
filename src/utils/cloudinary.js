// Hello, listen for a little time please...
// it is possible to upload files directly on the cloudinary server/sdk
// but the best practise in production grade is the two step process
// first upload in our own local server, then pass it to cloudinary by using its "local file path".
// it is a common approach, so that any actions if need instantly can take in the local server
// if all process done successfully, then finally upload to cloudianry and remove from local server
// thank you

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file uploaded successfully
        console.log("file uploaded successfully", response.url); //see the public url
        return response;

    } catch (error) {
        // remove the locally saved temporary file as the upload operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadOnCloudinary};