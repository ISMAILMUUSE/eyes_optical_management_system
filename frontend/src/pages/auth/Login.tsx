import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AuthLayout from '../../layouts/AuthLayout'
import { LogIn } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard/overview', { replace: true })
    }
  }, [user, navigate, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      // Navigation handled by useEffect above
    } catch (error) {
      // Error handled by toast in login function
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Sign in to your account" subtitle="Eyes Optical Management System">
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-primary-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mb-2">
            Demo Credentials:
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
            <p>Admin: admin@hadadi.com / admin123</p>
            <p>Staff: staff@hadadi.com / staff123</p>
            <p>Customer: john@example.com / customer123</p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

