
/** @type {import('next').NextConfig} */


const nextConfig = {
    experimental: {
        serverActions: true,
    },
    reactStrictMode: true,
    compilerOptions: {
        target: "ES2020",

    }
}



module.exports = nextConfig
