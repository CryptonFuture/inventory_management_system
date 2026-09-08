import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  FileText,
  Layers3,
} from 'lucide-react';
import '../css/Category.css'

const Categories = () => {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');

  const canManage =
    user?.role === 'admin' || user?.role === 'manager';

  const fetch = () => {
    setLoading(true);

    api.get('/categories')
      .then((r) => setCategories(r.data.categories))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      description: '',
    });
    setError('');
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, form);
      } else {
        await api.post('/categories', form);
      }

      setShowModal(false);
      fetch();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Operation failed'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await api.delete(`/categories/${id}`);
      fetch();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Delete failed'
      );
    }
  };

  return (
    <div className="categories-page">

      {/* Header */}
      <div className="categories-header">

        <div className="categories-title">
          <div className="categories-title-icon">
            <FolderTree size={24} />
          </div>

          <div>
            <h2>Categories</h2>
            <p>
              Organize and manage your inventory categories
            </p>
          </div>
        </div>

        {canManage && (
          <button
            className="btn btn-primary category-add-btn"
            onClick={openCreate}
          >
            <Plus size={18} />
            Add Category
          </button>
        )}

      </div>

      {/* Stats */}
      <div className="category-stats">

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <Layers3 size={20} />
          </div>

          <div>
            <span>Total Categories</span>
            <strong>{categories.length}</strong>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <FileText size={20} />
          </div>

          <div>
            <span>With Description</span>
            <strong>
              {
                categories.filter(
                  (c) => c.description?.trim()
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Latest Category</span>
            <strong className="stat-category-name">
              {categories.length > 0
                ? (
                  [...categories]
                    .filter((c) => c && c.name)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                    )[0]?.name || '—'
                )
                : '—'}
            </strong>
          </div>
        </div>

      </div>

      {/* Main Card */}
      <div className="card categories-card">

        <div className="categories-card-header">
          <div>
            <h3>All Categories</h3>
            <p>
              Manage your inventory classification
            </p>
          </div>

          <div className="category-count">
            {categories.length}{" "}
            {categories.length === 1
              ? 'Category'
              : 'Categories'}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="categories-loading">
            <div className="premium-loader" />
            <span>Loading categories...</span>
          </div>

        ) : categories.length === 0 ? (

          /* Empty */
          <div className="category-empty">

            <div className="category-empty-icon">
              <FolderTree size={32} />
            </div>

            <h3>No categories yet</h3>

            <p>
              Create your first category to start
              organizing your inventory.
            </p>

            {canManage && (
              <button
                className="btn btn-primary"
                onClick={openCreate}
              >
                <Plus size={17} />
                Create Category
              </button>
            )}

          </div>

        ) : (

          /* Table */
          <div className="table-container premium-table-container">
            <table className="premium-table">

              <thead>
                <tr>
                  <th>
                    <span className="table-heading">
                      Category
                    </span>
                  </th>

                  <th>
                    <span className="table-heading">
                      Description
                    </span>
                  </th>

                  <th>
                    <span className="table-heading">
                      Created
                    </span>
                  </th>

                  {canManage && (
                    <th className="actions-column">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {categories.map((c, index) => (

                  <tr
                    key={c._id}
                    className="category-row"
                  >

                    {/* Name */}
                    <td>
                      <div className="category-name-cell">

                        <div className="category-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div>
                          <strong>
                            {c.name}
                          </strong>

                          <span>
                            Inventory Category
                          </span>
                        </div>

                      </div>
                    </td>

                    {/* Description */}
                    <td>
                      <div className="category-description">
                        {c.description ? (
                          c.description
                        ) : (
                          <span className="no-description">
                            No description
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="category-date">
                        <CalendarDays size={15} />

                        <span>
                          {new Date(
                            c.createdAt
                          ).toLocaleDateString(
                            undefined,
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    {canManage && (
                      <td>
                        <div className="category-actions">

                          <button
                            className="category-action edit"
                            onClick={() =>
                              openEdit(c)
                            }
                            title="Edit category"
                          >
                            <Pencil size={16} />
                          </button>

                          {user?.role === 'admin' && (
                            <button
                              className="category-action delete"
                              onClick={() =>
                                handleDelete(c._id)
                              }
                              title="Delete category"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}

                        </div>
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay premium-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="modal premium-category-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="premium-modal-header">

              <div className="modal-title-wrapper">

                <div className="modal-icon">
                  {editing ? (
                    <Pencil size={20} />
                  ) : (
                    <FolderTree size={20} />
                  )}
                </div>

                <div>
                  <h3>
                    {editing
                      ? 'Edit Category'
                      : 'Add Category'}
                  </h3>

                  <p>
                    {editing
                      ? 'Update category information'
                      : 'Create a new inventory category'}
                  </p>
                </div>

              </div>

              <button
                className="modal-close premium-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={19} />
              </button>

            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              <div className="form-group premium-form-group">

                <label>
                  Category Name
                  <span>*</span>
                </label>

                <input
                  className="form-control premium-modal-input"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Electronics"
                  required
                />

              </div>

              <div className="form-group premium-form-group">

                <label>
                  Description
                </label>

                <textarea
                  className="form-control premium-modal-input premium-textarea"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="Describe this category..."
                />

                <small>
                  Add a short description to make
                  the category easier to identify.
                </small>

              </div>

              {/* Modal Footer */}
              <div className="premium-modal-footer">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary premium-save-btn"
                >
                  {editing ? (
                    <>
                      <Pencil size={16} />
                      Update Category
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Category
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Categories;

