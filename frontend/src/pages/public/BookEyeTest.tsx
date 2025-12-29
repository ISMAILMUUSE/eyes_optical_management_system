import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout'
import { Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

export default function BookEyeTest() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    type: 'eye-exam',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to book an appointment')
      navigate('/auth/login')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/appointments', formData)
      toast.success('Appointment booked successfully!')
      navigate('/dashboard/appointments')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Book Eye Test
        </h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="label flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Time</span>
                </label>
                <input
                  type="time"
                  className="input"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Appointment Type</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="eye-exam">Eye Exam</option>
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="fitting">Fitting</option>
              </select>
            </div>

            <div>
              <label className="label">Notes (Optional)</label>
              <textarea
                className="input"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special requirements or notes..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </PublicLayout>
  )
}

