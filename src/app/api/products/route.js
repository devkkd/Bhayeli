import { productController } from '../../../server/controllers/productController.js';
import { handleApiError } from '../../../server/middleware/errorHandler.js';
import { verifyToken } from '../../../server/utils/token.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// ── Auth helper ───────────────────────────────────────────────────────────
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const isValid = token ? await verifyToken(token) : null;
  return isValid;
}

// ── GET /api/products — public ────────────────────────────────────────────
// Query params:
//   ?collectionSlug=hand-embroidered-jacket  — filter by collection
//   ?search=jacket                           — text search on title/technique
export async function GET(req) {
  try {
    return await productController.getProducts(req);
  } catch (error) {
    return handleApiError(error);
  }
}

// ── POST /api/products — admin only ──────────────────────────────────────
export async function POST(req) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    return await productController.createProduct(req);
  } catch (error) {
    return handleApiError(error);
  }
}
