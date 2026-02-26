import { PRODUCT_CATEGORY_OPTIONS, PRODUCT_SUBCATEGORY_OPTIONS } from "@/utils/constants";

const CATEGORY_VALUES = PRODUCT_CATEGORY_OPTIONS.map((item) => item.value);
const SUBCATEGORY_VALUES = Object.values(PRODUCT_SUBCATEGORY_OPTIONS).flat().map((item) => item.value);

const REQUIRED_VARIANT_FIELDS_BY_CATEGORY = {
  "grocery-daily-essentials": ["brand", "packSize", "type"],
  "fashion-apparel": ["size", "color", "material"],
  electronics: ["brand", "model", "ram", "storage", "color"],
  "books-stationery": ["author", "publisher", "language", "edition"],
  "home-living": ["brand", "material", "color"],
  "beauty-personal-care": ["brand", "type"],
  "toys-sports-baby-care": ["brand", "material", "color"],
};

export const validateProductStep = (step, product) => {
  const errors = {};

  if (step === 0) {
    if (!product.name?.trim()) errors.name = "Product name is required";
    if (!product.category || !CATEGORY_VALUES.includes(product.category)) {
      errors.category = "Select a valid category";
    }
    const allowedSubcategories = PRODUCT_SUBCATEGORY_OPTIONS[product.category] || [];
    if (!product.subcategory || !SUBCATEGORY_VALUES.includes(product.subcategory)) {
      errors.subcategory = "Select a valid subcategory";
    } else if (!allowedSubcategories.some((item) => item.value === product.subcategory)) {
      errors.subcategory = "Subcategory must belong to selected category";
    }
    if (!product.description?.trim()) errors.description = "Description is required";
  }

  if (step === 1) {
    const price = Number(product.price);
    const stock = Number(product.stock);
    if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be greater than 0";
    if (!Number.isFinite(stock) || stock < 0) errors.stock = "Stock cannot be negative";
  }

  if (step === 2 && Array.isArray(product.variants) && product.variants.length > 0) {
    const requiredFields = REQUIRED_VARIANT_FIELDS_BY_CATEGORY[product.category] || [];
    const hasInvalidVariant = product.variants.some((variant) =>
      requiredFields.some((field) => !String(variant?.[field] || "").trim()),
    );
    if (hasInvalidVariant) {
      errors.variants = "Fill all required fields for each variant";
    }
  }

  if (step === 3 && (!product.images || product.images.length === 0)) {
    errors.images = "At least one product image is required";
  }
  if (step === 3 && (!product.bannerImages || product.bannerImages.length === 0)) {
    errors.bannerImages = "Select at least one banner image";
  }

  return errors;
};

export const validateProductForSubmit = (product) => {
  return {
    ...validateProductStep(0, product),
    ...validateProductStep(1, product),
    ...validateProductStep(2, product),
    ...validateProductStep(3, product),
  };
};
