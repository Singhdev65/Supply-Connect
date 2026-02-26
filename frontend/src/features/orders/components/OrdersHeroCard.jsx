const OrdersHeroCard = ({ title, subtitle }) => {
  return (
    <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-[#fff7ed] to-[#fffbeb] p-5">
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
      {subtitle ? <p className="text-sm text-gray-600">{subtitle}</p> : null}
    </div>
  );
};

export default OrdersHeroCard;
