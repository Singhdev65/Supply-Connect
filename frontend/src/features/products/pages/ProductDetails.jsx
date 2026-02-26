import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProductDetails } from "@/features/products/hooks";
import { useProductReviews } from "@/features/reviews/hooks";
import { ProductReviewsSection } from "@/features/reviews/components";
import {
  ProductDetailsGallery,
  ProductDetailsHeader,
  ProductDetailsOptions,
  ProductDetailsSpecs,
  ProductPurchaseSidebar,
} from "@/features/products/components/details";

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const reviewSectionRef = useRef(null);
  const {
    loading,
    product,
    activeImage,
    setActiveImage,
    selectedOptions,
    setSelectedOptions,
    selectableFields,
    variantOptions,
    variantDetails,
    cartQty,
    addToCart,
    removeFromCart,
    goBackToBoard,
    handleStartChat,
    userRole,
    userId,
  } = useProductDetails();

  const reviewsState = useProductReviews({
    productId: product?._id,
    role: userRole,
    userId,
  });

  useEffect(() => {
    if (searchParams.get("review") !== "1") return;
    if (loading) return;
    setTimeout(() => {
      reviewSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, [searchParams, loading]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return <div className="p-6 text-sm text-gray-500">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <button
          onClick={goBackToBoard}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to products
        </button>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <ProductDetailsHeader
              category={product.category}
              subcategory={product.subcategory}
              name={product.name}
              description={product.description}
            />

            <ProductDetailsGallery
              images={product.images || []}
              activeImage={activeImage}
              onImageChange={setActiveImage}
              altText={product.name}
            />

            <ProductDetailsOptions
              selectableFields={selectableFields}
              selectedOptions={selectedOptions}
              variantOptions={variantOptions}
              onSelectOption={(field, option) =>
                setSelectedOptions((prev) => ({ ...prev, [field]: option }))
              }
            />

            <ProductDetailsSpecs variantDetails={variantDetails} />

            <div ref={reviewSectionRef}>
              <ProductReviewsSection
                summary={reviewsState.summary}
                reviews={reviewsState.reviews}
                loading={reviewsState.loading}
                canWriteReview={reviewsState.canWriteReview}
                canWriteReviewReason={reviewsState.canWriteReviewReason}
                canRespond={reviewsState.canRespond}
                ownReview={reviewsState.ownReview}
                reviewForm={reviewsState.reviewForm}
                setReviewForm={reviewsState.setReviewForm}
                saving={reviewsState.saving}
                respondingReviewId={reviewsState.respondingReviewId}
                onSubmitReview={reviewsState.submitReview}
                onRespondReview={reviewsState.respondToReview}
                vendorOwnsProduct={userRole === "vendor"}
              />
            </div>
          </div>

          <ProductPurchaseSidebar
            price={product.price}
            stock={product.stock}
            cartQty={cartQty}
            onAdd={() => addToCart(product)}
            onRemove={() => removeFromCart(product)}
            onChatSeller={handleStartChat}
            vendorName={product.vendor?.name || product.vendor?.email}
            isBuyerView={userRole === "buyer"}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
