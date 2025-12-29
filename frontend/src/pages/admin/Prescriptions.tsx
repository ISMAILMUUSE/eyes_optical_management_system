import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { FileText, Search } from 'lucide-react'

interface Prescription {
  _id: string
  customer: {
    name: string
    email: string
  }
  eyeType: string
  examDate: string
  expiryDate: string
  optometrist: string
  isActive: boolean
}

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('/api/prescriptions', { params: { limit: 100 } })
      setPrescriptions(response.data.prescriptions)
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Prescriptions</h1>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Exam Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Expiry Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Optometrist
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map((prescription, index) => (
                <motion.tr
                  key={prescription._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {prescription.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {prescription.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {prescription.eyeType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {format(new Date(prescription.examDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {prescription.expiryDate
                      ? format(new Date(prescription.expiryDate), 'MMM dd, yyyy')
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {prescription.optometrist || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-primary-600 hover:underline text-sm">View Details</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">No prescriptions found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

