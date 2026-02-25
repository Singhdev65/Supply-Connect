import { Grid, AutoSizer } from "react-virtualized";
import { useMemo } from "react";
import ProductCard from "../../components/ProductCard";

const ITEM_HEIGHT = 380;

const ProductGrid = ({ products, cart, onAdd, onRemove, startChat }) => {
  const cartMap = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      map[item._id] = item.qty;
    });
    return map;
  }, [cart]);

  return (
    <div style={{ height: 700 }}>
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
                      startChat={() => startChat(product.vendor?._id)}
                    />
                  </div>
                );
              }}
            />
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default ProductGrid;
