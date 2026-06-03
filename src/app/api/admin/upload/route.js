import { verifyToken } from '../../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    // 1. Session and Token Authentication Check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    const isValid = token ? await verifyToken(token) : null;

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin session required.'
      }, { status: 401 });
    }

    // 2. Parse Multipart FormData
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({
        success: false,
        message: 'No image file uploaded.'
      }, { status: 400 });
    }

    // Extract file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. STORAGE ROUTER
    // If Cloudflare R2 environment credentials exist, attempt cloud upload
    const hasR2Config = 
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && 
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY && 
      process.env.CLOUDFLARE_R2_BUCKET_NAME && 
      process.env.CLOUDFLARE_R2_ENDPOINT;

    if (hasR2Config) {
      try {
        console.log('☁️ Cloudflare R2 Credentials detected in .env. Attempting Cloud Upload...');
        // Dynamically import AWS SDK to prevent failure if package is not yet npm-installed
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
        const ext = path.extname(file.name) || '.png';
        const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
        const key = `catalog/${rawName}-${uniqueSuffix}${ext}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type || 'image/png',
        }));

        // Construct Cloudflare Public URL
        // E.g. https://<pub-domain>/catalog/image-key.png or standard endpoint format
        const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '';
        const url = publicDomain 
          ? `${publicDomain.replace(/\/$/, '')}/${key}` 
          : `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${key}`;

        console.log('✅ Cloudflare R2 upload succeeded! Serving URL:', url);

        return NextResponse.json({
          success: true,
          engine: 'Cloudflare R2',
          url
        });
      } catch (err) {
        console.warn('⚠️ Cloudflare R2 upload failed or AWS SDK not installed. Falling back to local storage engine:', err.message);
        // Fall back gracefully to Local Storage instead of breaking the flow
      }
    }

    // 4. DEFAULT STORAGE: Local Filesystem Storage (public/uploads/)
    console.log('📁 Using local filesystem engine for upload...');
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
    const ext = path.extname(file.name) || '.png';
    const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
    const filename = `${rawName}-${uniqueSuffix}${ext}`;
    
    const filePath = path.join(uploadDir, filename);

    // Save file buffer locally
    await fs.writeFile(filePath, buffer);
    const url = `/uploads/${filename}`;

    console.log(`✅ Upload complete! File saved at: ${filePath}`);

    return NextResponse.json({
      success: true,
      engine: 'Local Filesystem',
      url
    });

  } catch (error) {
    console.error('❌ Upload API Handler Error:', error);
    return NextResponse.json({
      success: false,
      message: `File upload failed: ${error.message}`
    }, { status: 500 });
  }
}
