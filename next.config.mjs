/** @type {import('next').NextConfig} */
const nextConfig = {
   async headers() {
    return [
      {
        source: 'https://ultrashare-api.onrender.com',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://ultrashare-api.onrender.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
   
};

export default nextConfig;
