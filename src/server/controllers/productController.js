import { NextResponse } from 'next/server';
import { Product } from '../models/Product.js';
import { ApiError } from '../middleware/errorHandler.js';

// All named key-attribute fields (maps DB field → display label for the table)
export const KEY_ATTRIBUTE_FIELDS = [
  // Left column
  { field: 'material',          label: 'Material' },
  { field: 'weavingMethod',     label: 'Weaving Method' },
  { field: 'feature',           label: 'Feature' },
  { field: 'style',             label: 'Style' },
  { field: 'itemType',          label: 'Item Type' },
  { field: 'sleeveStyle',       label: 'Sleeve Style' },
  { field: 'patternType',       label: 'Pattern Type' },
  { field: 'season',            label: 'Season' },
  { field: 'thickness',         label: 'Thickness' },
  { field: 'liningMaterial',    label: 'Lining Material' },
  { field: 'shellMaterial',     label: 'Shell Material' },
  { field: 'fillingMaterial',   label: 'Filling Material' },
  { field: 'fabricType',        label: 'Fabric Type' },
  { field: 'customizationAttr', label: 'Customization' },
  // Right column
  { field: 'technics',          label: 'Technics' },
  { field: 'supplyType',        label: 'Supply Type' },
  { field: 'support',           label: 'Support' },
  { field: 'seamlessFusing',    label: 'Seamless Fusing' },
  { field: 'modelNumber',       label: 'Model Number' },
  { field: 'processingType',    label: 'Processing Type' },
  { field: 'placeOfOrigin',     label: 'Place of Origin' },
  { field: 'brandName',         label: 'Brand Name' },
  { field: 'clothingLength',    label: 'Clothing Length' },
  { field: 'oemOdm',            label: 'OEM/ODM' },
  { field: 'materialRight',     label: 'Material' },
  { field: 'deliveryTime',      label: 'Delivery Time' },
  { field: 'quality',           label: 'Quality' },
];

// Generates a URL-friendly slug from a title string
const toSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'product';

// Default key-attribute labels shown in the product page table
export const DEFAULT_ATTRIBUTES = [
  'Material', 'Weaving Method', 'Feature', 'Style', 'Item Type',
  'Sleeve Style', 'Pattern Type', 'Season', 'Thickness', 'Lining Material',
  'Shell Material', 'Filling Material', 'Fabric Type', 'Customization',
  'Technics', 'Supply Type', 'Support', 'Seamless Fusing', 'Model Number',
  'Processing Type', 'Place of Origin', 'Brand Name', 'Clothing Length',
  'OEM/ODM', 'Delivery Time', 'Quality',
];

