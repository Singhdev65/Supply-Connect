const ProductDetailsGallery = ({
  images = [],
  activeImage,
  onImageChange,
  altText = "Product",
}) => {
  if (!images.length) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="overflow-hidden rounded-xl bg-gray-100">
        <img
          src={activeImage || images[0]}
          alt={altText}
          className="h-[420px] w-full object-cover"
        />
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((image) => (
          <button
            key={image}
            onClick={() => onImageChange(image)}
            className={`overflow-hidden rounded-lg border ${
              activeImage === image ? "border-blue-600" : "border-gray-200"
            }`}
          >
            <img src={image} alt={altText} className="h-16 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsGallery;
