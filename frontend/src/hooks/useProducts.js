import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import { socket } from "../utils/socket";
import { updateStock } from "../store/productsSlice";

const useProducts = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => {
    return state.products;
  });

  useEffect(() => {
    dispatch(fetchProducts());

    socket.on("stockUpdated", (data) => {
      dispatch(updateStock(data));
    });

    return () => socket.off("stockUpdated");
  }, [dispatch]);

  return {
    products: items?.data,
    loading,
    error,
  };
};

export default useProducts;