export const productController = {

  // ── GET /api/products ──────────────────────────────────
  getProducts: async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const categorySlug = searchParams.get('categorySlug');
      const search = searchParams.get('search');

      const filter = {};
      if (categorySlug) filter.categorySlug = categorySlug;
      if (search) {
        filter.$or = [
          { title:     new RegExp(search, 'i') },
          { technique: new RegExp(search, 'i') },
        ];
      }

      const products = await Product.find(filter);
      return NextResponse.json({ success: true, count: products.length, data: products });
    } catch (error) {
      throw new ApiError(500, `Failed to retrieve products: ${error.message}`);
    }
  },

  // ── GET /api/products/[id] ─────────────────────────────
  getProductById: async (req, context) => {
    try {
      const { id } = await context.params;
      // Try MongoDB ObjectId first, then fall back to slug lookup
      let product = null;
      const isObjectId = /^[a-f\d]{24}$/i.test(id);
      if (isObjectId) {
        product = await Product.findById(id);
      }
      // If not found by ID or not an ObjectId, try slug
      if (!product) {
        product = await Product.findOne({ slug: id });
      }
      if (!product) throw new ApiError(404, `Product "${id}" not found.`);
      return NextResponse.json({ success: true, data: product });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to retrieve product: ${error.message}`);
    }
  },

  // ── POST /api/products ─────────────────────────────────
  createProduct: async (req) => {
    try {
      const body = await req.json();

      if (!body.title?.trim())          throw new ApiError(400, 'Product title is required.');
      if (!body.categorySlug?.trim()) throw new ApiError(400, 'categorySlug is required.');
      if (!body.image)                  throw new ApiError(400, 'Main product image is required.');

      const newProduct = await Product.create({
        title:               body.title.trim(),
        slug:                toSlug(body.title.trim()),
        categorySlug:        body.categorySlug.trim(),
        technique:           body.technique || '',
        image:               body.image,
        gallery:             Array.isArray(body.gallery) ? body.gallery : [],
        moq:                 body.moq || 'MOQ: 50 pcs',
        description:         body.description || '',
        size:                body.size || '',
        oemService:          body.oemService || '',
        customization:       body.customization || '',
        customizedLogo:      body.customizedLogo || '',
        customizedPackaging: body.customizedPackaging || '',
        spotlight:           body.spotlight || '',
        // Named key attributes
        material:            body.material || '',
        weavingMethod:       body.weavingMethod || '',
        feature:             body.feature || '',
        style:               body.style || '',
        itemType:            body.itemType || '',
        sleeveStyle:         body.sleeveStyle || '',
        patternType:         body.patternType || '',
        season:              body.season || '',
        thickness:           body.thickness || '',
        liningMaterial:      body.liningMaterial || '',
        shellMaterial:       body.shellMaterial || '',
        fillingMaterial:     body.fillingMaterial || '',
        fabricType:          body.fabricType || '',
        customizationAttr:   body.customizationAttr || '',
        technics:            body.technics || '',
        supplyType:          body.supplyType || '',
        support:             body.support || '',
        seamlessFusing:      body.seamlessFusing || '',
        modelNumber:         body.modelNumber || '',
        processingType:      body.processingType || '',
        placeOfOrigin:       body.placeOfOrigin || '',
        brandName:           body.brandName || 'BHAYELI',
        clothingLength:      body.clothingLength || '',
        oemOdm:              body.oemOdm || '',
        materialRight:       body.materialRight || '',
        deliveryTime:        body.deliveryTime || '',
        quality:             body.quality || '',
        // Extra overflow attributes
        attributes:          Array.isArray(body.attributes) ? body.attributes : [],
      });

      return NextResponse.json(
        { success: true, message: 'Product created successfully.', data: newProduct },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to create product: ${error.message}`);
    }
  },

  // ── PUT /api/products/[id] ─────────────────────────────
  updateProduct: async (req, context) => {
    try {
      const { id } = await context.params;
      const body = await req.json();

      const updateFields = {};
      if (body.title              !== undefined) { updateFields.title = body.title.trim(); updateFields.slug = toSlug(body.title.trim()); }
      if (body.categorySlug      !== undefined) updateFields.categorySlug = body.categorySlug.trim();
      if (body.technique          !== undefined) updateFields.technique = body.technique;
      if (body.image              !== undefined) updateFields.image = body.image;
      if (body.gallery            !== undefined) updateFields.gallery = body.gallery;
      if (body.moq                !== undefined) updateFields.moq = body.moq;
      if (body.description        !== undefined) updateFields.description = body.description;
      if (body.size               !== undefined) updateFields.size = body.size;
      if (body.oemService         !== undefined) updateFields.oemService = body.oemService;
      if (body.customization      !== undefined) updateFields.customization = body.customization;
      if (body.customizedLogo     !== undefined) updateFields.customizedLogo = body.customizedLogo;
      if (body.customizedPackaging!== undefined) updateFields.customizedPackaging = body.customizedPackaging;
      if (body.spotlight          !== undefined) updateFields.spotlight = body.spotlight;
      if (body.attributes         !== undefined) updateFields.attributes = body.attributes;
      // Named key attributes
      const attrFields = [
        'material','weavingMethod','feature','style','itemType','sleeveStyle',
        'patternType','season','thickness','liningMaterial','shellMaterial',
        'fillingMaterial','fabricType','customizationAttr','technics','supplyType',
        'support','seamlessFusing','modelNumber','processingType','placeOfOrigin',
        'brandName','clothingLength','oemOdm','materialRight','deliveryTime','quality',
      ];
      attrFields.forEach((f) => {
        if (body[f] !== undefined) updateFields[f] = body[f];
      });

      const updated = await Product.findByIdAndUpdate(id, updateFields);
      if (!updated) throw new ApiError(404, `Product with ID "${id}" not found.`);
      return NextResponse.json({ success: true, message: 'Product updated.', data: updated });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to update product: ${error.message}`);
    }
  },

  // ── DELETE /api/products/[id] ──────────────────────────
  deleteProduct: async (req, context) => {
    try {
      const { id } = await context.params;
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) throw new ApiError(404, `Product with ID "${id}" not found.`);
      return NextResponse.json({ success: true, message: 'Product deleted.', data: deleted });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Failed to delete product: ${error.message}`);
    }
  },
};
