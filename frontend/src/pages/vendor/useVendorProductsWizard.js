import { useState } from "react";
import API from "../../api/api";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const initialProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  variants: [],
  images: [],
};

const useVendorProductsWizard = (onSuccess) => {
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState(initialProduct);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const next = () => setStep((s) => s + 1);
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
      }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setProduct((p) => ({
      ...p,
      images: p.images.filter((img) => img !== url),
    }));
  };

  const submit = async () => {
    setSaving(true);

    const payload = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      isPublished: true,
    };

    let res;
    if (product._id) {
      res = await API.put(`/products/${product._id}`, payload);
    } else {
      res = await API.post("/products", payload);
    }

    setSaving(false);
    return res.data?.data;
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
    uploading,
    saving,
  };
};

export default useVendorProductsWizard;
