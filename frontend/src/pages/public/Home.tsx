import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Shield, Clock, MapPin, ArrowRight } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout'

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Eyes Optical Management System
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Comprehensive optical store management, inventory tracking, and customer care platform
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/auth/register" className="btn btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/public/book-eye-test" className="btn btn-outline text-lg px-8 py-3">
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
            System Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: 'Comprehensive Eye Exams',
                description: 'Advanced eye examination management and scheduling system'
              },
              {
                icon: Shield,
                title: 'Prescription Management',
                description: 'Digital prescription tracking and customer record management'
              },
              {
                icon: Clock,
                title: 'Appointment Booking',
                description: 'Streamlined appointment scheduling and calendar management'
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
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">
              Access the management system or book your eye test today
            </p>
            <Link
              to="/auth/login"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}

