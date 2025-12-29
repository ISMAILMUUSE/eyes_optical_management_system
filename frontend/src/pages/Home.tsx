import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Shield, Clock, MapPin, ArrowRight, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (user.role === 'admin' || user.role === 'staff') return '/admin/dashboard'
    return '/customer/dashboard'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hadadi Eyes Optical</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to={getDashboardLink()} className="btn btn-primary flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Smart Vision Care, Powered by Data
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience precision eye care with cutting-edge technology and personalized service
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline text-lg px-8 py-3">
                Book Eye Test
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Our Services
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: 'Comprehensive Eye Exams',
                description: 'Advanced eye examinations using state-of-the-art equipment'
              },
              {
                icon: Shield,
                title: 'Prescription Management',
                description: 'Digital prescription tracking and management system'
              },
              {
                icon: Clock,
                title: 'Appointment Booking',
                description: 'Easy online scheduling for your convenience'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center"
              >
                <service.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {service.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Visit Our Stores
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Downtown Location',
                address: '123 Main Street, New York, NY 10001',
                hours: 'Mon-Sat: 9AM-7PM, Sun: 10AM-5PM'
              },
              {
                name: 'Mall Location',
                address: '456 Shopping Center, Los Angeles, CA 90001',
                hours: 'Mon-Sun: 10AM-9PM'
              }
            ].map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="card"
              >
                <MapPin className="w-8 h-8 mb-4 text-primary-600" />
                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {location.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{location.address}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{location.hours}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Improve Your Vision?</h3>
            <p className="text-xl mb-8 opacity-90">
              Book your eye test today and experience the difference
            </p>
            <Link
              to={user ? getDashboardLink() : '/register'}
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Hadadi Eyes Optical. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

