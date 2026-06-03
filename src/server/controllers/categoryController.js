import { NextResponse } from 'next/server';
import { Category } from '../models/Category.js';
import { ApiError } from '../middleware/errorHandler.js';

export const categoryController = {
  /**
   * Get all categories with optional search filters
   */
  getCategories: async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search');

      const filter = {};

      if (search) {
        filter.$or = [
          { title: new RegExp(search, 'i') },
          { slug: new RegExp(search, 'i') }
        ];
      }

      const categories = await Category.find(filter);
      
      return NextResponse.json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error) {
      throw new ApiError(500, `Failed to retrieve categories: ${error.message}`);
    }
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (req, context) => {
    try {
      const params = await context.params;
      const { id } = params;

      const category = await Category.findById(id);

      if (!category) {
        throw new ApiError(404, `Category with ID ${id} not found.`);
      }

      return NextResponse.json({
        success: true,
        data: category,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to retrieve category: ${error.message}`);
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (req) => {
    try {
      const body = await req.json();
      
      // Basic validations
      if (!body.title) throw new ApiError(400, 'Category title is required.');
      
      const slug = (body.slug || '')
        .trim()
        .toLowerCase()
        || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      if (!slug) throw new ApiError(400, 'Category slug is required or could not be generated.');
      if (!body.image) throw new ApiError(400, 'Category image path is required.');

      const newCategory = await Category.create({
        title: body.title,
        slug: slug,
        image: body.image,
        description: body.description || '',
      });

      return NextResponse.json({
        success: true,
        message: 'Category created successfully.',
        data: newCategory,
      }, { status: 201 });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to create category: ${error.message}`);
    }
  },

  /**
   * Update an existing category
   */
  updateCategory: async (req, context) => {
    try {
      const params = await context.params;
      const { id } = params;
      const body = await req.json();

      const updatedCategory = await Category.findByIdAndUpdate(id, body);

      if (!updatedCategory) {
        throw new ApiError(404, `Category with ID ${id} not found to update.`);
      }

      return NextResponse.json({
        success: true,
        message: 'Category updated successfully.',
        data: updatedCategory,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to update category: ${error.message}`);
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (req, context) => {
    try {
      const params = await context.params;
      const { id } = params;

      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        throw new ApiError(404, `Category with ID ${id} not found to delete.`);
      }

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully.',
        data: deletedCategory,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to delete category: ${error.message}`);
    }
  }
};
