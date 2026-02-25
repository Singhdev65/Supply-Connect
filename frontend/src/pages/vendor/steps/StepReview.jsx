const StepReview = ({ product }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Review</h2>
      <pre className="bg-gray-100 p-4 rounded-xl text-sm overflow-auto">
        {JSON.stringify(product, null, 2)}
      </pre>
    </>
  );
};

export default StepReview;