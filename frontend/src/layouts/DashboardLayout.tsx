import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Tags,
  LogOut,
  Moon,
  Sun,
  Eye,
  User
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Determine navigation items based on user role
  const getNavItems = () => {
    if (user?.role === 'admin' || user?.role === 'staff') {
      return [
        { path: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
        { path: '/dashboard/products', icon: Package, label: 'Products' },
        { path: '/dashboard/categories', icon: Tags, label: 'Categories' },
        { path: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/dashboard/customers', icon: Users, label: 'Customers' },
        { path: '/dashboard/prescriptions', icon: FileText, label: 'Prescriptions' },
        { path: '/dashboard/appointments', icon: Calendar, label: 'Appointments' },
        { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        ...(user?.role === 'admin' ? [{ path: '/dashboard/settings', icon: Settings, label: 'Settings' }] : [])
      ]
    } else {
      return [
        { path: '/dashboard/overview', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/dashboard/profile', icon: User, label: 'Profile' },
        { path: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/dashboard/prescriptions', icon: FileText, label: 'Prescriptions' },
        { path: '/dashboard/appointments', icon: Calendar, label: 'Appointments' }
      ]
    }
  }

  const navItems = getNavItems()
  const isAdmin = user?.role === 'admin' || user?.role === 'staff'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">EOMS</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isAdmin ? 'Management System' : 'Customer Portal'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn btn-secondary flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

