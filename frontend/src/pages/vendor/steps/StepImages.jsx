const StepImages = ({ product, uploadImage, removeImage, uploading }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Product Images</h2>

      <label className="block w-full cursor-pointer">
        <input
          type="file"
          accept="image/*"
          hidden
          disabled={uploading}
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50">
          <p className="text-gray-600">
            {uploading ? "Uploading..." : "Click to upload image"}
          </p>
        </div>
      </label>

      {product.images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {product.images.map((img) => (
            <div key={img} className="relative group">
              <img src={img} className="h-32 w-full object-cover rounded-xl" />

              <button
                onClick={() => removeImage(img)}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default StepImages;
