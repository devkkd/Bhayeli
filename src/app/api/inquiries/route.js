import { NextResponse } from 'next/server';
import { Inquiry } from '../../../server/models/Inquiry.js';
import { handleApiError } from '../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { sendInquiryEmails } from '../../../server/utils/email.js';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? await verifyToken(token) : null;
}

// GET /api/inquiries — admin only
export async function GET(req) {
  try {
    if (!(await requireAdmin()))
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const filter = status ? { status } : {};
    const data = await Inquiry.find(filter);
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) { return handleApiError(error); }
}

// POST /api/inquiries — public
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.companyName?.trim()) return NextResponse.json({ success: false, message: 'Company name is required.' }, { status: 400 });
    if (!body.fullName?.trim())    return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    if (!body.email?.trim())       return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    if (!body.phone?.trim())       return NextResponse.json({ success: false, message: 'Phone is required.' }, { status: 400 });
    if (!body.country?.trim())     return NextResponse.json({ success: false, message: 'Country is required.' }, { status: 400 });

    const inquiry = await Inquiry.create({
      companyName: body.companyName.trim(),
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      country: body.country.trim(),
      companyWebsite: body.companyWebsite?.trim() || '',
      inquiryType: body.inquiryType || 'Product Related',
      message: body.message?.trim() || '',
      items: Array.isArray(body.items) ? body.items : [],
      status: 'new',
    });

    try {
      await sendInquiryEmails(inquiry);
    } catch (mailErr) {
      console.error("Failed to send inquiry notification email:", mailErr);
    }

    return NextResponse.json({ success: true, message: 'Inquiry submitted.', data: inquiry }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
