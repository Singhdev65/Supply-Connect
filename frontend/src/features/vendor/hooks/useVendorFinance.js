import { useCallback, useEffect, useState } from "react";
import {
  fetchFinancePayoutsApi,
  fetchFinanceSummaryApi,
  fetchFinanceTaxReportApi,
  fetchFinanceTransactionsApi,
  requestFinancePayoutApi,
} from "@/features/vendor/api";

const useVendorFinance = () => {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsMeta, setTransactionsMeta] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [taxReport, setTaxReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");

  const fetchSummary = useCallback(async (selectedDays = days) => {
    const res = await fetchFinanceSummaryApi(selectedDays);
    setSummary(res?.data || null);
  }, [days]);

  const fetchTransactions = useCallback(async (selectedDays = days, page = 1) => {
    const res = await fetchFinanceTransactionsApi({ days: selectedDays, page, limit: 20 });
    setTransactions(res?.data?.data || []);
    setTransactionsMeta(res?.data?.meta || null);
  }, [days]);

  const fetchPayouts = useCallback(async () => {
    const res = await fetchFinancePayoutsApi();
    setPayouts(res?.data || []);
  }, []);

  const fetchTaxReport = useCallback(async (selectedDays = days) => {
    const res = await fetchFinanceTaxReportApi(selectedDays);
    setTaxReport(res?.data || null);
  }, [days]);

  const refresh = useCallback(async (selectedDays = days) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSummary(selectedDays),
        fetchTransactions(selectedDays, 1),
        fetchPayouts(),
        fetchTaxReport(Math.max(90, selectedDays)),
      ]);
    } finally {
      setLoading(false);
    }
  }, [days, fetchPayouts, fetchSummary, fetchTaxReport, fetchTransactions]);

  useEffect(() => {
    refresh(days);
  }, [days, refresh]);

  const requestPayout = useCallback(async () => {
    const amount = Number(requestAmount || 0);
    if (!amount || amount <= 0) return;
    setRequesting(true);
    try {
      await requestFinancePayoutApi({ amount });
      setRequestAmount("");
      await refresh(days);
    } finally {
      setRequesting(false);
    }
  }, [days, refresh, requestAmount]);

  return {
    days,
    setDays,
    summary,
    transactions,
    transactionsMeta,
    payouts,
    taxReport,
    loading,
    requesting,
    requestAmount,
    setRequestAmount,
    requestPayout,
    refresh,
  };
};

export default useVendorFinance;
