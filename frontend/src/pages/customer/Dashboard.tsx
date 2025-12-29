import { useEffect, useState } from 'react'
import axios from 'axios'
import CustomerLayout from '../../components/CustomerLayout'
import { motion } from 'framer-motion'
import { ShoppingBag, FileText, Calendar, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalPrescriptions: 0,
    upcomingAppointments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, prescriptionsRes, appointmentsRes] = await Promise.all([
          axios.get('/api/orders?limit=1'),
          axios.get('/api/prescriptions?limit=1'),
          axios.get('/api/appointments?status=scheduled,confirmed')
        ])

        setStats({
          totalOrders: ordersRes.data.pagination.total,
          totalPrescriptions: prescriptionsRes.data.pagination.total,
          upcomingAppointments: appointmentsRes.data.appointments.length
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-primary-600" />
            </div>
            <Link
              to="/customer/orders"
              className="mt-4 text-sm text-primary-600 hover:underline inline-block"
            >
              View all orders →
            </Link>
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPrescriptions}
                </p>
              </div>
              <FileText className="w-12 h-12 text-primary-600" />
            </div>
            <Link
              to="/customer/prescriptions"
              className="mt-4 text-sm text-primary-600 hover:underline inline-block"
            >
              Manage prescriptions →
            </Link>
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-primary-600" />
            </div>
            <Link
              to="/customer/appointments"
              className="mt-4 text-sm text-primary-600 hover:underline inline-block"
            >
              View appointments →
            </Link>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/customer/appointments"
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-500 transition-colors text-center"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-gray-900 dark:text-white">Book Eye Test</p>
            </Link>
            <Link
              to="/customer/prescriptions"
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-600 dark:hover:border-primary-500 transition-colors text-center"
            >
              <Eye className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-gray-900 dark:text-white">Upload Prescription</p>
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}

