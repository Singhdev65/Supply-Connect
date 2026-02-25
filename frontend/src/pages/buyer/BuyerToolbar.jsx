const BuyerToolbar = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <input
        className="border p-2 rounded flex-1 min-w-[200px]"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="border p-2 rounded"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="stock">Sort by Stock</option>
      </select>
    </div>
  );
};

export default BuyerToolbar;
