import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchVendorOrdersApi,
  fetchVendorSalesReportApi,
  updateVendorOrderStatusApi,
} from "@/features/vendor/api";

const useVendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportDays, setReportDays] = useState(30);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVendorOrdersApi();
      setOrders(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch vendor orders", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchReport = useCallback(async (days = 30) => {
    setReportLoading(true);
    try {
      const data = await fetchVendorSalesReportApi(days);
      setReport(data?.data || null);
    } catch (error) {
      console.error("Failed to fetch vendor sales report", error);
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(reportDays);
  }, [fetchReport, reportDays]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const data = await updateVendorOrderStatusApi(orderId, status);
    const updatedOrder = data?.data;

    if (updatedOrder?._id) {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)),
      );
    }
    fetchReport(reportDays);
  }, [fetchReport, reportDays]);

  const orderStats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((order) => order.status === "Delivered").length;
    const inTransit = orders.filter((order) =>
      ["Shipped", "Out for Delivery"].includes(order.status),
    ).length;

    return { total, delivered, inTransit };
  }, [orders]);

  return {
    orders,
    loading,
    orderStats,
    report,
    reportLoading,
    reportDays,
    setReportDays,
    updateOrderStatus,
    refreshOrders: fetchOrders,
    refreshReport: fetchReport,
  };
};

export default useVendorOrders;
