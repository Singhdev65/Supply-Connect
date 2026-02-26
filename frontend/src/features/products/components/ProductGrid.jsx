import { useMemo } from "react";
import { Grid, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import ProductCard from "./ProductCard";

const ITEM_HEIGHT = 420;

const ProductGrid = ({
  products,
  cart,
  onAdd,
  onRemove,
  startChat,
  onOpenProduct,
  onEndReached,
  hasMore = false,
  loadingMore = false,
}) => {
  const cartMap = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      map[item._id] = item.qty;
    });
    return map;
  }, [cart]);

  return (
    <div style={{ height: 760 }}>
      <AutoSizer>
        {({ width, height }) => {
          const columnCount =
            width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4;
          const columnWidth = Math.floor(width / columnCount);
          const rowCount = Math.ceil(products.length / columnCount);

          return (
            <Grid
              width={width}
              height={height}
              columnCount={columnCount}
              columnWidth={columnWidth}
              rowCount={rowCount}
              rowHeight={ITEM_HEIGHT}
              overscanRowCount={2}
              onScroll={({ clientHeight, scrollHeight, scrollTop }) => {
                const nearBottom = scrollTop + clientHeight >= scrollHeight - ITEM_HEIGHT * 1.5;
                if (nearBottom && hasMore && !loadingMore) {
                  onEndReached?.();
                }
              }}
              cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                const index = rowIndex * columnCount + columnIndex;
                if (index >= products.length) return null;

                const product = products[index];

                return (
                  <div key={key} style={{ ...style, padding: 8 }}>
                    <ProductCard
                      product={product}
                      cartQty={cartMap[product._id] || 0}
                      onAdd={() => onAdd(product)}
                      onRemove={() => onRemove(product)}
                      startChat={startChat}
                      onOpenProduct={() => onOpenProduct?.(product)}
                    />
                  </div>
                );
              }}
            />
          );
        }}
      </AutoSizer>
      {loadingMore && (
        <div className="py-3 text-center text-sm text-gray-500">Loading more products...</div>
      )}
    </div>
  );
};

export default ProductGrid;
