import { NextResponse } from 'next/server';
import { InstagramVideo } from '../../../server/models/InstagramVideo.js';
import { handleApiError } from '../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../server/utils/token.js';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? await verifyToken(token) : null;
}

// GET /api/instagram-feed - Fetch video reels
export async function GET(req) {
  try {
    const isAdmin = await requireAdmin();
    // If not admin, only fetch active reels. If admin, return all (active/inactive).
    const filter = isAdmin ? {} : { status: 'active' };
    const data = await InstagramVideo.find(filter);
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) { return handleApiError(error); }
}

// POST /api/instagram-feed - Create new reel (admin only)
export async function POST(req) {
  try {
    if (!(await requireAdmin()))
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });

    const body = await req.json();
    if (!body.videoUrl?.trim()) {
      return NextResponse.json({ success: false, message: 'Video URL/file is required.' }, { status: 400 });
    }

    // Default views count to random between 100 and 500 if not provided
    const views = body.views !== undefined && body.views !== "" ? Number(body.views) : Math.floor(Math.random() * 401) + 100;

    const item = await InstagramVideo.create({
      videoUrl: body.videoUrl.trim(),
      thumbnailUrl: body.thumbnailUrl?.trim() || '',
      instagramUrl: body.instagramUrl?.trim() || '',
      views,
      order: body.order !== undefined && body.order !== "" ? Number(body.order) : 0,
      status: body.status || 'active',
    });

    return NextResponse.json({ success: true, message: 'Instagram feed post created successfully.', data: item }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
