/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    env: {
        MONGO_URI: "mongodb+srv://josh1:test123@mernapp01.kpm7qld.mongodb.net/?retryWrites=true&w=majority",
        ACCESS_TOKEN: "de242607fb7ff8961cda331922f17236d160139e",
        NEXTAUTH_SECRET: "leopaKwNf4hNRx9YgyIdhoiK7JqUr/SZntAiYdNI/YM=",
        NEXTAUTH_URL: "http://localhost:3000",
        CLOUDINARY_API_KEY: "693396889741612",
        CLOUDINARY_API_SECRET: "IxRrPibgww1Ow-_RdIETUXR0Ooo",
        CLOUDINARY_NAME: "aoichan",
    },
    images: {
        domains: ["res.cloudinary.com"],
    },
};

module.exports = nextConfig;
