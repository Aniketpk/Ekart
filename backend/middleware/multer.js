import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 5 },
    fileFilter: (_, file, callback) => {
        if (!file.mimetype?.startsWith("image/")) {
            const error = new Error("Only image uploads are supported");
            error.status = 400;
            return callback(error);
        }
        callback(null, true);
    }
});

//single file upload
export const singleUpload = upload.single("file");


// multiple file upload
export const multipleUpload = upload.array("files", 5);
