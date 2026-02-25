const StepPricingStock = ({ product, setProduct }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Pricing & Stock</h2>
      <input
        type="number"
        className="w-full mb-3 p-3 border rounded-lg"
        placeholder="Price"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />
      <input
        type="number"
        className="w-full p-3 border rounded-lg"
        placeholder="Total Stock"
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
      />
    </>
  );
};

export default StepPricingStock;