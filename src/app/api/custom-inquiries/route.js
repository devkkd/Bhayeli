import { NextResponse } from 'next/server';
import { CustomInquiry } from '../../../server/models/CustomInquiry.js';
import { handleApiError } from '../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { sendCustomInquiryEmails } from '../../../server/utils/email.js';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? await verifyToken(token) : null;
}

// GET /api/custom-inquiries — admin only
export async function GET(req) {
  try {
    if (!(await requireAdmin()))
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const filter = status ? { status } : {};
    const data = await CustomInquiry.find(filter);
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) { return handleApiError(error); }
}

// POST /api/custom-inquiries — public submission
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.fullName?.trim())    return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    if (!body.email?.trim())       return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    if (!body.phone?.trim())       return NextResponse.json({ success: false, message: 'Phone is required.' }, { status: 400 });
    if (!body.country?.trim())     return NextResponse.json({ success: false, message: 'Country is required.' }, { status: 400 });
    if (!body.message?.trim())     return NextResponse.json({ success: false, message: 'Message details are required.' }, { status: 400 });

    const inquiry = await CustomInquiry.create({
      companyName: body.companyName?.trim() || '',
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      country: body.country.trim(),
      companyWebsite: body.companyWebsite?.trim() || '',
      interests: Array.isArray(body.interests) ? body.interests : [],
      techniques: Array.isArray(body.techniques) ? body.techniques : [],
      quantities: Array.isArray(body.quantities) ? body.quantities : [],
      message: body.message.trim(),
      referenceImages: Array.isArray(body.referenceImages) ? body.referenceImages : [],
      status: 'new',
    });

    try {
      await sendCustomInquiryEmails(inquiry);
    } catch (mailErr) {
      console.error("Failed to send custom inquiry notification email:", mailErr);
    }

    return NextResponse.json({ success: true, message: 'Custom inquiry submitted successfully.', data: inquiry }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
