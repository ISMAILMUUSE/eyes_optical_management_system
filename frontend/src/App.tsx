import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

// Public pages
import Home from './pages/public/Home'
import BookEyeTest from './pages/public/BookEyeTest'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboard pages (new structure)
import Overview from './pages/dashboard/Overview'
import Products from './pages/dashboard/Products'

// Legacy pages (for backward compatibility)
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerProfile from './pages/customer/Profile'
import CustomerOrders from './pages/customer/Orders'
import CustomerPrescriptions from './pages/customer/Prescriptions'
import CustomerAppointments from './pages/customer/Appointments'

import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminProductForm from './pages/admin/ProductForm'
import AdminOrders from './pages/admin/Orders'
import AdminCustomers from './pages/admin/Customers'
import AdminPrescriptions from './pages/admin/Prescriptions'
import AdminAppointments from './pages/admin/Appointments'
import AdminAnalytics from './pages/admin/Analytics'
import AdminCategories from './pages/admin/Categories'
import AdminSettings from './pages/admin/Settings'
import { useAuth } from './contexts/AuthContext'

// Wrapper components for role-based rendering
function DashboardOrdersWrapper() {
  const { user } = useAuth()
  return user?.role === 'admin' || user?.role === 'staff' ? <AdminOrders /> : <CustomerOrders />
}

function DashboardPrescriptionsWrapper() {
  const { user } = useAuth()
  return user?.role === 'admin' || user?.role === 'staff' ? <AdminPrescriptions /> : <CustomerPrescriptions />
}

function DashboardAppointmentsWrapper() {
  const { user } = useAuth()
  return user?.role === 'admin' || user?.role === 'staff' ? <AdminAppointments /> : <CustomerAppointments />
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/public/book-eye-test" element={<BookEyeTest />} />

              {/* Auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* Legacy auth routes (backward compatibility) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* New Dashboard routes */}
              <Route
                path="/dashboard/overview"
                element={
                  <PrivateRoute>
                    <Overview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/products"
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/products/new"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/products/:id/edit"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/orders"
                element={
                  <PrivateRoute>
                    <DashboardOrdersWrapper />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/customers"
                element={
                  <AdminRoute>
                    <AdminCustomers />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/prescriptions"
                element={
                  <PrivateRoute>
                    <DashboardPrescriptionsWrapper />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/appointments"
                element={
                  <PrivateRoute>
                    <DashboardAppointmentsWrapper />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <AdminRoute>
                    <AdminAnalytics />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/categories"
                element={
                  <AdminRoute>
                    <AdminCategories />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <PrivateRoute>
                    <CustomerProfile />
                  </PrivateRoute>
                }
              />

              {/* Legacy Customer routes (backward compatibility) */}
              <Route
                path="/customer/dashboard"
                element={
                  <PrivateRoute>
                    <CustomerDashboard />
                  </PrivateRoute>
                }
              />
            <Route
              path="/customer/profile"
              element={
                <PrivateRoute>
                  <CustomerProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/orders"
              element={
                <PrivateRoute>
                  <CustomerOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/prescriptions"
              element={
                <PrivateRoute>
                  <CustomerPrescriptions />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/appointments"
              element={
                <PrivateRoute>
                  <CustomerAppointments />
                </PrivateRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <AdminProductForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <AdminRoute>
                  <AdminProductForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminCustomers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/prescriptions"
              element={
                <AdminRoute>
                  <AdminPrescriptions />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <AdminRoute>
                  <AdminAppointments />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />

              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

