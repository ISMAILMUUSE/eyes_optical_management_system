import { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../../layouts/DashboardLayout'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Package
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'

interface OverviewStats {
  totalSales: number
  ordersToday: number
  activeCustomers: number
  lowStockProducts: number
  upcomingAppointments: number
  totalProducts?: number
  totalOrders?: number
}

export default function Overview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<OverviewStats>({
    totalSales: 0,
    ordersToday: 0,
    activeCustomers: 0,
    lowStockProducts: 0,
    upcomingAppointments: 0
  })
  const [salesData, setSalesData] = useState<any[]>([])
  const [bestSelling, setBestSelling] = useState<any[]>([])
  const [orderStatus, setOrderStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'admin' || user?.role === 'staff') {
        const [overviewRes, salesRes, productsRes, ordersRes] = await Promise.all([
          axios.get('/api/analytics/overview'),
          axios.get('/api/analytics/sales?months=6'),
          axios.get('/api/analytics/products?limit=5'),
          axios.get('/api/analytics/orders')
        ])

        setStats(overviewRes.data)

        const formattedSales = salesRes.data.map((item: any) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          revenue: item.total,
          orders: item.count
        }))
        setSalesData(formattedSales)
        setBestSelling(productsRes.data)
        setOrderStatus(ordersRes.data)
      } else {
        // Customer view - get their own data
        const [ordersRes, prescriptionsRes, appointmentsRes] = await Promise.all([
          axios.get('/api/orders?limit=1'),
          axios.get('/api/prescriptions?limit=1'),
          axios.get('/api/appointments?status=scheduled,confirmed')
        ])

        // Count upcoming appointments (scheduled or confirmed, in the future)
        const upcomingCount = appointmentsRes.data.appointments?.filter((apt: any) => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= new Date() && (apt.status === 'scheduled' || apt.status === 'confirmed');
        }).length || 0;

        setStats({
          totalSales: 0,
          ordersToday: 0,
          activeCustomers: 0,
          lowStockProducts: 0,
          upcomingAppointments: upcomingCount,
          totalOrders: ordersRes.data.pagination?.total || 0,
          totalProducts: prescriptionsRes.data.prescriptions?.length || prescriptionsRes.data.pagination?.total || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'staff'

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className={`grid ${isAdmin ? 'md:grid-cols-2 lg:grid-cols-5' : 'md:grid-cols-3'} gap-6 mb-8`}>
          {isAdmin ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${stats.totalSales.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Orders Today</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.ordersToday}
                    </p>
                  </div>
                  <ShoppingBag className="w-10 h-10 text-blue-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Customers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.activeCustomers}
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Low Stock Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.lowStockProducts}
                    </p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-orange-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upcoming Appointments</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.upcomingAppointments}
                    </p>
                  </div>
                  <Calendar className="w-10 h-10 text-cyan-600" />
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalOrders || 0}
                    </p>
                  </div>
                  <ShoppingBag className="w-10 h-10 text-primary-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prescriptions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalProducts || 0}
                    </p>
                  </div>
                  <Package className="w-10 h-10 text-primary-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upcoming Appointments</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.upcomingAppointments}
                    </p>
                  </div>
                  <Calendar className="w-10 h-10 text-primary-600" />
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Charts - Only for Admin/Staff */}
        {isAdmin && (
          <>
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Sales Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Monthly Sales</span>
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Order Status Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Order Status Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatus}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {orderStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Best Selling Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Best Selling Products
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Units Sold
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestSelling.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {item.product.images && item.product.images[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <span className="text-gray-900 dark:text-white">{item.product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.totalSold}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          ${item.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

