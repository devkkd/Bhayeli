import { collectionController } from '../../../server/controllers/collectionController.js';
import { handleApiError } from '../../../server/middleware/errorHandler.js';

export async function GET(req) {
  try {
    return await collectionController.getCollections(req);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req) {
  try {
    return await collectionController.createCollection(req);
  } catch (error) {
    return handleApiError(error);
  }
}
