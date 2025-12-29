import { useEffect, useState } from 'react'
import axios from 'axios'
import CustomerLayout from '../../components/CustomerLayout'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { FileText, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Prescription {
  _id: string
  eyeType: string
  examDate: string
  expiryDate: string
  optometrist: string
  rightEye: {
    sphere?: number
    cylinder?: number
    axis?: number
    add?: number
    pd?: number
  }
  leftEye: {
    sphere?: number
    cylinder?: number
    axis?: number
    add?: number
    pd?: number
  }
  isActive: boolean
}

export default function CustomerPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    eyeType: 'distance',
    rightEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
    leftEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
    optometrist: '',
    examDate: '',
    expiryDate: ''
  })

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('/api/prescriptions')
      setPrescriptions(response.data.prescriptions)
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const prescriptionData = {
        ...formData,
        rightEye: {
          sphere: parseFloat(formData.rightEye.sphere) || undefined,
          cylinder: parseFloat(formData.rightEye.cylinder) || undefined,
          axis: parseFloat(formData.rightEye.axis) || undefined,
          add: parseFloat(formData.rightEye.add) || undefined,
          pd: parseFloat(formData.rightEye.pd) || undefined
        },
        leftEye: {
          sphere: parseFloat(formData.leftEye.sphere) || undefined,
          cylinder: parseFloat(formData.leftEye.cylinder) || undefined,
          axis: parseFloat(formData.leftEye.axis) || undefined,
          add: parseFloat(formData.leftEye.add) || undefined,
          pd: parseFloat(formData.leftEye.pd) || undefined
        }
      }
      await axios.post('/api/prescriptions', prescriptionData)
      toast.success('Prescription added successfully')
      setShowForm(false)
      setFormData({
        eyeType: 'distance',
        rightEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
        leftEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
        optometrist: '',
        examDate: '',
        expiryDate: ''
      })
      fetchPrescriptions()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add prescription')
    }
  }

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Prescriptions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Prescription</span>
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Prescription
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Eye Type</label>
                  <select
                    className="input"
                    value={formData.eyeType}
                    onChange={(e) => setFormData({ ...formData, eyeType: e.target.value })}
                    required
                  >
                    <option value="distance">Distance</option>
                    <option value="reading">Reading</option>
                    <option value="bifocal">Bifocal</option>
                    <option value="progressive">Progressive</option>
                    <option value="computer">Computer</option>
                  </select>
                </div>
                <div>
                  <label className="label">Optometrist</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.optometrist}
                    onChange={(e) => setFormData({ ...formData, optometrist: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Right Eye</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs">Sphere</label>
                      <input
                        type="number"
                        step="0.25"
                        className="input text-sm"
                        value={formData.rightEye.sphere}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rightEye: { ...formData.rightEye, sphere: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Cylinder</label>
                      <input
                        type="number"
                        step="0.25"
                        className="input text-sm"
                        value={formData.rightEye.cylinder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rightEye: { ...formData.rightEye, cylinder: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Axis</label>
                      <input
                        type="number"
                        className="input text-sm"
                        value={formData.rightEye.axis}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rightEye: { ...formData.rightEye, axis: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label text-xs">PD</label>
                      <input
                        type="number"
                        step="0.5"
                        className="input text-sm"
                        value={formData.rightEye.pd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rightEye: { ...formData.rightEye, pd: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Left Eye</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs">Sphere</label>
                      <input
                        type="number"
                        step="0.25"
                        className="input text-sm"
                        value={formData.leftEye.sphere}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leftEye: { ...formData.leftEye, sphere: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Cylinder</label>
                      <input
                        type="number"
                        step="0.25"
                        className="input text-sm"
                        value={formData.leftEye.cylinder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leftEye: { ...formData.leftEye, cylinder: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label text-xs">Axis</label>
                      <input
                        type="number"
                        className="input text-sm"
                        value={formData.leftEye.axis}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leftEye: { ...formData.leftEye, axis: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="label text-xs">PD</label>
                      <input
                        type="number"
                        step="0.5"
                        className="input text-sm"
                        value={formData.leftEye.pd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leftEye: { ...formData.leftEye, pd: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary">
                  Save Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {prescriptions.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No prescriptions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription, index) => (
              <motion.div
                key={prescription._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {prescription.eyeType} Prescription
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Exam Date: {format(new Date(prescription.examDate), 'MMM dd, yyyy')}
                    </p>
                    {prescription.expiryDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expires: {format(new Date(prescription.expiryDate), 'MMM dd, yyyy')}
                      </p>
                    )}
                    {prescription.optometrist && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Optometrist: {prescription.optometrist}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Right Eye</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {prescription.rightEye.sphere !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Sphere: </span>
                          <span className="font-medium">{prescription.rightEye.sphere}</span>
                        </div>
                      )}
                      {prescription.rightEye.cylinder !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Cylinder: </span>
                          <span className="font-medium">{prescription.rightEye.cylinder}</span>
                        </div>
                      )}
                      {prescription.rightEye.axis !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Axis: </span>
                          <span className="font-medium">{prescription.rightEye.axis}°</span>
                        </div>
                      )}
                      {prescription.rightEye.pd !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">PD: </span>
                          <span className="font-medium">{prescription.rightEye.pd}mm</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Left Eye</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {prescription.leftEye.sphere !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Sphere: </span>
                          <span className="font-medium">{prescription.leftEye.sphere}</span>
                        </div>
                      )}
                      {prescription.leftEye.cylinder !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Cylinder: </span>
                          <span className="font-medium">{prescription.leftEye.cylinder}</span>
                        </div>
                      )}
                      {prescription.leftEye.axis !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Axis: </span>
                          <span className="font-medium">{prescription.leftEye.axis}°</span>
                        </div>
                      )}
                      {prescription.leftEye.pd !== undefined && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">PD: </span>
                          <span className="font-medium">{prescription.leftEye.pd}mm</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

