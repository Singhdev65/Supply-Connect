import { useState } from "react";
import {
  createVendorProductApi,
  updateVendorProductApi,
} from "@/features/vendor/api";
import { validateProductForSubmit, validateProductStep } from "@/features/vendor/utils/productValidators";
import { PRODUCT_CATEGORY_OPTIONS, PRODUCT_SUBCATEGORY_OPTIONS } from "@/utils/constants";

const defaultCategory = PRODUCT_CATEGORY_OPTIONS[0].value;
const defaultSubcategory = PRODUCT_SUBCATEGORY_OPTIONS[defaultCategory]?.[0]?.value || "";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const initialProduct = {
  name: "",
  category: defaultCategory,
  subcategory: defaultSubcategory,
  description: "",
  price: "",
  stock: "",
  variants: [],
  images: [],
  bannerImages: [],
};

const useVendorProductsWizard = (onSuccess) => {
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState(initialProduct);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const goToFirstErrorStep = (nextErrors) => {
    if (nextErrors.name || nextErrors.description) {
      setStep(0);
      return;
    }
    if (nextErrors.price || nextErrors.stock) {
      setStep(1);
      return;
    }
    if (nextErrors.variants) {
      setStep(2);
      return;
    }
    if (nextErrors.images || nextErrors.bannerImages) {
      setStep(3);
    }
  };

  const next = () => {
    const nextErrors = validateProductStep(step, product);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return false;
    setStep((s) => s + 1);
    return true;
  };

  const prev = () => setStep((s) => s - 1);

  const uploadImage = async (file) => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      setProduct((p) => ({
        ...p,
        images: [...p.images, data.secure_url],
        bannerImages: [...p.bannerImages, data.secure_url],
      }));
      setErrors((prevErrors) => ({ ...prevErrors, images: "", bannerImages: "" }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setProduct((p) => ({
      ...p,
      images: p.images.filter((img) => img !== url),
      bannerImages: p.bannerImages.filter((img) => img !== url),
    }));
  };

  const toggleBannerImage = (url) => {
    setProduct((p) => {
      const isSelected = p.bannerImages.includes(url);
      const nextBannerImages = isSelected
        ? p.bannerImages.filter((img) => img !== url)
        : [...p.bannerImages, url];
      return { ...p, bannerImages: nextBannerImages };
    });
    setErrors((prevErrors) => ({ ...prevErrors, bannerImages: "" }));
  };

  const submit = async () => {
    const submitErrors = validateProductForSubmit(product);
    setErrors(submitErrors);
    if (Object.keys(submitErrors).length) {
      goToFirstErrorStep(submitErrors);
      throw new Error("Validation failed");
    }

    setSaving(true);

    const payload = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      isPublished: true,
    };

    let res;
    if (product._id) {
      res = await updateVendorProductApi(product._id, payload);
    } else {
      res = await createVendorProductApi(payload);
    }

    setSaving(false);
    return res?.data;
  };

  return {
    step,
    product,
    setProduct,
    next,
    prev,
    submit,
    uploadImage,
    removeImage,
    toggleBannerImage,
    uploading,
    saving,
    errors,
    setErrors,
  };
};

export default useVendorProductsWizard;
