import { NextResponse } from 'next/server';
import { Contact } from '../../../server/models/Contact.js';
import { handleApiError } from '../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { sendContactEmails } from '../../../server/utils/email.js';

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? await verifyToken(token) : null;
}

// GET /api/contacts — admin only
export async function GET(req) {
  try {
    if (!(await requireAdmin()))
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const filter = status ? { status } : {};
    const data = await Contact.find(filter);
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) { return handleApiError(error); }
}

// POST /api/contacts — public
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.fullName?.trim())    return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    if (!body.email?.trim())       return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    if (!body.phone?.trim())       return NextResponse.json({ success: false, message: 'Phone is required.' }, { status: 400 });
    if (!body.country?.trim())     return NextResponse.json({ success: false, message: 'Country is required.' }, { status: 400 });
    if (!body.message?.trim())     return NextResponse.json({ success: false, message: 'Message is required.' }, { status: 400 });

    const contact = await Contact.create({
      companyName: body.companyName?.trim() || '',
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      country: body.country.trim(),
      companyWebsite: body.companyWebsite?.trim() || '',
      inquiryType: body.inquiryType || 'Product Related',
      message: body.message.trim(),
      status: 'new',
    });

    try {
      await sendContactEmails(contact);
    } catch (mailErr) {
      console.error("Failed to send contact notification email:", mailErr);
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.', data: contact }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
