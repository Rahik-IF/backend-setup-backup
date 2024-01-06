import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    //here we get req, and file. where i have access of req by nature. But file is not processed by express
    // so here we get the file, that's why multer is used with express
    destination: function (req, file, cb) {
        cb(null, "../../public/temp")
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        //create a unique file name
        const fileName =
            file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") +
            "-" +
            Date.now();
        cb(null, fileName + fileExt);
    }
})
// by this proccess, the files will save in the local server for a very short time
//and when cloudinary uploaded, then it will be removed from local server
// Ahh....This is the configuration function which will return the local path for cloudinary

export const upload = multer({ storage });
