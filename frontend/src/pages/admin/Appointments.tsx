import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Calendar, Search } from 'lucide-react'
import toast from 'react-hot-toast'

interface Appointment {
  _id: string
  customer: {
    name: string
    email: string
  }
  appointmentDate: string
  appointmentTime: string
  type: string
  status: string
  optometrist?: {
    name: string
  }
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [statusFilter])

  const fetchAppointments = async () => {
    try {
      const params: any = { limit: 100 }
      if (statusFilter) params.status = statusFilter

      const response = await axios.get('/api/appointments', { params })
      setAppointments(response.data.appointments)
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}`, { status: newStatus })
      toast.success('Appointment status updated')
      fetchAppointments()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update appointment')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'no-show': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Appointments</h1>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Date & Time
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Optometrist
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment, index) => (
                <motion.tr
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {appointment.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {appointment.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {appointment.optometrist?.name || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded border-0 ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-primary-600 hover:underline text-sm">View Details</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

