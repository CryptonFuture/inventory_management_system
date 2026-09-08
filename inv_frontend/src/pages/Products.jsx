import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  Boxes,
  Edit3,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Save,
  Tag,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Layers3,
} from 'lucide-react';
import '../css/Product.css';

const Products = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    supplier: '',
    price: '',
    costPrice: '',
    quantity: '',
    lowStockThreshold: 10,
    unit: 'pcs',
  });

  const [error, setError] = useState('');

  const [stockModal, setStockModal] = useState(null);
  const [stockQty, setStockQty] = useState('');
  const [stockOp, setStockOp] = useState('add');

  const canManage =
    user?.role === 'admin' || user?.role === 'manager';

  const fetchProducts = () => {
    setLoading(true);

    const params = {};

    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    if (lowStockOnly) params.lowStock = 'true';

    api
      .get('/products', { params })
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();

    api
      .get('/categories')
      .then((r) => setCategories(r.data.categories))
      .catch(console.error);

    api
      .get('/suppliers')
      .then((r) => setSuppliers(r.data.suppliers))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);

    return () => clearTimeout(t);
  }, [search, categoryFilter, lowStockOnly]);

  const openCreate = () => {
    setEditing(null);

    setForm({
      name: '',
      sku: '',
      description: '',
      category: '',
      supplier: '',
      price: '',
      costPrice: '',
      quantity: 0,
      lowStockThreshold: 10,
      unit: 'pcs',
    });

    setError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);

    setForm({
      name: p.name,
      sku: p.sku,
      description: p.description || '',
      category: p.category?._id || p.category || '',
      supplier: p.supplier?._id || p.supplier || '',
      price: p.price,
      costPrice: p.costPrice || 0,
      quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold,
      unit: p.unit || 'pcs',
    });

    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        costPrice: Number(form.costPrice) || 0,
        quantity: Number(form.quantity),
        lowStockThreshold: Number(form.lowStockThreshold),
        supplier: form.supplier || undefined,
      };

      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Operation failed'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(
        err.response?.data?.message || 'Delete failed'
      );
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.patch(
        `/products/${stockModal._id}/stock`,
        {
          quantity: Number(stockQty),
          operation: stockOp,
        }
      );

      setStockModal(null);
      setStockQty('');
      fetchProducts();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Stock update failed'
      );
    }
  };

  const lowStockCount = products.filter(
    (p) => p.quantity <= p.lowStockThreshold
  ).length;

  const inStockCount = products.filter(
    (p) => p.quantity > p.lowStockThreshold
  ).length;

  return (
    <div className="products-page">

      {/* ================= HEADER ================= */}
      <div className="products-header">

        <div className="products-title-section">
          <div className="products-title-icon">
            <Package size={25} />
          </div>

          <div>
            <h1>Products</h1>
            <p>
              Manage your inventory, stock levels and products
            </p>
          </div>
        </div>

        {canManage && (
          <button
            className="premium-add-btn"
            onClick={openCreate}
          >
            <Plus size={19} />
            <span>Add Product</span>
          </button>
        )}

      </div>

      {/* ================= SUMMARY ================= */}
      <div className="products-summary">

        <div className="summary-card">
          <div className="summary-icon blue">
            <Boxes size={21} />
          </div>

          <div>
            <span>Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>In Stock</span>
            <strong>{inStockCount}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon purple">
            <Layers3 size={21} />
          </div>

          <div>
            <span>Categories</span>
            <strong>{categories.length}</strong>
          </div>
        </div>

      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="products-filter-card">

        <div className="filter-heading">
          <Filter size={18} />
          <span>Inventory Filters</span>
        </div>

        <div className="products-filters">

          <div className="premium-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="premium-select">
            <Tag size={17} />

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              <option value="">
                All Categories
              </option>

              {categories.map((c) => (
                <option
                  key={c._id}
                  value={c._id}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <label className="low-stock-toggle">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) =>
                setLowStockOnly(e.target.checked)
              }
            />

            <span className="toggle-ui"></span>

            <span>
              Low Stock Only
            </span>
          </label>

          <button
            className="refresh-btn"
            onClick={fetchProducts}
            title="Refresh products"
          >
            <RefreshCw
              size={18}
              className={loading ? 'spinning' : ''}
            />
          </button>

        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="products-table-card">

        <div className="table-top">

          <div>
            <h3>Product Inventory</h3>
            <p>
              {products.length} products currently displayed
            </p>
          </div>

          <div className="inventory-live">
            <span></span>
            Live Inventory
          </div>

        </div>

        {loading ? (
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="products-empty">
            <div className="empty-icon">
              <Package size={35} />
            </div>

            <h3>No Products Found</h3>

            <p>
              Try changing your filters or add a new product.
            </p>

            {canManage && (
              <button
                className="premium-add-btn"
                onClick={openCreate}
              >
                <Plus size={18} />
                Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="premium-table-wrapper">

            <table className="premium-products-table">

              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>SKU</th>
                  <th>CATEGORY</th>
                  <th>SUPPLIER</th>
                  <th>PRICE</th>
                  <th>QUANTITY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>

                {products.map((p) => {

                  const isLowStock =
                    p.quantity <=
                    p.lowStockThreshold;

                  return (
                    <tr key={p._id}>

                      {/* Product */}
                      <td>

                        <div className="product-name-cell">

                          <div className="product-avatar">
                            <Package size={18} />
                          </div>

                          <div>
                            <strong>{p.name}</strong>

                            {p.description && (
                              <small>
                                {p.description.length > 35
                                  ? `${p.description.substring(
                                      0,
                                      35
                                    )}...`
                                  : p.description}
                              </small>
                            )}
                          </div>

                        </div>

                      </td>

                      {/* SKU */}
                      <td>
                        <span className="sku-badge">
                          {p.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="category-pill">
                          <Tag size={13} />
                          {p.category?.name || '-'}
                        </span>
                      </td>

                      {/* Supplier */}
                      <td>

                        <div className="supplier-cell">
                          <Truck size={15} />

                          <span>
                            {p.supplier?.name || '-'}
                          </span>
                        </div>

                      </td>

                      {/* Price */}
                      <td>

                        <div className="price-cell">
                          <DollarSign size={14} />
                          <strong>
                            Rs {Number(p.price).toLocaleString()}
                          </strong>
                        </div>

                      </td>

                      {/* Quantity */}
                      <td>

                        <span
                          className={
                            isLowStock
                              ? 'quantity-badge danger'
                              : 'quantity-badge success'
                          }
                        >
                          {p.quantity} {p.unit}
                        </span>

                      </td>

                      {/* Status */}
                      <td>

                        {isLowStock ? (
                          <span className="status-badge low">
                            <span></span>
                            Low Stock
                          </span>
                        ) : (
                          <span className="status-badge active">
                            <span></span>
                            In Stock
                          </span>
                        )}

                      </td>

                      {/* Actions */}
                      <td>

                        <div className="product-actions">

                          <button
                            className="icon-action stock"
                            title="Update Stock"
                            onClick={() => {
                              setStockModal(p);
                              setStockQty('');
                              setStockOp('add');
                            }}
                          >
                            <Boxes size={16} />
                          </button>

                          {canManage && (
                            <button
                              className="icon-action edit"
                              title="Edit Product"
                              onClick={() =>
                                openEdit(p)
                              }
                            >
                              <Edit3 size={16} />
                            </button>
                          )}

                          {user?.role === 'admin' && (
                            <button
                              className="icon-action delete"
                              title="Delete Product"
                              onClick={() =>
                                handleDelete(p._id)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ================= PRODUCT MODAL ================= */}
      {showModal && (

        <div
          className="premium-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="premium-modal product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="premium-modal-header">

              <div className="modal-heading">

                <div className="modal-icon">
                  {editing ? (
                    <Edit3 size={21} />
                  ) : (
                    <Package size={21} />
                  )}
                </div>

                <div>
                  <h3>
                    {editing
                      ? 'Edit Product'
                      : 'Add Product'}
                  </h3>

                  <p>
                    {editing
                      ? 'Update product information'
                      : 'Create a new inventory product'}
                  </p>
                </div>

              </div>

              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>

            </div>

            {error && (
              <div className="premium-error">
                <AlertTriangle size={17} />
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="premium-form"
            >

              <div className="form-section-title">
                <Package size={17} />
                Basic Information
              </div>

              <div className="premium-form-row">

                <div className="premium-form-group">
                  <label>Product Name *</label>

                  <input
                    className="premium-input"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="premium-form-group">
                  <label>SKU *</label>

                  <input
                    className="premium-input"
                    value={form.sku}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sku: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. PROD-001"
                    required
                    disabled={!!editing}
                  />
                </div>

              </div>

              <div className="premium-form-group">
                <label>Description</label>

                <textarea
                  className="premium-input premium-textarea"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter product description..."
                />
              </div>

              <div className="form-section-title">
                <Layers3 size={17} />
                Classification
              </div>

              <div className="premium-form-row">

                <div className="premium-form-group">
                  <label>Category *</label>

                  <select
                    className="premium-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">
                      Select category...
                    </option>

                    {categories.map((c) => (
                      <option
                        key={c._id}
                        value={c._id}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="premium-form-group">
                  <label>Supplier</label>

                  <select
                    className="premium-input"
                    value={form.supplier}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        supplier: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      None
                    </option>

                    {suppliers.map((s) => (
                      <option
                        key={s._id}
                        value={s._id}
                      >
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="form-section-title">
                <DollarSign size={17} />
                Pricing & Inventory
              </div>

              <div className="premium-form-row">

                <div className="premium-form-group">
                  <label>Price (Rs) *</label>

                  <input
                    type="number"
                    className="premium-input"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="premium-form-group">
                  <label>Cost Price</label>

                  <input
                    type="number"
                    className="premium-input"
                    value={form.costPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        costPrice: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

              </div>

              <div className="premium-form-row">

                <div className="premium-form-group">
                  <label>Quantity *</label>

                  <input
                    type="number"
                    className="premium-input"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantity: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>

                <div className="premium-form-group">
                  <label>Low Stock Threshold</label>

                  <input
                    type="number"
                    className="premium-input"
                    value={form.lowStockThreshold}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lowStockThreshold:
                          e.target.value,
                      })
                    }
                    min="0"
                  />
                </div>

              </div>

              <div className="premium-form-group">
                <label>Unit</label>

                <input
                  className="premium-input"
                  value={form.unit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      unit: e.target.value,
                    })
                  }
                  placeholder="pcs"
                />
              </div>

              <div className="premium-modal-footer">

                <button
                  type="button"
                  className="premium-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="premium-submit-btn"
                >
                  <Save size={17} />

                  {editing
                    ? 'Update Product'
                    : 'Create Product'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ================= STOCK MODAL ================= */}
      {stockModal && (

        <div
          className="premium-modal-overlay"
          onClick={() => setStockModal(null)}
        >

          <div
            className="premium-modal stock-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="premium-modal-header">

              <div className="modal-heading">

                <div className="modal-icon stock-icon">
                  <Boxes size={21} />
                </div>

                <div>
                  <h3>Update Stock</h3>

                  <p>
                    {stockModal.name}
                  </p>
                </div>

              </div>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setStockModal(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="current-stock-card">

              <div className="current-stock-icon">
                <Package size={21} />
              </div>

              <div>
                <span>Current Stock</span>
                <strong>
                  {stockModal.quantity}{' '}
                  {stockModal.unit}
                </strong>
              </div>

            </div>

            <form
              onSubmit={handleStockUpdate}
              className="premium-form"
            >

              <div className="premium-form-group">

                <label>Operation</label>

                <div className="stock-operation-grid">

                  <button
                    type="button"
                    className={
                      stockOp === 'add'
                        ? 'operation-card active add'
                        : 'operation-card'
                    }
                    onClick={() =>
                      setStockOp('add')
                    }
                  >
                    <ArrowUp size={19} />
                    <span>Add Stock</span>
                  </button>

                  <button
                    type="button"
                    className={
                      stockOp === 'subtract'
                        ? 'operation-card active subtract'
                        : 'operation-card'
                    }
                    onClick={() =>
                      setStockOp('subtract')
                    }
                  >
                    <ArrowDown size={19} />
                    <span>Subtract</span>
                  </button>

                  <button
                    type="button"
                    className={
                      stockOp === 'set'
                        ? 'operation-card active set'
                        : 'operation-card'
                    }
                    onClick={() =>
                      setStockOp('set')
                    }
                  >
                    <Save size={18} />
                    <span>Set Exact</span>
                  </button>

                </div>

              </div>

              <div className="premium-form-group">

                <label>Quantity</label>

                <input
                  type="number"
                  className="premium-input stock-quantity-input"
                  value={stockQty}
                  onChange={(e) =>
                    setStockQty(e.target.value)
                  }
                  placeholder="Enter quantity"
                  required
                  min="0"
                />

              </div>

              <div className="premium-modal-footer">

                <button
                  type="button"
                  className="premium-cancel-btn"
                  onClick={() =>
                    setStockModal(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="premium-submit-btn"
                >
                  <Boxes size={17} />
                  Update Stock
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Products;