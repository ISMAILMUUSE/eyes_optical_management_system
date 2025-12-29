import { useState, useEffect } from 'react'
import axios from 'axios'
import CustomerLayout from '../../components/CustomerLayout'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function CustomerProfile() {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    dateOfBirth: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: (user as any).address?.street || '',
          city: (user as any).address?.city || '',
          state: (user as any).address?.state || '',
          zipCode: (user as any).address?.zipCode || ''
        },
        dateOfBirth: (user as any).dateOfBirth || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.put('/api/auth/profile', formData)
      updateUser(response.data)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CustomerLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>

        <div className="card max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                className="input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                className="input"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Street</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.address.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Zip Code</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, zipCode: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </motion.div>
    </CustomerLayout>
  )
}

