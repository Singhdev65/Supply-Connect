const StepBasicInfo = ({ product, setProduct }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
      <input
        className="w-full mb-3 p-3 border rounded-lg"
        placeholder="Product Name"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <textarea
        className="w-full p-3 border rounded-lg"
        placeholder="Description"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
      />
    </>
  );
};

export default StepBasicInfo;