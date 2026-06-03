import { categoryController } from '../../../../server/controllers/categoryController.js';
import { handleApiError } from '../../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  try {
    return await categoryController.getCategoryById(req, context);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req, context) {
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

    return await categoryController.updateCategory(req, context);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req, context) {
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

    return await categoryController.deleteCategory(req, context);
  } catch (error) {
    return handleApiError(error);
  }
}
