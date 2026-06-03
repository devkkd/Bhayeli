import { collections as seedCollections } from '../../app/data/collections.js';

let initialized = false;
let mockCollections = [];
let mockProducts = [];
let mockCategories = [];

function initializeMockDb() {
  if (initialized) return;

  console.log('🌱 Seeding In-Memory Mock Database from collections.js data...');
  
  // Seed collections and extract nested products
  seedCollections.forEach((c) => {
    mockCollections.push({
      _id: `col_${c.slug}`,
      slug: c.slug,
      title: c.title,
      tag: c.tag,
      description: c.description,
      createdAt: new Date(),
    });

    // Seed products with collection slug/reference
    c.products.forEach((p, idx) => {
      const baseSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let slug = baseSlug;
      let counter = 1;
      while (mockProducts.some((item) => item.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      mockProducts.push({
        _id: `prod_${c.slug}_${idx + 1}`,
        title: p.title,
        slug: slug,
        image: p.image,
        moq: p.moq,
        collectionSlug: c.slug,
        size: 'Free Size',
        oemService: 'Available',
        customization: 'Anything can be customize as per your requirement',
        customizedLogo: 'Min. order: 300 pieces',
        customizedPackaging: 'Min. order: 300 pieces',
        createdAt: new Date(),
      });
    });
  });

  // Seed default categories for testing
  mockCategories.push(
    {
      _id: 'cat_apparel',
      title: 'Apparel & Kimonos',
      slug: 'apparel',
      image: '/image/category/jacket.png',
      description: 'Handcrafted sustainable cotton quilted jackets and light kimono robes.',
      createdAt: new Date(),
    },
    {
      _id: 'cat_bags',
      title: 'Handbags & Totes',
      slug: 'bags',
      image: '/image/category/tote-bag.png',
      description: 'Ethically crafted cotton quilted tote bags and durable travel accessories.',
      createdAt: new Date(),
    },
    {
      _id: 'cat_organizers',
      title: 'Makeup & Organizers',
      slug: 'organizers',
      image: '/image/category/makeup-bags.png',
      description: 'Eco-friendly multi-purpose makeup bags with cotton block printed patterns.',
      createdAt: new Date(),
    }
  );

  initialized = true;
  console.log(`✅ Seeded ${mockCollections.length} collections, ${mockProducts.length} products, and ${mockCategories.length} categories into Mock DB.`);
}

// Initialize on load
initializeMockDb();

export const MockCategory = {
  find: async (query = {}) => {
    let results = [...mockCategories];
    Object.keys(query).forEach((key) => {
      results = results.filter((item) => item[key] === query[key]);
    });
    return results;
  },
  
  findOne: async (query = {}) => {
    const list = await MockCategory.find(query);
    return list[0] || null;
  },

  findById: async (id) => {
    return mockCategories.find((item) => item._id === id) || null;
  },

  create: async (data) => {
    const newCat = {
      _id: `cat_${data.slug || Date.now()}`,
      slug: data.slug || `category-${Date.now()}`,
      title: data.title || '',
      image: data.image || '/image/category/makeup-bags.png',
      description: data.description || '',
      createdAt: new Date(),
      ...data
    };
    mockCategories.push(newCat);
    return newCat;
  },

  findByIdAndUpdate: async (id, updateData, options = {}) => {
    const index = mockCategories.findIndex((item) => item._id === id);
    if (index === -1) return null;
    mockCategories[index] = { ...mockCategories[index], ...updateData };
    return mockCategories[index];
  },

  findByIdAndDelete: async (id) => {
    const index = mockCategories.findIndex((item) => item._id === id);
    if (index === -1) return null;
    const deleted = mockCategories[index];
    mockCategories.splice(index, 1);
    return deleted;
  }
};

export const MockCollection = {
  find: async (query = {}) => {
    let results = [...mockCollections];
    // Simple filter support (e.g., matching exact key-values)
    Object.keys(query).forEach((key) => {
      results = results.filter((item) => item[key] === query[key]);
    });
    return results;
  },
  
  findOne: async (query = {}) => {
    const list = await MockCollection.find(query);
    return list[0] || null;
  },

  create: async (data) => {
    const newCol = {
      _id: `col_${data.slug || Date.now()}`,
      slug: data.slug || `collection-${Date.now()}`,
      title: data.title || '',
      tag: data.tag || '',
      description: data.description || '',
      createdAt: new Date(),
      ...data
    };
    mockCollections.push(newCol);
    return newCol;
  }
};

export const MockProduct = {
  find: async (query = {}) => {
    let results = [...mockProducts];

    if (query.$or) {
      results = results.filter((item) =>
        query.$or.some((condition) => {
          const key = Object.keys(condition)[0];
          const val = condition[key];
          if (val instanceof RegExp) return val.test(item[key]);
          return item[key] === val;
        })
      );
    } else {
      Object.keys(query).forEach((key) => {
        results = results.filter((item) => item[key] === query[key]);
      });
    }

    return results;
  },

  findOne: async (query = {}) => {
    const list = await MockProduct.find(query);
    return list[0] || null;
  },

  findById: async (id) => {
    return mockProducts.find((item) => item._id === id) || null;
  },

  create: async (data) => {
    let baseSlug = (data.title || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    let slug = data.slug || baseSlug;
    let counter = 1;
    while (mockProducts.some((item) => item.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProd = {
      _id: `prod_${Date.now()}`,
      title: data.title || '',
      slug: slug,
      image: data.image || '',
      gallery: data.gallery || [],
      moq: data.moq || 'MOQ: 50 pcs',
      collectionSlug: data.collectionSlug || '',
      description: data.description || '',
      spotlight: data.spotlight || '',
      size: data.size || 'Free Size',
      oemService: data.oemService || 'Available',
      customization: data.customization || 'Anything can be customize as per your requirement',
      customizedLogo: data.customizedLogo || 'Min. order: 300 pieces',
      customizedPackaging: data.customizedPackaging || 'Min. order: 300 pieces',
      attributes: data.attributes || [],
      technique: data.technique || '',
      createdAt: new Date(),
      ...data,
      slug
    };
    mockProducts.push(newProd);
    return newProd;
  },

  findByIdAndUpdate: async (id, updateData) => {
    const index = mockProducts.findIndex((item) => item._id === id);
    if (index === -1) return null;
    mockProducts[index] = { ...mockProducts[index], ...updateData };
    return mockProducts[index];
  },

  findByIdAndDelete: async (id) => {
    const index = mockProducts.findIndex((item) => item._id === id);
    if (index === -1) return null;
    const deleted = mockProducts[index];
    mockProducts.splice(index, 1);
    return deleted;
  },
};
