import { categoryController } from '../../../server/controllers/categoryController.js';
import { handleApiError } from '../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    return await categoryController.getCategories(req);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    const isValid = token ? await verifyToken(token) : null;

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin session required.'
      }, { status: 401 });
    }

    return await categoryController.createCategory(req);
  } catch (error) {
    return handleApiError(error);
  }
}
