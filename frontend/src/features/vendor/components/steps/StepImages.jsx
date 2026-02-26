import StepWrapper from "./StepWrapper";
import { Upload, X } from "lucide-react";

const StepImages = ({
  product,
  uploadImage,
  removeImage,
  toggleBannerImage,
  uploading,
  errors = {},
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadImage(file);
  };

  const images = product.images || [];
  const bannerImages = product.bannerImages || [];

  return (
    <StepWrapper title="Product Images" subtitle="Clear images increase sales">
      <div className="space-y-6">
        {/* UPLOAD */}
        <label className="cursor-pointer block">
          <div className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center bg-gray-50 hover:bg-gray-100">
            <Upload size={28} className="text-gray-400" />
            <p className="text-sm mt-2 text-gray-600">Upload Product Image</p>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </label>

        {uploading && <p className="text-blue-600 text-sm">Uploading...</p>}

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img}
              className="relative group rounded-xl overflow-hidden"
            >
              <img src={img} className="h-28 w-full object-cover" />

              <label className="absolute left-2 bottom-2 rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-700 shadow">
                <input
                  type="checkbox"
                  className="mr-1 align-middle"
                  checked={bannerImages.includes(img)}
                  onChange={() => toggleBannerImage(img)}
                />
                Banner
              </label>

              <button
                onClick={() => removeImage(img)}
                className="absolute top-2 right-2 bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {errors.images && <p className="text-xs text-red-600">{errors.images}</p>}
        {errors.bannerImages && <p className="text-xs text-red-600">{errors.bannerImages}</p>}
      </div>
    </StepWrapper>
  );
};

export default StepImages;
