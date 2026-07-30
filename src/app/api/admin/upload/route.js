import { verifyToken } from '../../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function resolveMimeType(filename, providedType) {
  if (providedType && providedType !== 'application/octet-stream' && providedType.includes('/')) {
    return providedType;
  }
  const ext = path.extname(filename || '').toLowerCase();
  const map = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.3gp': 'video/3gpp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };
  return map[ext] || 'application/octet-stream';
}

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

    const contentType = req.headers.get('content-type') || '';

    // Check R2 Config Availability
    const hasR2Config = 
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && 
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY && 
      process.env.CLOUDFLARE_R2_BUCKET_NAME && 
      process.env.CLOUDFLARE_R2_ENDPOINT;

    // 2. Handle JSON Request for Presigned Upload URL
    if (contentType.includes('application/json')) {
      const body = await req.json();

      if (body.action === 'get_presigned_url' || body.presigned) {
        if (!hasR2Config) {
          return NextResponse.json({
            success: false,
            presignedAvailable: false,
            message: 'Cloudflare R2 cloud storage is not configured on server.'
          }, { status: 200 });
        }

        const { fileName, fileType } = body;
        if (!fileName) {
          return NextResponse.json({
            success: false,
            message: 'File name is required for presigned URL.'
          }, { status: 400 });
        }

        try {
          const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
          const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

          const s3Client = new S3Client({
            region: 'auto',
            endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
            credentials: {
              accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
              secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            },
          });

          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(fileName) || '.mp4';
          const rawName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
          const mimeType = resolveMimeType(fileName, fileType);
          const key = `catalog/${rawName}-${uniqueSuffix}${ext}`;

          const command = new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: key,
            ContentType: mimeType,
          });

          const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          
          const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '';
          const publicUrl = publicDomain 
            ? `${publicDomain.replace(/\/$/, '')}/${key}` 
            : `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_R2_BUCKET_NAME}/${key}`;

          return NextResponse.json({
            success: true,
            presignedAvailable: true,
            presignedUrl,
            publicUrl,
            key,
            mimeType
          });
        } catch (err) {
          console.error('❌ Failed to generate R2 Presigned URL:', err);
          return NextResponse.json({
            success: false,
            presignedAvailable: false,
            message: `Failed to generate upload URL: ${err.message}`
          }, { status: 500 });
        }
      }
    }

    // 3. Handle Multipart FormData Upload
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({
        success: false,
        message: 'No file uploaded.'
      }, { status: 400 });
    }

    const mimeType = resolveMimeType(file.name, file.type);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (hasR2Config) {
      try {
        console.log('☁️ Attempting R2 direct server stream upload...');
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
        const ext = path.extname(file.name) || (mimeType.startsWith('video/') ? '.mp4' : '.png');
        const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
        const key = `catalog/${rawName}-${uniqueSuffix}${ext}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        }));

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
        console.warn('⚠️ Cloudflare R2 upload failed. Falling back to local storage engine:', err.message);
      }
    }

    // Fallback: Local Filesystem Storage
    console.log('📁 Using local filesystem engine for upload...');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.name) || (mimeType.startsWith('video/') ? '.mp4' : '.png');
    const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
    const filename = `${rawName}-${uniqueSuffix}${ext}`;
    
    const filePath = path.join(uploadDir, filename);

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
