import multer from "multer";

const storage = multer.memoryStorage();

//single file upload
export const singleUpload = multer({ storage }).single("file");


// multiple file upload
export const multipleUpload = multer({ storage }).array("files", 5);

