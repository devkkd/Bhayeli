import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// POST /api/upload - Public endpoint for uploading reference images for custom requests
export async function POST(req) {
  try {
    // Parse Multipart FormData
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({
        success: false,
        message: 'No reference image file uploaded.'
      }, { status: 400 });
    }

    // Check if file is an image by mime type or file name
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf'];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext) && !file.type.startsWith('image/')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid file type. Only images (PNG, JPG, WEBP, GIF) and PDF are allowed.'
      }, { status: 400 });
    }

    // Extract file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. STORAGE ROUTER
    // If Cloudflare R2 environment credentials exist, attempt cloud upload
    const hasR2Config = 
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && 
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY && 
      process.env.CLOUDFLARE_R2_BUCKET_NAME && 
      process.env.CLOUDFLARE_R2_ENDPOINT;

    if (hasR2Config) {
      try {
        console.log('☁️ Cloudflare R2 Credentials detected in .env. Attempting Cloud Upload for customer reference...');
        // Dynamically import AWS SDK
        const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

        const s3Client = new S3Client({
          region: 'auto',
          endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
          credentials: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
          },
        });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
        const key = `references/${rawName}-${uniqueSuffix}${ext}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type || 'image/png',
        }));

        const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '';
        const url = publicDomain 
          ? `${publicDomain.replace(/\/$/, '')}/${key}` 
          : `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${key}`;

        console.log('✅ Cloudflare R2 upload succeeded! Serving URL:', url);

        return NextResponse.json({
          success: true,
          url
        });
      } catch (err) {
        console.warn('⚠️ Cloudflare R2 upload failed. Falling back to local storage engine:', err.message);
      }
    }

    // 2. DEFAULT STORAGE: Local Filesystem Storage (public/uploads/)
    console.log('📁 Using local filesystem engine for public reference upload...');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure upload directory folder exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
      console.log('📁 Created public/uploads/ directory.');
    }

    // Sanitize and create safe, unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
    const filename = `ref-${rawName}-${uniqueSuffix}${ext}`;
    
    const filePath = path.join(uploadDir, filename);

    // Save file buffer locally
    await fs.writeFile(filePath, buffer);
    const url = `/uploads/${filename}`;

    console.log(`✅ Upload complete! File saved at: ${filePath}`);

    return NextResponse.json({
      success: true,
      url
    });

  } catch (error) {
    console.error('❌ Public Upload API Handler Error:', error);
    return NextResponse.json({
      success: false,
      message: `File upload failed: ${error.message}`
    }, { status: 500 });
  }
}
