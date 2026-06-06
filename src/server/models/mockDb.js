/**
 * Empty in-memory fallback store.
 * No seed data — when MongoDB is unavailable, returns empty arrays
 * so the UI shows empty state rather than stale dummy data.
 */

let mockCollections = [];
let mockProducts    = [];
let mockCategories  = [];

export const MockCategory = {
  find: async (query = {}) => {
    let r = [...mockCategories];
    Object.keys(query).forEach(k => { r = r.filter(i => i[k] === query[k]); });
    return r;
  },
  findOne: async (query = {}) => (await MockCategory.find(query))[0] || null,
  findById: async (id) => mockCategories.find(i => i._id === id) || null,
  create: async (data) => {
    const item = { _id: `cat_${Date.now()}`, createdAt: new Date(), ...data };
    mockCategories.push(item); return item;
  },
  findByIdAndUpdate: async (id, upd) => {
    const idx = mockCategories.findIndex(i => i._id === id);
    if (idx === -1) return null;
    mockCategories[idx] = { ...mockCategories[idx], ...upd };
    return mockCategories[idx];
  },
  findByIdAndDelete: async (id) => {
    const idx = mockCategories.findIndex(i => i._id === id);
    if (idx === -1) return null;
    return mockCategories.splice(idx, 1)[0];
  },
};

export const MockCollection = {
  find: async (query = {}) => {
    let r = [...mockCollections];
    Object.keys(query).forEach(k => { r = r.filter(i => i[k] === query[k]); });
    return r;
  },
  findOne: async (query = {}) => (await MockCollection.find(query))[0] || null,
  create: async (data) => {
    const item = { _id: `col_${Date.now()}`, createdAt: new Date(), ...data };
    mockCollections.push(item); return item;
  },
};

export const MockProduct = {
  find: async (query = {}) => {
    let r = [...mockProducts];
    if (query.$or) {
      r = r.filter(item => query.$or.some(cond => {
        const k = Object.keys(cond)[0];
        const v = cond[k];
        return v instanceof RegExp ? v.test(item[k]) : item[k] === v;
      }));
    } else {
      Object.keys(query).forEach(k => { r = r.filter(i => i[k] === query[k]); });
    }
    return r;
  },
  findOne: async (query = {}) => (await MockProduct.find(query))[0] || null,
  findById: async (id) => mockProducts.find(i => i._id === id) || null,
  create: async (data) => {
    const slug = (data.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const item = { _id: `prod_${Date.now()}`, slug, createdAt: new Date(), ...data };
    mockProducts.push(item); return item;
  },
  findByIdAndUpdate: async (id, upd) => {
    const idx = mockProducts.findIndex(i => i._id === id);
    if (idx === -1) return null;
    mockProducts[idx] = { ...mockProducts[idx], ...upd };
    return mockProducts[idx];
  },
  findByIdAndDelete: async (id) => {
    const idx = mockProducts.findIndex(i => i._id === id);
    if (idx === -1) return null;
    return mockProducts.splice(idx, 1)[0];
  },
};
