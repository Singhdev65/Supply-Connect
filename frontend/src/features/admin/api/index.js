import API from "@/api/api";

export const fetchAdminAnalyticsApi = async () => {
  const { data } = await API.get("/admin/analytics/overview");
  return data?.data;
};

export const fetchAdminUsersApi = async (params = {}) => {
  const { data } = await API.get("/admin/users", { params });
  return data?.data;
};

export const fetchAdminTicketsApi = async (params = {}) => {
  const { data } = await API.get("/admin/support/tickets", { params });
  return data?.data;
};
