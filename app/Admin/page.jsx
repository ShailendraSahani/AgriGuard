"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  RefreshCw,
  Activity,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);

  // State for all data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    usersGrowth: 0,
    ordersGrowth: 0,
    productsGrowth: 0,
    revenueGrowth: 0,
  });

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Check admin role
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session || session.user.role !== "admin") {
      router.push("/login");
    }
  }, [session, status, router]);

  // Fetch data on mount
  useEffect(() => {
    if (status !== "loading" && session && session.user.role === "admin") {
      fetchData();
    }
  }, [status, session]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  // Don't render if not admin
  if (!session || session.user.role !== "admin") {
    return null;
  }

  // Fetch all data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats');
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders');
      if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);

      // Fetch products
      const productsResponse = await fetch('/api/admin/products');
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      const productsData = await productsResponse.json();
      setProducts(productsData);

      // Fetch services
      const servicesResponse = await fetch('/api/admin/services');
      if (!servicesResponse.ok) throw new Error('Failed to fetch services');
      const servicesData = await servicesResponse.json();
      setServices(servicesData);

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/activity');
      if (!activityResponse.ok) throw new Error('Failed to fetch activity');
      const activityData = await activityResponse.json();
      setRecentActivity(activityData);

      // Fetch alerts
      const alertsResponse = await fetch('/api/admin/alerts');
      if (!alertsResponse.ok) throw new Error('Failed to fetch alerts');
      const alertsData = await alertsResponse.json();
      setAlerts(alertsData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(product => product.id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete service');
      
      setServices(services.filter(service => service.id !== serviceId));
      alert('Service deleted successfully');
    } catch (err) {
      alert('Error deleting service: ' + err.message);
    }
  };

  // Update status handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update order');
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      alert('Order status updated successfully');
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  // Export data
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/export/${activeTab}`);
      if (!response.ok) throw new Error('Failed to export data');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Error exporting data: ' + err.message);
    }
  };

  // Filter and search logic
  const getFilteredData = (data) => {
    if (!data) return [];
    
    let filtered = data;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => 
        item.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    
    return filtered;
  };

  const StatCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            ) : (
              value
            )}
          </h3>
          {!loading && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-semibold">
                +{growth}%
              </span>
              <span className="text-gray-400 text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "delivered":
      case "available":
        return "bg-green-100 text-green-800";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
      case "out of stock":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = getFilteredData(users);
  const filteredOrders = getFilteredData(orders);
  const filteredProducts = getFilteredData(products);
  const filteredServices = getFilteredData(services);

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-green-100 mt-1">
                Manage your AgriGuard platform
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            growth={stats.usersGrowth}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            growth={stats.ordersGrowth}
            icon={ShoppingCart}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Products Listed"
            value={stats.totalProducts.toLocaleString()}
            growth={stats.productsGrowth}
            icon={Package}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
            growth={stats.revenueGrowth}
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            {["overview", "users", "orders", "products", "services"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        {activeTab !== "overview" && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="processing">Processing</option>
              </select>
              <button 
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading && activeTab !== "overview" ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Platform Overview
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                          recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                activity.type === 'user' ? 'bg-green-500' :
                                activity.type === 'order' ? 'bg-blue-500' :
                                'bg-purple-500'
                              }`}></div>
                              <div>
                                <p className="text-gray-800 font-medium">
                                  {activity.message}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  {activity.time}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No recent activity
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        Alerts & Notifications
                      </h3>
                      <div className="space-y-4">
                        {alerts.length > 0 ? (
                          alerts.map((alert, index) => (
                            <div
                              key={index}
                              className={`rounded-lg p-4 border ${
                                alert.type === 'warning'
                                  ? 'bg-yellow-50 border-yellow-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}
                            >
                              <p className={`font-medium ${
                                alert.type === 'warning'
                                  ? 'text-yellow-800'
                                  : 'text-blue-800'
                              }`}>
                                {alert.title}
                              </p>
                              <p className={`text-sm mt-1 ${
                                alert.type === 'warning'
                                  ? 'text-yellow-700'
                                  : 'text-blue-700'
                              }`}>
                                {alert.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">
                            No alerts
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Orders
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-800 font-medium">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.role}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  user.status
                                )}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.orders || 0}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => window.location.href = `/admin/users/${user.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => window.location.href = `/admin/users/${user.id}/edit`}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-800 font-medium">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.customer}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.product}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.quantity}
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-semibold">
                              ₹{order.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => window.location.href = `/admin/orders/${order.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => window.location.href = `/admin/orders/${order.id}/edit`}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "products" && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Product Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Seller
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-800 font-medium">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-semibold">
                              ₹{product.price}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {product.stock} kg
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {product.seller}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  product.status
                                )}`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => window.location.href = `/admin/products/${product.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => window.location.href = `/admin/products/${product.id}/edit`}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "services" && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Service Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Provider
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Bookings
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Rating
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                          <tr key={service.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-800 font-medium">
                              {service.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {service.provider}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {service.bookings}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-gray-800 font-semibold">
                                  {service.rating}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  service.status
                                )}`}
                              >
                                {service.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => window.location.href = `/admin/services/${service.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => window.location.href = `/admin/services/${service.id}/edit`}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteService(service.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            No services found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}