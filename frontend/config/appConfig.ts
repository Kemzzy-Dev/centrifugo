const appConfig = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    cloudinaryApiName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    cloudinaryUploadUrl: "https://api.cloudinary.com/v1_1/" + process.env.NEXT_PUBLIC_CLOUDINARY_NAME + "/auto/upload",
    socketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    BASE_URL: process.env.NEXT_PUBLIC_URL
}

export default appConfig