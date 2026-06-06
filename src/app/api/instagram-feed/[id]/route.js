import { NextResponse } from 'next/server';
import { InstagramVideo } from '../../../../server/models/InstagramVideo.js';
import { handleApiError } from '../../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../../server/utils/token.js';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? await verifyToken(token) : null;
}

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const data = await InstagramVideo.findById(id);
    if (!data) return NextResponse.json({ success: false, message: 'Reel not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req, context) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { id } = await context.params;
    const body = await req.json();
    const update = {};
    if (body.videoUrl !== undefined) update.videoUrl = body.videoUrl;
    if (body.thumbnailUrl !== undefined) update.thumbnailUrl = body.thumbnailUrl;
    if (body.instagramUrl !== undefined) update.instagramUrl = body.instagramUrl;
    if (body.views !== undefined) update.views = Number(body.views);
    if (body.order !== undefined) update.order = Number(body.order);
    if (body.status !== undefined) update.status = body.status;

    const updated = await InstagramVideo.findByIdAndUpdate(id, update);
    if (!updated) return NextResponse.json({ success: false, message: 'Reel not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Reel updated.', data: updated });
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(req, context) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { id } = await context.params;
    const deleted = await InstagramVideo.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Reel not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Reel deleted.' });
  } catch (error) { return handleApiError(error); }
}
