const getDataUri = (file) => {
    if (!file?.mimetype?.startsWith("image/") || !Buffer.isBuffer(file.buffer)) {
        throw new TypeError("A valid image upload is required");
    }
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

export default getDataUri;
