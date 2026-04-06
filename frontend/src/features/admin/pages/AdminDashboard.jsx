import { useEffect, useState } from "react";
import { fetchAdminAnalyticsApi, fetchAdminTicketsApi, fetchAdminUsersApi } from "@/features/admin/api";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [analyticsData, usersData, ticketsData] = await Promise.all([
          fetchAdminAnalyticsApi(),
          fetchAdminUsersApi({ page: 1, limit: 5 }),
          fetchAdminTicketsApi({ page: 1, limit: 5 }),
        ]);
        setAnalytics(analyticsData || null);
        setUsers(usersData?.data || []);
        setTickets(ticketsData?.data || []);
      } catch (error) {
        console.error("Failed to load admin dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-600">Loading admin dashboard...</div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="text-xl font-semibold text-gray-900">
            Rs {Number(analytics?.sales?.revenue || 0).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Orders</p>
          <p className="text-xl font-semibold text-gray-900">{analytics?.sales?.orders || 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Sellers</p>
          <p className="text-xl font-semibold text-gray-900">{analytics?.sellerCount || 0}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Buyers</p>
          <p className="text-xl font-semibold text-gray-900">{analytics?.buyerCount || 0}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Latest Users</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user._id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email} • {user.role}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Support Tickets</h2>
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <p className="font-medium text-gray-900">{ticket.subject}</p>
                <p className="text-xs text-gray-600">
                  {ticket.status} • {ticket.priority} • {ticket.ticketNo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
