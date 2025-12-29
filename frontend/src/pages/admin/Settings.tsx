import AdminLayout from '../../components/AdminLayout'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon } from 'lucide-react'

export default function AdminSettings() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="card max-w-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">System Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="label">Store Name</label>
              <input type="text" className="input" defaultValue="Hadadi Eyes Optical" />
            </div>

            <div>
              <label className="label">Store Email</label>
              <input type="email" className="input" defaultValue="info@hadadi.com" />
            </div>

            <div>
              <label className="label">Store Phone</label>
              <input type="tel" className="input" defaultValue="+1 (555) 123-4567" />
            </div>

            <div>
              <label className="label">Tax Rate (%)</label>
              <input type="number" className="input" defaultValue="10" step="0.1" />
            </div>

            <div>
              <label className="label">Shipping Cost</label>
              <input type="number" className="input" defaultValue="15" step="0.01" />
            </div>

            <div className="flex space-x-4">
              <button className="btn btn-primary">Save Settings</button>
              <button className="btn btn-secondary">Reset</button>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

