import { NextResponse } from 'next/server';
import { Inquiry } from '../../../../server/models/Inquiry.js';
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
    if (!(await requireAdmin())) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { id } = await context.params;
    const data = await Inquiry.findById(id);
    if (!data) return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req, context) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { id } = await context.params;
    const body = await req.json();
    const update = {};
    if (body.status !== undefined) update.status = body.status;
    if (body.adminNotes !== undefined) update.adminNotes = body.adminNotes;
    const updated = await Inquiry.findByIdAndUpdate(id, update);
    if (!updated) return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Updated.', data: updated });
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(req, context) {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { id } = await context.params;
    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted.' });
  } catch (error) { return handleApiError(error); }
}
