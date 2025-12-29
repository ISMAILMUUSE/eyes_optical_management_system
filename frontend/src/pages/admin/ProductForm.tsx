import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    brand: '',
    frameType: 'full-rim',
    gender: 'unisex',
    material: '',
    color: '',
    stock: '',
    lowStockThreshold: '10',
    isFeatured: false,
    images: [] as string[]
  })

  useEffect(() => {
    fetchCategories()
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`)
      const product = response.data
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        comparePrice: product.comparePrice?.toString() || '',
        category: product.category?._id || '',
        brand: product.brand || '',
        frameType: product.frameType || 'full-rim',
        gender: product.gender || 'unisex',
        material: product.material || '',
        color: product.color || '',
        stock: product.stock?.toString() || '',
        lowStockThreshold: product.lowStockThreshold?.toString() || '10',
        isFeatured: product.isFeatured || false,
        images: product.images || []
      })
    } catch (error) {
      toast.error('Failed to load product')
      navigate('/admin/products')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold)
      }

      if (id) {
        await axios.put(`/api/products/${id}`, productData)
        toast.success('Product updated successfully')
      } else {
        await axios.post('/api/products', productData)
        toast.success('Product created successfully')
      }

      navigate('/admin/products')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>

        <div className="card max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Product Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                className="input"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="label">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Compare Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Stock *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Frame Type *</label>
                <select
                  className="input"
                  value={formData.frameType}
                  onChange={(e) => setFormData({ ...formData, frameType: e.target.value })}
                  required
                >
                  <option value="full-rim">Full Rim</option>
                  <option value="semi-rimless">Semi-Rimless</option>
                  <option value="rimless">Rimless</option>
                  <option value="sports">Sports</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="label">Gender</label>
                <select
                  className="input"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="label">Brand</label>
                <input
                  type="text"
                  className="input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Material</label>
                <input
                  type="text"
                  className="input"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Color</label>
                <input
                  type="text"
                  className="input"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Low Stock Threshold</label>
              <input
                type="number"
                className="input"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                Mark as featured product
              </label>
            </div>

            <div className="flex space-x-4">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AdminLayout>
  )
}

