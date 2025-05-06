// next.config.mjs
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// โหลด .env เฉพาะตอน local หรือถ้า ENV บางตัวยังไม่ถูกกำหนด
const envPath = `${__dirname}/.env`;
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // ส่งต่อ env เฉพาะที่จำเป็นเท่านั้น
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    domains: ["images.unsplash.com", "fastly.picsum.photos", "images.fastcompany.com"],
  },
};

export default nextConfig;
