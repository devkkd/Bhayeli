import { productController } from '../../../../server/controllers/productController.js';
import { handleApiError } from '../../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// ── Auth helper ───────────────────────────────────────────────────────────
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const isValid = token ? await verifyToken(token) : null;
  return isValid;
}

// ── GET /api/products/[id] — public ──────────────────────────────────────
export async function GET(req, context) {
  try {
    return await productController.getProductById(req, context);
  } catch (error) {
    return handleApiError(error);
  }
}

// ── PUT /api/products/[id] — full update, admin only ─────────────────────
export async function PUT(req, context) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    return await productController.updateProduct(req, context);
  } catch (error) {
    return handleApiError(error);
  }
}

// ── PATCH /api/products/[id] — partial update, admin only ────────────────
export async function PATCH(req, context) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    return await productController.updateProduct(req, context);
  } catch (error) {
    return handleApiError(error);
  }
}

// ── DELETE /api/products/[id] — admin only ───────────────────────────────
export async function DELETE(req, context) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    return await productController.deleteProduct(req, context);
  } catch (error) {
    return handleApiError(error);
  }
}
