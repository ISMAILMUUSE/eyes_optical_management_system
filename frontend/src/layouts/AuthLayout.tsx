import { ReactNode } from 'react'
import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Eye className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Eyes Optical Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{subtitle || title}</p>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

