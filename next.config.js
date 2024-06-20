
/** @type {import('next').NextConfig} */


const nextConfig = {
    reactStrictMode: true,

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'x-hello',
                        value: 'there',
                    },
                ],
            },
        ]
    },
}




module.exports = nextConfig
