/** @type {import('next').NextConfig} */
const nextConfig = {
   async headers() {
    return [
      {
        source: 'https://ultrashare-api.vercel.app',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://ultrashare-api.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
