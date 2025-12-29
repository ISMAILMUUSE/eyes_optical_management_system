import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Eye, LogIn, Moon, Sun } from 'lucide-react'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const getDashboardLink = () => {
    if (!user) return '/auth/login'
    if (user.role === 'admin' || user.role === 'staff') return '/dashboard/overview'
    return '/dashboard/overview'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EOMS</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to={getDashboardLink()} className="btn btn-primary flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/auth/login" className="btn btn-primary flex items-center space-x-2">
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

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4 mt-auto">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Eyes Optical Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

