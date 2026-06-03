import { NextResponse } from 'next/server';
import { Collection } from '../models/Collection.js';
import { ApiError } from '../middleware/errorHandler.js';

export const collectionController = {
  /**
   * Get all collections
   */
  getCollections: async (req) => {
    try {
      const collections = await Collection.find();
      
      return NextResponse.json({
        success: true,
        count: collections.length,
        data: collections,
      });
    } catch (error) {
      throw new ApiError(500, `Failed to retrieve collections: ${error.message}`);
    }
  },

  /**
   * Create a new collection
   */
  createCollection: async (req) => {
    try {
      const body = await req.json();

      if (!body.title) throw new ApiError(400, 'Collection title is required.');
      
      const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const existingCollection = await Collection.findOne({ slug });
      if (existingCollection) {
        throw new ApiError(400, `Collection with slug "${slug}" already exists.`);
      }

      const newCollection = await Collection.create({
        slug,
        title: body.title,
        tag: body.tag || '',
        description: body.description || '',
      });

      return NextResponse.json({
        success: true,
        message: 'Collection created successfully.',
        data: newCollection,
      }, { status: 201 });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to create collection: ${error.message}`);
    }
  }
};
