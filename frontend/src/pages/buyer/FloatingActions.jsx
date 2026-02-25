const FloatingActions = ({ cartCount, onCartOpen }) => {
  return (
    <>
      <button
        onClick={onCartOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 text-white shadow-xl"
      >
        🛒
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2">
            {cartCount}
          </span>
        )}
      </button>
    </>
  );
};

export default FloatingActions;
