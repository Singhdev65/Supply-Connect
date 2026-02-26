const OrderLoadingCard = ({ text = "Loading..." }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
      {text}
    </div>
  );
};

export default OrderLoadingCard;
