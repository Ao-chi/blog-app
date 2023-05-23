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
        NEXTAUTH_URL: "http://blog-app-git-dev-ao-chi.vercel.app",
    },
};

module.exports = nextConfig;
