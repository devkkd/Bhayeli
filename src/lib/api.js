/**
 * Centralized data-fetching utility for Bhayeli storefront.
 * All server components import from here — one place to change caching strategy.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// ── Single call: fetch categories + ALL products together ──────────────────
export async function fetchCatalog() {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${BASE}/api/categories`, { cache: 'no-store' }),
      fetch(`${BASE}/api/products`,   { cache: 'no-store' }),
    ]);
    const [catData, prodData] = await Promise.all([catRes.json(), prodRes.json()]);
    return {
      categories: catData.success  ? catData.data  : [],
      products:   prodData.success ? prodData.data : [],
    };
  } catch {
    return { categories: [], products: [] };
  }
}

// ── Categories ─────────────────────────────────────────────────────────────
export async function fetchCategories() {
  try {
    const res = await fetch(`${BASE}/api/categories`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

// ── Products (optionally filtered by categorySlug or search) ──────────────
export async function fetchProducts({ categorySlug, search } = {}) {
  try {
    const params = new URLSearchParams();
    if (categorySlug) params.set('categorySlug', categorySlug);
    if (search)       params.set('search', search);
    const qs = params.toString() ? `?${params}` : '';
    const res = await fetch(`${BASE}/api/products${qs}`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

// ── Single product by ID or slug ───────────────────────────────────────────
export async function fetchProductById(idOrSlug) {
  try {
    const res = await fetch(`${BASE}/api/products/${idOrSlug}`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch { return null; }
}

// ── Collections ────────────────────────────────────────────────────────────
export async function fetchCollections() {
  try {
    const res = await fetch(`${BASE}/api/collections`, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch { return []; }
}

// ── Key attribute field map (model field → display label) ──────────────────
export const KEY_ATTRIBUTES = [
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
  { field: 'materialRight',     label: 'Material (Alt)' },
  { field: 'deliveryTime',      label: 'Delivery Time' },
  { field: 'quality',           label: 'Quality' },
];

/**
 * Builds the display list for the Key Attributes table on the product page.
 * Merges named fields (non-empty) + extra attributes[] array.
 */
export function buildAttributeList(product) {
  const named = KEY_ATTRIBUTES
    .map(({ field, label }) => ({ label, value: product[field] || '' }))
    .filter(a => a.value.trim() !== '');
  const extra = (product.attributes || []).filter(a => a.value?.trim());
  return [...named, ...extra];
}
